package com.bloodbridge.repository;

import com.bloodbridge.domain.BloodStock;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {
    List<BloodStock> findByOrganizationId(Long organizationId);
    Optional<BloodStock> findByOrganizationIdAndBloodGroup(Long organizationId, com.bloodbridge.domain.BloodGroup bloodGroup);
}
