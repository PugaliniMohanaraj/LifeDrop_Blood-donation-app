package com.bloodbridge.repository;

import com.bloodbridge.domain.BloodComponent;
import com.bloodbridge.domain.BloodGroup;
import com.bloodbridge.domain.BloodStock;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {
    List<BloodStock> findByOrganizationId(Long organizationId);

    List<BloodStock> findByOrganizationIdIn(Collection<Long> organizationIds);

    Optional<BloodStock> findByOrganizationIdAndBloodGroupAndComponent(
            Long organizationId, BloodGroup bloodGroup, BloodComponent component);

    Optional<BloodStock> findByOrganizationIdAndBloodGroup(Long organizationId, BloodGroup bloodGroup);
}
