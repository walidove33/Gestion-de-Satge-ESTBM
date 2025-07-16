
package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.service.*;
import com.wbs.mymovie.estbm.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/stages/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EtudiantService etudiantService;
    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            Utilisateur user = utilisateurService.findByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(new JwtResponse(token, user.getRole().name()));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe invalide");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (utilisateurService.emailExiste(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        var etuOpt = etudiantService.chercherParCodeEtDate(
                registerRequest.getCodeApogee(),
                registerRequest.getCodeMassar(),
                registerRequest.getDateNaissance()
        );

        if (etuOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Étudiant non reconnu");
        }

        // 1) Création du compte Utilisateur
        Utilisateur user = new Utilisateur();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setRole(Role.ETUDIANT);
        user = utilisateurService.enregistrer(user);

        // 2) Mise à jour de l'entité Etudiant
        Etudiant etu = etuOpt.get();
        etu.setUtilisateur(user);
        etu.setTelephone(registerRequest.getTelephone());
        etu.setEmail(registerRequest.getEmail());    // ← ici
        etu.setNom(registerRequest.getNom());        // ← ici
        etu.setPrenom(registerRequest.getPrenom());  // ← ici
        etudiantService.enregistrer(etu);

        return ResponseEntity.ok("Inscription réussie !");
    }


    static class JwtResponse {
        private String token;
        private String role;

        public JwtResponse(String token, String role) {
            this.token = token;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public String getRole() {
            return role;
        }
    }

}