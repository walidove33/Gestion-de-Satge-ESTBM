package com.wbs.mymovie.estbm.service;


import com.wbs.mymovie.estbm.dto.UpdateProfileDto;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class EtudiantService {
    @Autowired private EtudiantRepository etudiantRepository;

    public Optional<Etudiant> chercherParCodeEtDate(String apogee, String massar, LocalDate naissance) {
        return etudiantRepository.findByCodeApogeeAndCodeMassarAndDateNaissance(apogee, massar, naissance);
    }

    public Etudiant enregistrer(Etudiant e) {
        return etudiantRepository.save(e);
    }

    public Optional<Etudiant> getById(Long id) {
        return etudiantRepository.findById(id);
    }


    public Etudiant updateProfile(Long id, UpdateProfileDto dto) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        etudiant.setNom(dto.getNom());
        etudiant.setPrenom(dto.getPrenom());
        etudiant.setEmail(dto.getEmail());
        etudiant.setTelephone(dto.getTelephone());


        return etudiantRepository.save(etudiant);
    }
}