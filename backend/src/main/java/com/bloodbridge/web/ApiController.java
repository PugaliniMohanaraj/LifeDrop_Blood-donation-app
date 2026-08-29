package com.bloodbridge.web;

import com.bloodbridge.domain.BloodGroup;
import com.bloodbridge.domain.DonationInvite;
import com.bloodbridge.domain.Organization;
import com.bloodbridge.domain.UserAccount;
import com.bloodbridge.dto.Dtos.*;
import com.bloodbridge.service.AppService;
import com.bloodbridge.service.AuthService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final AuthService authService;
    private final AppService appService;

    public ApiController(AuthService authService, AppService appService) {
        this.authService = authService;
        this.appService = appService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "message", "LifeDrop API is running");
    }

    @GetMapping("/stats")
    public PlatformStats stats() {
        return appService.platformStats();
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserAccount user) {
        return UserResponse.from(user);
    }

    @PostMapping("/organizations")
    public MessageResponse registerOrg(@Valid @RequestBody OrgRegisterRequest req) {
        return authService.registerOrganization(req);
    }

    @GetMapping("/requests")
    public List<?> requests(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole() == com.bloodbridge.domain.UserRole.DONOR) {
            return appService.listRequestsForDonor(user.getId());
        }
        return appService.listRequests();
    }

    @GetMapping("/requests/mine")
    @PreAuthorize("hasRole('RECIPIENT')")
    public List<?> myRequests(@AuthenticationPrincipal UserAccount user) {
        return appService.listMyRequests(user.getId());
    }

    @PostMapping("/requests")
    @PreAuthorize("hasAnyRole('RECIPIENT','HOSPITAL')")
    public Object createRequest(
            @AuthenticationPrincipal UserAccount user, @Valid @RequestBody BloodRequestCreate req) {
        return appService.createRequest(user, req);
    }

    @PostMapping("/requests/{id}/cancel")
    public Object cancel(
            @PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        return appService.cancel(id, user);
    }

    @PostMapping("/requests/{id}/invite")
    @PreAuthorize("hasAnyRole('RECIPIENT','HOSPITAL')")
    public DonationInvite invite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserAccount user,
            @Valid @RequestBody InviteRequest body) {
        return appService.sendInvite(user, id, body.donorId());
    }

    @PostMapping("/requests/{id}/accept")
    @PreAuthorize("hasRole('DONOR')")
    public Object accept(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        return appService.acceptInvite(id, user);
    }

    @PostMapping("/requests/{id}/decline")
    @PreAuthorize("hasRole('DONOR')")
    public DonationInvite decline(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        return appService.declineInvite(id, user);
    }

    @GetMapping("/matches")
    public List<Map<String, Object>> matches(
            @RequestParam(required = false) String bloodGroup) {
        return appService.matches(
                bloodGroup == null || bloodGroup.isBlank()
                        ? null
                        : BloodGroup.fromLabel(bloodGroup));
    }

    @GetMapping("/notifications")
    public List<NotificationResponse> notifications(@AuthenticationPrincipal UserAccount user) {
        return appService.listNotifications(user.getId());
    }

    @DeleteMapping("/notifications/{id}")
    public MessageResponse dismissNotification(
            @PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        appService.dismissNotification(user.getId(), id);
        return new MessageResponse("Notification dismissed.");
    }

    @PostMapping("/notifications/{id}/read")
    public MessageResponse readNotification(
            @PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        appService.markNotificationRead(user.getId(), id);
        return new MessageResponse("Notification marked as read.");
    }

    @PatchMapping("/me/availability")
    @PreAuthorize("hasRole('DONOR')")
    public UserResponse availability(
            @AuthenticationPrincipal UserAccount user, @Valid @RequestBody AvailabilityUpdate req) {
        return UserResponse.from(appService.updateAvailability(user, req.availability()));
    }

    @PostMapping("/me/password")
    public MessageResponse changePassword(
            @AuthenticationPrincipal UserAccount user, @Valid @RequestBody ChangePasswordRequest req) {
        return authService.changePassword(user, req);
    }

    @GetMapping("/admin/organizations")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Organization> allOrganizations() {
        return appService.allOrgs();
    }

    @GetMapping("/admin/organizations/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Organization> pending() {
        return appService.pendingOrgs();
    }

    @GetMapping("/admin/organizations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Organization org(@PathVariable Long id) {
        return appService.getOrg(id);
    }

    @PostMapping("/admin/organizations/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Organization approve(@PathVariable Long id) {
        return appService.approve(id);
    }

    @PostMapping("/admin/organizations/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Organization reject(@PathVariable Long id, @Valid @RequestBody RejectRequest req) {
        return appService.reject(id, req.reason());
    }

    @GetMapping("/stock/{organizationId}")
    public List<?> stock(@PathVariable Long organizationId) {
        return appService.stockFor(organizationId);
    }

    @PatchMapping("/stock/{organizationId}")
    @PreAuthorize("hasAnyRole('HOSPITAL','BLOOD_BANK')")
    public Object updateStock(
            @PathVariable Long organizationId,
            @AuthenticationPrincipal UserAccount user,
            @Valid @RequestBody StockUpdate req) {
        if (user.getOrganizationId() == null || !user.getOrganizationId().equals(organizationId)) {
            throw new IllegalArgumentException("You can only update stock for your own organization.");
        }
        return appService.updateStock(
                organizationId, BloodGroup.fromLabel(req.bloodGroup()), req.units());
    }
}
