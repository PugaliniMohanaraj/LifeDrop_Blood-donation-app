package com.bloodbridge.service;

import com.bloodbridge.domain.*;
import com.bloodbridge.dto.Dtos.*;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.BloodStockRepository;
import com.bloodbridge.repository.OrganizationRepository;
import com.bloodbridge.repository.UserAccountRepository;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppService {

    private final BloodRequestRepository requests;
    private final OrganizationRepository organizations;
    private final BloodStockRepository stock;
    private final UserAccountRepository users;

    public AppService(
            BloodRequestRepository requests,
            OrganizationRepository organizations,
            BloodStockRepository stock,
            UserAccountRepository users) {
        this.requests = requests;
        this.organizations = organizations;
        this.stock = stock;
        this.users = users;
    }

    @Transactional
    public BloodRequest createRequest(UserAccount user, BloodRequestCreate req) {
        if (user.getRole() != UserRole.RECIPIENT && user.getRole() != UserRole.HOSPITAL) {
            throw new IllegalArgumentException("Only recipients can create blood requests here.");
        }
        BloodRequest br = new BloodRequest();
        br.setRecipientId(user.getId());
        br.setRecipientName(user.getFullName());
        br.setBloodGroup(BloodGroup.fromLabel(req.bloodGroup()));
        br.setUnits(req.units());
        br.setHospital(req.hospital().trim());
        br.setLocation(req.location().trim());
        br.setRequiredDate(LocalDate.parse(req.requiredDate()));
        br.setUrgency(req.urgency());
        br.setNotes(req.notes());
        br.setStatus(RequestStatus.FINDING_DONORS);
        long matches = users.findByRole(UserRole.DONOR).stream()
                .filter(d -> d.getBloodGroup() == br.getBloodGroup())
                .filter(d -> d.getAvailability() == AvailabilityStatus.AVAILABLE)
                .count();
        br.setMatchCount((int) Math.max(matches, 1));
        return requests.save(br);
    }

    public List<BloodRequest> listRequests() {
        return requests.findAllByOrderByCreatedAtDesc();
    }

    public List<BloodRequest> listMyRequests(Long recipientId) {
        return requests.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    @Transactional
    public BloodRequest cancel(Long id, UserAccount user) {
        BloodRequest br = requests.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("This blood request could not be found."));
        if (!br.getRecipientId().equals(user.getId()) && user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("You can only cancel your own blood requests.");
        }
        br.setStatus(RequestStatus.CANCELLED);
        return requests.save(br);
    }

    @Transactional
    public BloodRequest accept(Long id) {
        BloodRequest br = requests.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("This blood request could not be found."));
        br.setStatus(RequestStatus.DONOR_ACCEPTED);
        return requests.save(br);
    }

    public List<Organization> pendingOrgs() {
        return organizations.findByStatus(VerificationStatus.PENDING);
    }

    public Organization getOrg(Long id) {
        return organizations.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization application not found."));
    }

    @Transactional
    public Organization approve(Long id) {
        Organization org = getOrg(id);
        org.setStatus(VerificationStatus.APPROVED);
        org.setRejectionReason(null);
        return organizations.save(org);
    }

    @Transactional
    public Organization reject(Long id, String reason) {
        Organization org = getOrg(id);
        org.setStatus(VerificationStatus.REJECTED);
        org.setRejectionReason(reason.trim());
        return organizations.save(org);
    }

    @Transactional
    public UserAccount updateAvailability(UserAccount user, AvailabilityStatus status) {
        user.setAvailability(status);
        return users.save(user);
    }

    public List<BloodStock> stockFor(Long organizationId) {
        return stock.findByOrganizationId(organizationId);
    }

    @Transactional
    public BloodStock updateStock(Long organizationId, BloodGroup group, int units) {
        BloodStock item = stock.findByOrganizationIdAndBloodGroup(organizationId, group)
                .orElseGet(() -> {
                    BloodStock s = new BloodStock();
                    s.setOrganizationId(organizationId);
                    s.setBloodGroup(group);
                    return s;
                });
        item.setUnits(units);
        item.setLevel(levelFor(units));
        return stock.save(item);
    }

    public List<Map<String, Object>> matches(BloodGroup group) {
        return users.findByRole(UserRole.DONOR).stream()
                .filter(d -> d.getBloodGroup() == group || group == null)
                .map(d -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", d.getId());
                    m.put("name", d.getFullName());
                    m.put("bloodGroup", d.getBloodGroup() == null ? null : d.getBloodGroup().getLabel());
                    m.put("available", d.getAvailability() == AvailabilityStatus.AVAILABLE);
                    m.put("eligible", true);
                    m.put("distanceKm", 2.5);
                    m.put("matchScore", d.getAvailability() == AvailabilityStatus.AVAILABLE ? 90 : 70);
                    return m;
                })
                .toList();
    }

    public static StockLevel levelFor(int units) {
        if (units <= 2) return StockLevel.CRITICAL;
        if (units <= 6) return StockLevel.LOW;
        return StockLevel.AVAILABLE;
    }
}
