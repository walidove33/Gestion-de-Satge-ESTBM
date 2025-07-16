package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.RegisterRequest;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Utilisateur;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private  UtilisateurRepository utilisateurRepository;
    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private  PasswordEncoder passwordEncoder;

    public Encadrant creerCompteEncadrant(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Utilisateur u = new Utilisateur();
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setNom(request.getNom());
        u.setPrenom(request.getPrenom());
        u.setTelephone(request.getTelephone());
        u.setRole(Role.ENCADRANT);
        Utilisateur saved = utilisateurRepository.save(u);

        Encadrant e = new Encadrant();
        e.setUtilisateur(saved);
        e.setEmail(saved.getEmail());
        e.setNom(saved.getNom());
        e.setPrenom(saved.getPrenom());
        e.setSpecialite(request.getSpecialite());
        return encadrantRepository.save(e);
    }

    public Utilisateur creerCompteAdmin(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé pour un autre compte utilisateur.");
        }
        Utilisateur admin = new Utilisateur();
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setNom(request.getNom());
        admin.setPrenom(request.getPrenom());
        admin.setTelephone(request.getTelephone());
        admin.setRole(Role.ADMIN);
        return utilisateurRepository.save(admin);
    }
}