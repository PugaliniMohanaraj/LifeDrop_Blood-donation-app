package com.bloodbridge.web;

import com.bloodbridge.dto.Dtos.*;
import com.bloodbridge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/register/donor")
    public AuthResponse registerDonor(@Valid @RequestBody DonorRegisterRequest req) {
        return authService.registerDonor(req);
    }

    @PostMapping("/register/recipient")
    public AuthResponse registerRecipient(@Valid @RequestBody RecipientRegisterRequest req) {
        return authService.registerRecipient(req);
    }
}
