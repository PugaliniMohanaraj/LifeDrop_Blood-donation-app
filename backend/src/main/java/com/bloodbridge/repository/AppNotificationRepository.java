package com.bloodbridge.repository;

import com.bloodbridge.domain.AppNotification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {
    List<AppNotification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
