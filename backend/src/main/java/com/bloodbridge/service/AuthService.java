package com.bloodbridge.service;

import com.bloodbridge.domain.*;
import com.bloodbridge.dto.Dtos.*;
import com.bloodbridge.repository.OrganizationRepository;
import com.bloodbridge.repository.UserAccountRepository;
import com.bloodbridge.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserAccountRepository users;
    private final OrganizationRepository organizations;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(
            UserAccountRepository users,
            OrganizationRepository organizations,
            PasswordEncoder encoder,
            JwtService jwt) {
        this.users = users;
        this.organizations = organizations;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        UserAccount user = users.findByEmailIgnoreCase(req.email().trim())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Email or password is incorrect. Please try again."));
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email or password is incorrect. Please try again.");
        }
        if ((user.getRole() == UserRole.HOSPITAL || user.getRole() == UserRole.BLOOD_BANK)
                && !user.isVerified()) {
            throw new IllegalArgumentException(
                    "Your organization is still pending verification. You will be notified when access is ready.");
        }
        String token = jwt.generate(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional
    public AuthResponse registerDonor(DonorRegisterRequest req) {
        ensureUniqueEmail(req.email());
        UserAccount user = new UserAccount();
        user.setFullName(req.fullName().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPhone(req.phone().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole(UserRole.DONOR);
        user.setBloodGroup(BloodGroup.fromLabel(req.bloodGroup()));
        user.setLocation(req.location().trim());
        user.setAvailability(AvailabilityStatus.AVAILABLE);
        user.setTotalDonations(0);
        user.setVerified(true);
        users.save(user);
        String token = jwt.generate(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional
    public AuthResponse registerRecipient(RecipientRegisterRequest req) {
        ensureUniqueEmail(req.email());
        UserAccount user = new UserAccount();
        user.setFullName(req.fullName().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPhone(req.phone().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole(UserRole.RECIPIENT);
        user.setLocation(req.location().trim());
        user.setVerified(true);
        users.save(user);
        String token = jwt.generate(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional
    public MessageResponse registerOrganization(OrgRegisterRequest req) {
        Organization org = new Organization();
        org.setName(req.name().trim());
        org.setType(req.type());
        org.setRegistrationNumber(req.registrationNumber().trim());
        org.setEmail(req.email().trim().toLowerCase());
        org.setPhone(req.phone().trim());
        org.setAddress(req.address().trim());
        org.setStaffId(req.staffId().trim());
        org.setDocumentName(req.documentName().trim());
        org.setStatus(VerificationStatus.PENDING);
        organizations.save(org);
        return new MessageResponse(
                "Application submitted. Your organization is currently under review (Pending Verification).");
    }

    private void ensureUniqueEmail(String email) {
        if (users.existsByEmailIgnoreCase(email.trim())) {
            throw new IllegalArgumentException(
                    "An account with this email already exists. Please log in.");
        }
    }
}
