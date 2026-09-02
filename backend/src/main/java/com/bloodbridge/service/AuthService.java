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
    public MessageResponse changePassword(UserAccount user, ChangePasswordRequest req) {
        UserAccount managed = users.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found."));
        if (!encoder.matches(req.currentPassword(), managed.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        if (req.currentPassword().equals(req.newPassword())) {
            throw new IllegalArgumentException("New password must be different from your current password.");
        }
        managed.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(managed);
        return new MessageResponse("Password updated successfully.");
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

    public MessageResponse requestPasswordReset(ForgotPasswordRequest req) {
        // Generic response — never reveal whether the email is registered
        return new MessageResponse(
                "If an account exists for this email, password reset instructions have been sent.");
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
        ensureUniqueEmail(req.email());

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

        UserRole role = req.type() == OrgType.HOSPITAL ? UserRole.HOSPITAL : UserRole.BLOOD_BANK;
        UserAccount staff = new UserAccount();
        staff.setFullName(req.staffName().trim());
        staff.setEmail(req.email().trim().toLowerCase());
        staff.setPhone(req.phone().trim());
        staff.setPasswordHash(encoder.encode(req.password()));
        staff.setRole(role);
        staff.setOrganizationId(org.getId());
        staff.setOrganizationName(org.getName());
        staff.setLocation(req.address().trim());
        staff.setVerified(false);
        users.save(staff);

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
