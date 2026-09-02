package com.bloodbridge.web;

import com.bloodbridge.dto.Dtos.BloodAvailabilityDetail;
import com.bloodbridge.dto.Dtos.BloodAvailabilityItem;
import com.bloodbridge.service.BloodAvailabilityService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final BloodAvailabilityService availability;

    public PublicController(BloodAvailabilityService availability) {
        this.availability = availability;
    }

    @GetMapping("/blood-availability")
    public List<BloodAvailabilityItem> search(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false, defaultValue = "WHOLE_BLOOD") String component,
            @RequestParam(required = false, defaultValue = "ALL") String availabilityStatus,
            @RequestParam(required = false) String search) {
        return availability.search(
                province, district, bloodGroup, component, availabilityStatus, search);
    }

    @GetMapping("/blood-availability/{organizationId}")
    public BloodAvailabilityDetail detail(
            @PathVariable Long organizationId,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false, defaultValue = "WHOLE_BLOOD") String component) {
        return availability.detail(organizationId, bloodGroup, component);
    }
}
