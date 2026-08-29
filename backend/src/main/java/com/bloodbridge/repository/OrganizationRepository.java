package com.bloodbridge.repository;

import com.bloodbridge.domain.Organization;
import com.bloodbridge.domain.VerificationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    List<Organization> findByStatus(VerificationStatus status);
}
