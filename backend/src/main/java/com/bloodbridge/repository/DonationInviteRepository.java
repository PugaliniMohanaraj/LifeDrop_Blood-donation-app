package com.bloodbridge.repository;

import com.bloodbridge.domain.DonationInvite;
import com.bloodbridge.domain.InviteStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationInviteRepository extends JpaRepository<DonationInvite, Long> {
    List<DonationInvite> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    List<DonationInvite> findByRequestIdOrderByCreatedAtDesc(Long requestId);
    Optional<DonationInvite> findByRequestIdAndDonorId(Long requestId, Long donorId);
    boolean existsByRequestIdAndDonorIdAndStatus(Long requestId, Long donorId, InviteStatus status);
    long countByStatus(InviteStatus status);
}
