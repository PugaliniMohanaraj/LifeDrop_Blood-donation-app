package com.bloodbridge.web;

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
        return Map.of("status", "ok", "message", "Blood Bridge API is running");
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
    public List<?> requests() {
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

    @PostMapping("/requests/{id}/accept")
    @PreAuthorize("hasRole('DONOR')")
    public Object accept(@PathVariable Long id) {
        return appService.accept(id);
    }

    @GetMapping("/matches")
    public List<Map<String, Object>> matches(
            @RequestParam(required = false) String bloodGroup) {
        return appService.matches(
                bloodGroup == null || bloodGroup.isBlank()
                        ? null
                        : com.bloodbridge.domain.BloodGroup.fromLabel(bloodGroup));
    }

    @PatchMapping("/me/availability")
    @PreAuthorize("hasRole('DONOR')")
    public UserResponse availability(
            @AuthenticationPrincipal UserAccount user, @Valid @RequestBody AvailabilityUpdate req) {
        return UserResponse.from(appService.updateAvailability(user, req.availability()));
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
}
