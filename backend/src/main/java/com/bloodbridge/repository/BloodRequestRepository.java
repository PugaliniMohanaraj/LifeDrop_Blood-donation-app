package com.bloodbridge.repository;

import com.bloodbridge.domain.BloodRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<BloodRequest> findAllByOrderByCreatedAtDesc();
}
