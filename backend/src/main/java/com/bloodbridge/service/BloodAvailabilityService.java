package com.bloodbridge.service;

import com.bloodbridge.config.StockThresholds;
import com.bloodbridge.domain.*;
import com.bloodbridge.dto.Dtos.BloodAvailabilityDetail;
import com.bloodbridge.dto.Dtos.BloodAvailabilityItem;
import com.bloodbridge.repository.BloodStockRepository;
import com.bloodbridge.repository.OrganizationRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BloodAvailabilityService {

    public static final String SOURCE_TYPE_ORGANIZATION = "ORGANIZATION";
    public static final String SOURCE_NAME_NBTS =
            "National Blood Transfusion Service (NBTS), Sri Lanka - demo organization inventory";

    private final OrganizationRepository organizations;
    private final BloodStockRepository stock;

    public BloodAvailabilityService(OrganizationRepository organizations, BloodStockRepository stock) {
        this.organizations = organizations;
        this.stock = stock;
    }

    public List<BloodAvailabilityItem> search(
            String province,
            String district,
            String bloodGroup,
            String component,
            String availability,
            String search) {
        BloodGroup groupFilter = parseBloodGroup(bloodGroup);
        BloodComponent componentFilter = parseComponent(component);
        String availabilityFilter = normalizeAvailability(availability);

        List<Organization> approved = organizations.findByStatus(VerificationStatus.APPROVED).stream()
                .filter(o -> matchesProvince(o, province))
                .filter(o -> matchesDistrict(o, district))
                .filter(o -> matchesSearch(o, search))
                .toList();

        if (approved.isEmpty()) return List.of();

        List<Long> orgIds = approved.stream().map(Organization::getId).toList();
        List<BloodStock> rows = stock.findByOrganizationIdIn(orgIds).stream()
                .filter(s -> groupFilter == null || s.getBloodGroup() == groupFilter)
                .filter(s -> componentFilter == null || s.getComponent() == componentFilter)
                .toList();

        List<BloodAvailabilityItem> results = new ArrayList<>();
        for (BloodStock row : rows) {
            Organization org = approved.stream()
                    .filter(o -> o.getId().equals(row.getOrganizationId()))
                    .findFirst()
                    .orElse(null);
            if (org == null) continue;

            String status = publicStatus(row.getUnits(), row.getLevel());
            if (!matchesAvailabilityFilter(status, availabilityFilter)) continue;

            results.add(toItem(org, row, status));
        }

        results.sort(Comparator
                .comparing(BloodAvailabilityItem::province, Comparator.nullsLast(String::compareTo))
                .thenComparing(BloodAvailabilityItem::district, Comparator.nullsLast(String::compareTo))
                .thenComparing(BloodAvailabilityItem::organizationName));

        return results;
    }

    public BloodAvailabilityDetail detail(
            Long organizationId, String bloodGroup, String component) {
        Organization org = organizations.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found."));
        if (org.getStatus() != VerificationStatus.APPROVED) {
            throw new IllegalArgumentException("This organization is not verified for public listing.");
        }

        BloodGroup groupFilter = parseBloodGroup(bloodGroup);
        BloodComponent componentFilter = parseComponent(component);

        List<BloodStock> inventory = stock.findByOrganizationId(org.getId()).stream()
                .filter(s -> groupFilter == null || s.getBloodGroup() == groupFilter)
                .filter(s -> componentFilter == null || s.getComponent() == componentFilter)
                .toList();

        BloodStock primary = inventory.stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No inventory found for this organization."));

        String status = publicStatus(primary.getUnits(), primary.getLevel());
        List<BloodAvailabilityItem> items = inventory.stream()
                .map(row -> toItem(org, row, publicStatus(row.getUnits(), row.getLevel())))
                .toList();

        return new BloodAvailabilityDetail(
                org.getId(),
                org.getName(),
                org.getType().name(),
                org.getProvince(),
                org.getDistrict(),
                org.getAddress(),
                org.getPhone(),
                org.getEmail(),
                true,
                SOURCE_TYPE_ORGANIZATION,
                SOURCE_NAME_NBTS,
                primary.getBloodGroup().getLabel(),
                primary.getComponent().getLabel(),
                primary.getUnits(),
                status,
                primary.getLastUpdated().toString(),
                items);
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
        item.setLevel(AppService.levelFor(units));
        item.setLastUpdated(Instant.now());
        return stock.save(item);
    }

    public static String publicStatus(int units, StockLevel level) {
        if (units == 0) return "CRITICAL";
        return switch (level) {
            case CRITICAL -> "CRITICAL";
            case LOW -> "LOW_STOCK";
            case AVAILABLE -> "AVAILABLE";
        };
    }

    private BloodAvailabilityItem toItem(Organization org, BloodStock row, String status) {
        return new BloodAvailabilityItem(
                org.getId(),
                org.getName(),
                org.getType().name(),
                org.getProvince(),
                org.getDistrict(),
                org.getAddress(),
                org.getPhone(),
                row.getBloodGroup().getLabel(),
                row.getComponent().getLabel(),
                row.getUnits(),
                status,
                true,
                SOURCE_TYPE_ORGANIZATION,
                SOURCE_NAME_NBTS,
                row.getLastUpdated().toString());
    }

    private static BloodGroup parseBloodGroup(String bloodGroup) {
        if (bloodGroup == null || bloodGroup.isBlank()) return null;
        return BloodGroup.fromLabel(bloodGroup.trim());
    }

    private static BloodComponent parseComponent(String component) {
        if (component == null || component.isBlank()) return BloodComponent.WHOLE_BLOOD;
        return BloodComponent.fromLabel(component.trim());
    }

    private static String normalizeAvailability(String availability) {
        if (availability == null || availability.isBlank() || "ALL".equalsIgnoreCase(availability)) {
            return "ALL";
        }
        return availability.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }

    private static boolean matchesAvailabilityFilter(String status, String filter) {
        if ("ALL".equals(filter)) return true;
        return status.equalsIgnoreCase(filter);
    }

    private static boolean matchesProvince(Organization org, String province) {
        if (province == null || province.isBlank()) return true;
        return province.equalsIgnoreCase(org.getProvince());
    }

    private static boolean matchesDistrict(Organization org, String district) {
        if (district == null || district.isBlank()) return true;
        return district.equalsIgnoreCase(org.getDistrict());
    }

    private static boolean matchesSearch(Organization org, String search) {
        if (search == null || search.isBlank()) return true;
        String q = search.trim().toLowerCase(Locale.ROOT);
        return org.getName().toLowerCase(Locale.ROOT).contains(q)
                || (org.getAddress() != null && org.getAddress().toLowerCase(Locale.ROOT).contains(q));
    }
}
