package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RapportRepository extends JpaRepository<Rapport, Long> {
    Optional<Rapport> findByStageId(Long stageId);
}