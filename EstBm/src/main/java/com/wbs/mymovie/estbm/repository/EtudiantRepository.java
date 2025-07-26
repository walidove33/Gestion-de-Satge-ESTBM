package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByCodeApogeeAndCodeMassarAndDateNaissance(String codeApogee, String codeMassar, LocalDate dateNaissance);
    Optional<Etudiant> findByUtilisateurEmail(String email);
    Optional<Etudiant> findByEmail(String email);
    List<Etudiant> findByEncadrantIsNotNull();

}