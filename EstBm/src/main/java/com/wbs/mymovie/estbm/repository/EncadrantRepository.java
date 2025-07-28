package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncadrantRepository extends JpaRepository<Encadrant, Long> {
    Optional<Encadrant> findByEmail(String email);

    Optional<Encadrant> findByUtilisateur(Utilisateur utilisateur);


}
