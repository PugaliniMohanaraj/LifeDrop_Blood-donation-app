package com.bloodbridge.service;

import com.bloodbridge.config.StockThresholds;
import com.bloodbridge.domain.*;
import com.bloodbridge.dto.Dtos.*;
import com.bloodbridge.repository.AppNotificationRepository;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.BloodStockRepository;
import com.bloodbridge.repository.DonationInviteRepository;
import com.bloodbridge.repository.OrganizationRepository;
import com.bloodbridge.repository.UserAccountRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
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
    private final DonationInviteRepository invites;
    private final AppNotificationRepository notifications;

    public AppService(
            BloodRequestRepository requests,
            OrganizationRepository organizations,
            BloodStockRepository stock,
            UserAccountRepository users,
            DonationInviteRepository invites,
            AppNotificationRepository notifications) {
        this.requests = requests;
        this.organizations = organizations;
        this.stock = stock;
        this.users = users;
        this.invites = invites;
        this.notifications = notifications;
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
        br.setMatchCount((int) Math.max(matches, 0));
        BloodRequest saved = requests.save(br);

        notifyUser(
                user.getId(),
                "Blood request created",
                "We are finding suitable donors for " + saved.getBloodGroup().getLabel() + ".",
                "info",
                saved.getId(),
                null);
        return saved;
    }

    public List<BloodRequest> listRequests() {
        return requests.findAllByOrderByCreatedAtDesc();
    }

    public List<BloodRequest> listMyRequests(Long recipientId) {
        return requests.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    public List<BloodRequest> listRequestsForDonor(Long donorId) {
        return invites.findByDonorIdOrderByCreatedAtDesc(donorId).stream()
                .map(inv -> requests.findById(inv.getRequestId()).orElse(null))
                .filter(r -> r != null)
                .filter(r -> r.getStatus() != RequestStatus.CANCELLED)
                .toList();
    }

    public BloodRequest getRequest(Long id) {
        return requests.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("This blood request could not be found."));
    }

    @Transactional
    public BloodRequest cancel(Long id, UserAccount user) {
        BloodRequest br = getRequest(id);
        if (!br.getRecipientId().equals(user.getId()) && user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("You can only cancel your own blood requests.");
        }
        br.setStatus(RequestStatus.CANCELLED);
        return requests.save(br);
    }

    @Transactional
    public DonationInvite sendInvite(UserAccount sender, Long requestId, Long donorId) {
        BloodRequest br = getRequest(requestId);
        if (!br.getRecipientId().equals(sender.getId())
                && sender.getRole() != UserRole.HOSPITAL
                && sender.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("You can only invite donors for your own blood request.");
        }
        if (br.getStatus() == RequestStatus.CANCELLED || br.getStatus() == RequestStatus.COMPLETED) {
            throw new IllegalArgumentException("This blood request is no longer open.");
        }

        UserAccount donor = users.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("That donor could not be found."));
        if (donor.getRole() != UserRole.DONOR) {
            throw new IllegalArgumentException("Please choose a registered donor.");
        }

        if (invites.existsByRequestIdAndDonorIdAndStatus(requestId, donorId, InviteStatus.PENDING)
                || invites.existsByRequestIdAndDonorIdAndStatus(requestId, donorId, InviteStatus.ACCEPTED)) {
            throw new IllegalArgumentException("You already sent a request to this donor.");
        }

        DonationInvite invite = new DonationInvite();
        invite.setRequestId(requestId);
        invite.setDonorId(donorId);
        invite.setRecipientId(br.getRecipientId());
        invite.setStatus(InviteStatus.PENDING);
        invites.save(invite);

        br.setStatus(RequestStatus.MATCHING);
        requests.save(br);

        notifyUser(
                donorId,
                "New blood request",
                br.getBloodGroup().getLabel() + " · " + br.getUnits() + " units needed at "
                        + br.getHospital() + ".",
                br.getUrgency() == RequestUrgency.EMERGENCY ? "critical" : "warning",
                requestId,
                invite.getId());

        notifyUser(
                br.getRecipientId(),
                "Request sent to donor",
                "Your request was sent to " + donor.getFullName() + ".",
                "success",
                requestId,
                invite.getId());

        return invite;
    }

    @Transactional
    public BloodRequest acceptInvite(Long requestId, UserAccount donor) {
        if (donor.getRole() != UserRole.DONOR) {
            throw new IllegalArgumentException("Only donors can accept donation requests.");
        }
        BloodRequest br = getRequest(requestId);
        DonationInvite invite = invites.findByRequestIdAndDonorId(requestId, donor.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "You were not invited to this blood request."));

        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new IllegalArgumentException("This invitation was already answered.");
        }
        if (br.getStatus() == RequestStatus.CANCELLED || br.getStatus() == RequestStatus.COMPLETED) {
            throw new IllegalArgumentException("This blood request is no longer open.");
        }

        invite.setStatus(InviteStatus.ACCEPTED);
        invite.setRespondedAt(Instant.now());
        invites.save(invite);

        br.setStatus(RequestStatus.DONOR_ACCEPTED);
        br.setAcceptedDonorId(donor.getId());
        requests.save(br);

        donor.setTotalDonations((donor.getTotalDonations() == null ? 0 : donor.getTotalDonations()) + 1);
        users.save(donor);

        notifyUser(
                br.getRecipientId(),
                "Request Accepted",
                donor.getFullName() + " accepted your " + br.getBloodGroup().getLabel() + " blood request.",
                "success",
                requestId,
                invite.getId());

        notifyUser(
                donor.getId(),
                "You accepted a request",
                "Thank you. Please coordinate with " + br.getHospital() + ".",
                "success",
                requestId,
                invite.getId());

        return br;
    }

    @Transactional
    public DonationInvite declineInvite(Long requestId, UserAccount donor) {
        DonationInvite invite = invites.findByRequestIdAndDonorId(requestId, donor.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "You were not invited to this blood request."));
        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new IllegalArgumentException("This invitation was already answered.");
        }
        invite.setStatus(InviteStatus.DECLINED);
        invite.setRespondedAt(Instant.now());
        invites.save(invite);

        BloodRequest br = getRequest(requestId);
        notifyUser(
                br.getRecipientId(),
                "Donor declined",
                "A donor declined your request. You can invite another available donor.",
                "warning",
                requestId,
                invite.getId());
        return invite;
    }

    /** Legacy accept without invite — kept for open nearby requests if no invite exists. */
    @Transactional
    public BloodRequest accept(Long id, UserAccount donor) {
        return acceptInvite(id, donor);
    }

    public List<Organization> allOrgs() {
        return organizations.findAll();
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
        organizations.save(org);

        users.findByEmailIgnoreCase(org.getEmail()).ifPresent(staff -> {
            staff.setVerified(true);
            staff.setOrganizationId(org.getId());
            staff.setOrganizationName(org.getName());
            users.save(staff);
            notifyUser(
                    staff.getId(),
                    "Organization approved",
                    org.getName() + " is verified. You can now sign in to organization features.",
                    "success",
                    null,
                    null);
        });

        if (stock.findByOrganizationId(org.getId()).isEmpty()) {
            seedDefaultStock(org.getId());
        }
        return org;
    }

    @Transactional
    public Organization reject(Long id, String reason) {
        Organization org = getOrg(id);
        org.setStatus(VerificationStatus.REJECTED);
        org.setRejectionReason(reason.trim());
        organizations.save(org);
        users.findByEmailIgnoreCase(org.getEmail()).ifPresent(staff ->
                notifyUser(
                        staff.getId(),
                        "Organization application rejected",
                        reason.trim(),
                        "warning",
                        null,
                        null));
        return org;
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
        return updateStock(organizationId, group, BloodComponent.WHOLE_BLOOD, units);
    }

    @Transactional
    public BloodStock updateStock(
            Long organizationId, BloodGroup group, BloodComponent component, int units) {
        BloodStock item = stock.findByOrganizationIdAndBloodGroupAndComponent(
                        organizationId, group, component)
                .or(() -> stock.findByOrganizationIdAndBloodGroup(organizationId, group))
                .orElseGet(() -> {
                    BloodStock s = new BloodStock();
                    s.setOrganizationId(organizationId);
                    s.setBloodGroup(group);
                    s.setComponent(component);
                    return s;
                });
        item.setComponent(component);
        item.setUnits(units);
        item.setLevel(levelFor(units));
        item.setLastUpdated(Instant.now());
        return stock.save(item);
    }

    public List<Map<String, Object>> matches(BloodGroup group) {
        return users.findByRole(UserRole.DONOR).stream()
                .filter(d -> group == null || d.getBloodGroup() == group)
                .map(d -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", d.getId());
                    m.put("name", d.getFullName());
                    m.put("bloodGroup", d.getBloodGroup() == null ? null : d.getBloodGroup().getLabel());
                    m.put("available", d.getAvailability() == AvailabilityStatus.AVAILABLE);
                    m.put("eligible", true);
                    m.put("distanceKm", 2.5 + (d.getId() % 5) * 0.7);
                    int score = 70;
                    if (d.getAvailability() == AvailabilityStatus.AVAILABLE) score += 15;
                    if (group != null && d.getBloodGroup() == group) score += 10;
                    m.put("matchScore", Math.min(score, 98));
                    return m;
                })
                .toList();
    }

    public List<NotificationResponse> listNotifications(Long userId) {
        return notifications.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> new NotificationResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getType(),
                        n.isReadFlag(),
                        n.getCreatedAt().toString(),
                        n.getRelatedRequestId(),
                        n.getRelatedInviteId()))
                .toList();
    }

    @Transactional
    public void dismissNotification(Long userId, Long notificationId) {
        AppNotification n = notifications.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));
        if (!n.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only dismiss your own notifications.");
        }
        notifications.delete(n);
    }

    @Transactional
    public void markNotificationRead(Long userId, Long notificationId) {
        AppNotification n = notifications.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));
        if (!n.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own notifications.");
        }
        n.setReadFlag(true);
        notifications.save(n);
    }

    public PlatformStats platformStats() {
        long activeDonors = users.findByRole(UserRole.DONOR).stream()
                .filter(d -> d.getAvailability() == AvailabilityStatus.AVAILABLE)
                .count();
        Instant startOfDay = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);
        long requestsToday = requests.findAll().stream()
                .filter(r -> r.getCreatedAt() != null && !r.getCreatedAt().isBefore(startOfDay))
                .count();
        long hospitals = organizations.findAll().stream()
                .filter(o -> o.getType() == OrgType.HOSPITAL && o.getStatus() == VerificationStatus.APPROVED)
                .count();
        long pendingInvites = invites.countByStatus(InviteStatus.PENDING);
        long completed = requests.findAll().stream()
                .filter(r -> r.getStatus() == RequestStatus.COMPLETED || r.getStatus() == RequestStatus.DONOR_ACCEPTED)
                .count();
        return new PlatformStats(activeDonors, requestsToday, hospitals, pendingInvites, completed);
    }

    private void notifyUser(
            Long userId,
            String title,
            String message,
            String type,
            Long requestId,
            Long inviteId) {
        AppNotification n = new AppNotification();
        n.setUserId(userId);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setRelatedRequestId(requestId);
        n.setRelatedInviteId(inviteId);
        notifications.save(n);
    }

    private void seedDefaultStock(Long orgId) {
        Object[][] rows = {
                {BloodGroup.O_POS, 18}, {BloodGroup.A_POS, 12}, {BloodGroup.B_POS, 6},
                {BloodGroup.AB_POS, 2}, {BloodGroup.O_NEG, 1}, {BloodGroup.A_NEG, 8},
                {BloodGroup.B_NEG, 4}, {BloodGroup.AB_NEG, 3}
        };
        for (Object[] row : rows) {
            BloodStock s = new BloodStock();
            s.setOrganizationId(orgId);
            s.setBloodGroup((BloodGroup) row[0]);
            s.setComponent(BloodComponent.WHOLE_BLOOD);
            int units = (Integer) row[1];
            s.setUnits(units);
            s.setLevel(levelFor(units));
            s.setLastUpdated(Instant.now());
            stock.save(s);
        }
    }

    public static StockLevel levelFor(int units) {
        if (units <= 0) return StockLevel.CRITICAL;
        if (units <= StockThresholds.LOW_STOCK_MAX_UNITS) return StockLevel.LOW;
        return StockLevel.AVAILABLE;
    }
}
