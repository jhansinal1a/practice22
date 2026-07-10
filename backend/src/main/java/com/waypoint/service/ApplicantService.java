package com.waypoint.service;

import com.waypoint.model.Applicant;
import com.waypoint.model.Stage;
import com.waypoint.persistence.ApplicantEntity;
import com.waypoint.persistence.ApplicantJpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Applicant operations backed by PostgreSQL. Exposes the same method surface the controller
 * used against the old in-memory store, returning {@link Applicant} DTOs so the web layer is
 * unaware of the JPA entities.
 */
@Service
public class ApplicantService {

    private final ApplicantJpaRepository repository;

    public ApplicantService(ApplicantJpaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Applicant> findAll(Stage stage, String posting) {
        return repository.findAll(Sort.by("seq")).stream()
                .filter(entity -> stage == null || entity.getStage() == stage)
                .filter(entity -> posting == null || entity.getPosting().equalsIgnoreCase(posting))
                .map(ApplicantEntity::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Applicant> findById(String id) {
        return repository.findById(id).map(ApplicantEntity::toDto);
    }

    @Transactional
    public Optional<Applicant> updateStage(String id, Stage stage) {
        return repository.findById(id).map(entity -> {
            entity.setStage(stage);
            return repository.save(entity).toDto();
        });
    }

    @Transactional
    public Optional<Applicant> scheduleCall(String id, String callTime) {
        return repository.findById(id).map(entity -> {
            if (entity.getStage() == Stage.APPLIED || entity.getStage() == Stage.REVIEWED) {
                entity.setStage(Stage.CALL_SCHEDULED);
            }
            entity.setCallTime(callTime);
            return repository.save(entity).toDto();
        });
    }
}
