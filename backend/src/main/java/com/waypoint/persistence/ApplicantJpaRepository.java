package com.waypoint.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicantJpaRepository extends JpaRepository<ApplicantEntity, String> {
}
