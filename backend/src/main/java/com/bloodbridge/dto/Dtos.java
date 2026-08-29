package com.bloodbridge.dto;

import com.bloodbridge.domain.*;
import jakarta.validation.constraints.*;

public final class Dtos {
    private Dtos() {}

    public record LoginRequest(
            @NotBlank(message = "Please enter your email address.")
            @Email(message = "Please enter a valid email address.")
            String email,
            @NotBlank(message = "Please enter your password.")
            String password
    ) {}

    public record DonorRegisterRequest(
            @NotBlank(message = "Please enter your full name.") String fullName,
            @NotBlank(message = "Please enter your email address.")
            @Email(message = "Please enter a valid email address.") String email,
            @NotBlank(message = "Please enter your phone number.") String phone,
            @NotBlank(message = "Please create a password.")
            @Size(min = 8, message = "Password must be at least 8 characters.") String password,
            @NotBlank(message = "Please select your blood group.") String bloodGroup,
            @NotBlank(message = "Please enter your location.") String location
    ) {}

    public record RecipientRegisterRequest(
            @NotBlank(message = "Please enter your full name.") String fullName,
            @NotBlank(message = "Please enter your email address.")
            @Email(message = "Please enter a valid email address.") String email,
            @NotBlank(message = "Please enter your phone number.") String phone,
            @NotBlank(message = "Please create a password.")
            @Size(min = 8, message = "Password must be at least 8 characters.") String password,
            @NotBlank(message = "Please enter your location.") String location
    ) {}

    public record OrgRegisterRequest(
            @NotBlank(message = "Please enter the organization name.") String name,
            @NotNull(message = "Please select hospital or blood bank.") OrgType type,
            @NotBlank(message = "Please enter the registration number.") String registrationNumber,
            @NotBlank(message = "Please enter the official email.")
            @Email(message = "Please enter a valid email address.") String email,
            @NotBlank(message = "Please enter a phone number.") String phone,
            @NotBlank(message = "Please enter the organization address.") String address,
            @NotBlank(message = "Please enter your staff ID.") String staffId,
            @NotBlank(message = "Please attach a supporting document.") String documentName
    ) {}

    public record BloodRequestCreate(
            @NotBlank(message = "Please select a blood group.") String bloodGroup,
            @Min(value = 1, message = "Please request at least 1 unit.")
            @Max(value = 20, message = "Please enter a realistic number of units (max 20).")
            int units,
            @NotBlank(message = "Please enter the hospital or facility name.") String hospital,
            @NotBlank(message = "Please enter the location.") String location,
            @NotBlank(message = "Please select the required date.") String requiredDate,
            @NotNull(message = "Please select urgency.") RequestUrgency urgency,
            String notes
    ) {}

    public record RejectRequest(
            @NotBlank(message = "Please provide a reason for rejection.") String reason
    ) {}

    public record AvailabilityUpdate(
            @NotNull(message = "Please choose an availability status.") AvailabilityStatus availability
    ) {}

    public record StockUpdate(
            @Min(value = 0, message = "Units cannot be negative.") int units
    ) {}

    public record AuthResponse(String token, UserResponse user) {}

    public record UserResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            UserRole role,
            String bloodGroup,
            String location,
            AvailabilityStatus availability,
            Integer totalDonations,
            Long organizationId,
            String organizationName,
            boolean verified
    ) {
        public static UserResponse from(UserAccount u) {
            return new UserResponse(
                    u.getId(),
                    u.getFullName(),
                    u.getEmail(),
                    u.getPhone(),
                    u.getRole(),
                    u.getBloodGroup() == null ? null : u.getBloodGroup().getLabel(),
                    u.getLocation(),
                    u.getAvailability(),
                    u.getTotalDonations(),
                    u.getOrganizationId(),
                    u.getOrganizationName(),
                    u.isVerified()
            );
        }
    }

    public record MessageResponse(String message) {}

    public record ApiError(String title, String message, String fix) {}
}
