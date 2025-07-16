package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.model.enums.EtatStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StageRepository extends JpaRepository<Stage, Long> {

    // Trouver les stages par étudiant
    List<Stage> findByEtudiantId(Long etudiantId);

    // Trouver les stages par encadrant
    List<Stage> findByEncadrantId(Long encadrantId);

    // Trouver les stages par état
    List<Stage> findByEtat(EtatStage etat);

    // Trouver les stages par filière et état
    List<Stage> findByFiliereAndEtat(String filiere, EtatStage etat);

    // Trouver le dernier stage d'un étudiant (retourne Optional)
    Optional<Stage> findTopByEtudiantIdOrderByDateCreationDesc(Long idEtudiant);

    // Compter les stages par état
    long countByEtat(EtatStage etat);

    // Compter tous les stages
    @Override
    long count();

    // Trouver les stages expirant bientôt (dans les 7 jours)
    @Query("SELECT s FROM Stage s WHERE s.dateFin BETWEEN :now AND :inSevenDays")
    List<Stage> findStagesExpiringSoon(@Param("now") LocalDate now,
                                       @Param("inSevenDays") LocalDate inSevenDays);

    // Trouver les stages par période
    List<Stage> findByDateDebutBetween(LocalDate start, LocalDate end);

    // Trouver les stages avec rapports non soumis après la date de fin
    @Query("SELECT s FROM Stage s WHERE s.dateFin < :now AND s.etat != 'RAPPORT_SOUMIS'")
    List<Stage> findStagesWithMissingReports(@Param("now") LocalDate now);

    // Trouver les stages par entreprise
    List<Stage> findByEntrepriseContainingIgnoreCase(String entreprise);

    // Statistiques par filière
    @Query("SELECT s.filiere, COUNT(s) FROM Stage s GROUP BY s.filiere")
    List<Object[]> countStagesByFiliere();
}