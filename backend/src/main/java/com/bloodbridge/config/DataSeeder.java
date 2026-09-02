package com.bloodbridge.config;

import com.bloodbridge.domain.*;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.BloodStockRepository;
import com.bloodbridge.repository.OrganizationRepository;
import com.bloodbridge.repository.UserAccountRepository;
import com.bloodbridge.service.AppService;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
            UserAccountRepository users,
            OrganizationRepository orgs,
            BloodRequestRepository requests,
            BloodStockRepository stock,
            PasswordEncoder encoder) {
        return args -> {
            if (users.count() > 0) return;

            UserAccount donor = user("Arun Kumar", "donor@bloodbridge.com", "+94771234567",
                    encoder.encode("password123"), UserRole.DONOR);
            donor.setBloodGroup(BloodGroup.O_POS);
            donor.setLocation("Jaffna");
            donor.setAvailability(AvailabilityStatus.AVAILABLE);
            donor.setTotalDonations(5);
            donor.setVerified(true);
            users.save(donor);

            UserAccount recipient = user("Nisha Perera", "recipient@bloodbridge.com", "+94772345678",
                    encoder.encode("password123"), UserRole.RECIPIENT);
            recipient.setLocation("Colombo");
            recipient.setVerified(true);
            users.save(recipient);

            Organization hospital = new Organization();
            hospital.setName("Jaffna Teaching Hospital");
            hospital.setType(OrgType.HOSPITAL);
            hospital.setRegistrationNumber("HSP-001");
            hospital.setEmail("hospital@bloodbridge.com");
            hospital.setPhone("+94773456789");
            hospital.setAddress("Hospital Road, Jaffna");
            hospital.setProvince("Northern");
            hospital.setDistrict("Jaffna");
            hospital.setStaffId("STF-100");
            hospital.setDocumentName("license.pdf");
            hospital.setStatus(VerificationStatus.APPROVED);
            orgs.save(hospital);

            UserAccount hospitalUser = user("Dr. Siva Rajan", "hospital@bloodbridge.com", "+94773456789",
                    encoder.encode("password123"), UserRole.HOSPITAL);
            hospitalUser.setOrganizationId(hospital.getId());
            hospitalUser.setOrganizationName(hospital.getName());
            hospitalUser.setVerified(true);
            users.save(hospitalUser);

            Organization bank = new Organization();
            bank.setName("National Blood Bank");
            bank.setType(OrgType.BLOOD_BANK);
            bank.setRegistrationNumber("BB-001");
            bank.setEmail("bloodbank@bloodbridge.com");
            bank.setPhone("+94774567890");
            bank.setAddress("555/5D Elvitigala Mawatha, Narahenpita, Colombo 05");
            bank.setProvince("Western");
            bank.setDistrict("Colombo");
            bank.setStaffId("STF-200");
            bank.setDocumentName("license.pdf");
            bank.setStatus(VerificationStatus.APPROVED);
            orgs.save(bank);

            UserAccount bankUser = user("Meena Fernando", "bloodbank@bloodbridge.com", "+94774567890",
                    encoder.encode("password123"), UserRole.BLOOD_BANK);
            bankUser.setOrganizationId(bank.getId());
            bankUser.setOrganizationName(bank.getName());
            bankUser.setVerified(true);
            users.save(bankUser);

            UserAccount admin = user("Admin User", "admin@bloodbridge.com", "+94770000000",
                    encoder.encode("password123"), UserRole.ADMIN);
            admin.setVerified(true);
            users.save(admin);

            Organization pending = new Organization();
            pending.setName("Northern Care Hospital");
            pending.setType(OrgType.HOSPITAL);
            pending.setRegistrationNumber("HSP-2024-118");
            pending.setEmail("admin@northerncare.lk");
            pending.setPhone("+94771112233");
            pending.setAddress("Main Street, Jaffna");
            pending.setStaffId("STF-4421");
            pending.setDocumentName("registration-certificate.pdf");
            pending.setStatus(VerificationStatus.PENDING);
            orgs.save(pending);

            BloodRequest req = new BloodRequest();
            req.setRecipientId(recipient.getId());
            req.setRecipientName(recipient.getFullName());
            req.setBloodGroup(BloodGroup.O_POS);
            req.setUnits(2);
            req.setHospital("Jaffna Teaching Hospital");
            req.setLocation("Jaffna");
            req.setRequiredDate(LocalDate.now().plusDays(1));
            req.setUrgency(RequestUrgency.URGENT);
            req.setStatus(RequestStatus.FINDING_DONORS);
            req.setMatchCount(4);
            req.setNotes("Surgery scheduled tomorrow morning.");
            requests.save(req);

            seedStock(stock, hospital.getId());
            seedStock(stock, bank.getId());
        };
    }

    private static UserAccount user(String name, String email, String phone, String hash, UserRole role) {
        UserAccount u = new UserAccount();
        u.setFullName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setPasswordHash(hash);
        u.setRole(role);
        return u;
    }

    private static void seedStock(BloodStockRepository stock, Long orgId) {
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
            s.setLevel(AppService.levelFor(units));
            s.setLastUpdated(java.time.Instant.now());
            stock.save(s);
        }
    }
}
