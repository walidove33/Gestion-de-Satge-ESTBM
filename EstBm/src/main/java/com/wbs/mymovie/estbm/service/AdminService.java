package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.ReferenceDto;
import com.wbs.mymovie.estbm.dto.RegisterRequest;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Utilisateur;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private  UtilisateurRepository utilisateurRepository;
    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private EtudiantRepository etudiantRepository;

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

    @Autowired private EncadrantRepository encRepo;

    /**
     * Assigne l'encadrant donné à tous les étudiants
     * du département, de la classe et de l'année scolaire spécifiés.
     */
    @Transactional
    public int assignerEncadrantParGroupe(Long utilisateurIdEncadrant,
                                          Long departementId,
                                          Long classeGroupeId,
                                          Long anneeScolaireId) {
        Encadrant enc = encRepo.findByUtilisateurId(utilisateurIdEncadrant)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
        // Récupère les étudiants matching les 3 filtres
        List<Etudiant> liste = etudiantRepository.findAll().stream()
                .filter(e -> e.getDepartement() != null && e.getDepartement().getId().equals(departementId))
                .filter(e -> e.getClasseGroupe() != null && e.getClasseGroupe().getId().equals(classeGroupeId))
                .filter(e -> e.getAnneeScolaire() != null && e.getAnneeScolaire().getId().equals(anneeScolaireId))
                .collect(Collectors.toList());

        // Affecte l'encadrant et sauve
        for (Etudiant e : liste) {
            e.setEncadrant(enc);
        }
        etudiantRepository.saveAll(liste);
        return liste.size(); // nombre d'étudiants affectés
    }


    @Autowired
    private DepartementRepository departementRepo;
    @Autowired
    private ClasseGroupeRepository classeGroupeRepo;
    @Autowired
    private AnneeScolaireRepository anneeRepo;

    public List<ReferenceDto> listDepartements() {
        return departementRepo.findAll()
                .stream()
                .map(d -> new ReferenceDto(d.getId(), d.getNom(), null))
                .toList();
    }

    // Méthode existante (filtre par département)
    public List<ReferenceDto> listClassGroupsByDepartment(Long depId) { // Renommez
        return classeGroupeRepo.findByDepartement_Id(depId)
                .stream()
                .map(g -> new ReferenceDto(g.getId(), g.getNom(), null))
                .toList();
    }

    // Nouvelle méthode (tous groupes)
    public List<ReferenceDto> listAllClassGroups() { // Nouveau nom
        return classeGroupeRepo.findAll()
                .stream()
                .map(g -> new ReferenceDto(g.getId(), g.getNom(), null))
                .toList();
    }

    public List<ReferenceDto> listAnneesScolaires() {
        return anneeRepo.findAll()
                .stream()
                .map(a -> new ReferenceDto(a.getId(), null, a.getLibelle()))
                .toList();
    }

}