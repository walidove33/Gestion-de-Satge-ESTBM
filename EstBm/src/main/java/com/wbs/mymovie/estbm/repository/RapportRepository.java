package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.dto.RapportDto;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Rapport;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RapportRepository extends JpaRepository<Rapport, Long> {

    @EntityGraph(attributePaths = {"stage.etudiant", "stage.encadrant"})
    Optional<Rapport> findByStageId(Long stageId);

    @Query("SELECT new com.wbs.mymovie.estbm.dto.RapportDto(" +
            "r.id, r.nomFichier, r.dateDepot, r.stage.id, r.cloudinaryUrl) " +
            "FROM Rapport r WHERE r.stage.id = :stageId")
    Optional<RapportDto> findDtoByStageId(@Param("stageId") Long stageId);

    @Query("SELECT new com.wbs.mymovie.estbm.dto.RapportDto(" +
            "r.id, r.nomFichier, r.dateDepot, r.stage.id, r.cloudinaryUrl) " +
            "FROM Rapport r WHERE r.stage.encadrant.id = :encadrantId")
    List<RapportDto> findDtoByEncadrantId(@Param("encadrantId") Long encadrantId);




    @Query("SELECT r.cloudinaryUrl FROM Rapport r WHERE r.stage.id = :stageId")
    Optional<String> findCloudinaryUrlByStageId(@Param("stageId") Long stageId);


}