package com.bloodbridge.config;

import com.bloodbridge.domain.*;
import com.bloodbridge.repository.BloodStockRepository;
import com.bloodbridge.repository.OrganizationRepository;
import com.bloodbridge.service.AppService;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Ensures demo Sri Lankan availability data exists (patch for existing databases). */
@Configuration
public class AvailabilityDataSeeder {

    @Bean
    CommandLineRunner seedAvailability(OrganizationRepository orgs, BloodStockRepository stock) {
        return args -> {
            patchOrg(orgs, stock, "Jaffna Teaching Hospital", OrgType.HOSPITAL,
                    "Northern", "Jaffna", "Hospital Road, Jaffna",
                    new int[][] {{18, 12, 6, 2, 1, 8, 4, 3}});

            patchOrg(orgs, stock, "National Blood Bank", OrgType.BLOOD_BANK,
                    "Western", "Colombo", "555/5D Elvitigala Mawatha, Narahenpita, Colombo 05",
                    new int[][] {{22, 15, 9, 5, 3, 10, 6, 4}});

            ensureOrg(orgs, stock, "Teaching Hospital Kandy", OrgType.HOSPITAL,
                    "HSP-KDY-001", "kandy.th@bloodbridge.com", "+94812234567",
                    "Central", "Kandy", "Peradeniya Road, Kandy",
                    new int[][] {{6, 10, 4, 1, 0, 7, 2, 1}});

            ensureOrg(orgs, stock, "Karapitiya Teaching Hospital", OrgType.HOSPITAL,
                    "HSP-GAL-002", "karapitiya@bloodbridge.com", "+94912256789",
                    "Southern", "Galle", "Karapitiya, Galle",
                    new int[][] {{14, 8, 5, 3, 2, 9, 3, 2}});

            ensureOrg(orgs, stock, "Batticaloa Teaching Hospital", OrgType.HOSPITAL,
                    "HSP-BAT-003", "batticaloa@bloodbridge.com", "+94652223456",
                    "Eastern", "Batticaloa", "Fort Road, Batticaloa",
                    new int[][] {{9, 7, 3, 1, 0, 5, 2, 1}});

            ensureOrg(orgs, stock, "Anuradhapura General Hospital", OrgType.HOSPITAL,
                    "HSP-ANU-004", "anuradhapura@bloodbridge.com", "+94252227890",
                    "North Central", "Anuradhapura", "Old Kandy Road, Anuradhapura",
                    new int[][] {{11, 6, 4, 2, 1, 6, 3, 2}});

            ensureOrg(orgs, stock, "NBTS Kurunegala Blood Bank", OrgType.BLOOD_BANK,
                    "BB-KUR-005", "kurunegala.bb@bloodbridge.com", "+94372224567",
                    "North Western", "Kurunegala", "Kurunegala",
                    new int[][] {{16, 9, 7, 4, 2, 8, 5, 3}});
        };
    }

    private static void patchOrg(
            OrganizationRepository orgs,
            BloodStockRepository stock,
            String name,
            OrgType type,
            String province,
            String district,
            String address,
            int[][] unitRows) {
        orgs.findAll().stream()
                .filter(o -> o.getName().equalsIgnoreCase(name))
                .findFirst()
                .ifPresent(o -> {
                    o.setProvince(province);
                    o.setDistrict(district);
                    o.setAddress(address);
                    if (o.getStatus() == VerificationStatus.APPROVED) {
                        seedIfEmpty(stock, o.getId(), unitRows[0]);
                    }
                    orgs.save(o);
                });
    }

    private static void ensureOrg(
            OrganizationRepository orgs,
            BloodStockRepository stock,
            String name,
            OrgType type,
            String regNo,
            String email,
            String phone,
            String province,
            String district,
            String address,
            int[][] unitRows) {
        if (orgs.findAll().stream().anyMatch(o -> o.getName().equalsIgnoreCase(name))) return;

        Organization org = new Organization();
        org.setName(name);
        org.setType(type);
        org.setRegistrationNumber(regNo);
        org.setEmail(email);
        org.setPhone(phone);
        org.setAddress(address);
        org.setProvince(province);
        org.setDistrict(district);
        org.setStaffId("STF-" + regNo);
        org.setDocumentName("license.pdf");
        org.setStatus(VerificationStatus.APPROVED);
        orgs.save(org);
        seedIfEmpty(stock, org.getId(), unitRows[0]);
    }

    private static void seedIfEmpty(BloodStockRepository stock, Long orgId, int[] unitsByGroup) {
        if (!stock.findByOrganizationId(orgId).isEmpty()) return;
        BloodGroup[] groups = BloodGroup.values();
        for (int i = 0; i < groups.length && i < unitsByGroup.length; i++) {
            int units = unitsByGroup[i];
            BloodStock s = new BloodStock();
            s.setOrganizationId(orgId);
            s.setBloodGroup(groups[i]);
            s.setComponent(BloodComponent.WHOLE_BLOOD);
            s.setUnits(units);
            s.setLevel(AppService.levelFor(units));
            s.setLastUpdated(Instant.now().minusSeconds(600L * (i + 1)));
            stock.save(s);
        }
    }
}
