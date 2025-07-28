//package com.wbs.mymovie.estbm.controller;
//
//import com.wbs.mymovie.estbm.dto.RegisterRequest;
//import com.wbs.mymovie.estbm.service.StageService;
//import com.wbs.mymovie.estbm.service.UtilisateurService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import com.wbs.mymovie.estbm.dto.AssignmentDto;
//
//@RestController
//@RequestMapping("/stages/admin")
//public class AdminController {
//
//    @Autowired
//    private UtilisateurService utilisateurService;
//
//    @Autowired
//    private StageService stageService;
//
//    /**
//     * Créer un compte encadrant
//     */
//    @PostMapping("/encadrants")
//    public ResponseEntity<?> creerEncadrant(@RequestBody RegisterRequest req) {
//        return ResponseEntity.ok(utilisateurService.creerCompteEncadrant(req));
//    }
//
//    /**
//     * Statistiques globales
//     */
//    @GetMapping("/statistiques")
//    public ResponseEntity<?> getStats() {
//        return ResponseEntity.ok(stageService.getStatistiques());
//    }
//
//    /**
//     * Exporter les listes (format = csv ou pdf)
//     */
//    @GetMapping("/export")
//    public ResponseEntity<?> exporterListes(@RequestParam String format) {
//        return stageService.exporterListes(format);
//    }
//
//    /**
//     * Générer automatiquement la convention d’un stage
//     */
//    @PostMapping("/generer-convention")
//    public ResponseEntity<?> genererConvention(@RequestParam Long idStage) {
//        return stageService.genererConventionAuto(idStage);
//    }
//
//    /**
//     * Attribuer un encadrant à un stage
//     */
//    @PostMapping("/assigner-encadrant")
//    public ResponseEntity<?> assignerEncadrant(
//            @RequestParam Long idStage,
//            @RequestParam Long idEncadrant) {
//        return stageService.assignerEncadrant(idStage, idEncadrant);
//    }
//
//    /**
//     * Attribuer un document de convention
//     */
//    @PostMapping("/attribuer-convention")
//    public ResponseEntity<?> attribuerConvention(@RequestParam Long idStage,
//                                                 @RequestParam("file") MultipartFile file) {
//        return stageService.attribuerDocument(idStage, file, "Convention");
//    }
//
//    /**
//     * Attribuer un document d’assurance
//     */
//    @PostMapping("/attribuer-assurance")
//    public ResponseEntity<?> attribuerAssurance(@RequestParam Long idStage,
//                                                @RequestParam("file") MultipartFile file) {
//        return stageService.attribuerDocument(idStage, file, "Assurance");
//    }
//
//
//    // src/main/java/com/wbs/mymovie/estbm/controller/AdminController.java
//    @PostMapping("/assigner-encadrant")
//    public ResponseEntity<?> assignerEncadrantAEtudiant(@RequestBody AssignmentDto dto) {
//        return stageService.assignerEncadrantAEtudiant(dto);
//    }
//
//
//}


// src/main/java/com/wbs/mymovie/estbm/controller/AdminController.java
package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.AssignmentDto;
import com.wbs.mymovie.estbm.dto.RegisterRequest;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.model.Utilisateur;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.repository.EtudiantRepository;
import com.wbs.mymovie.estbm.service.StageService;
import com.wbs.mymovie.estbm.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/stages/admin")
public class AdminController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private StageService stageService;

    /** Créer un compte encadrant */
    @PostMapping("/encadrants")
    public ResponseEntity<?> creerEncadrant(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(utilisateurService.creerCompteEncadrant(req));
    }


    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentDto>> getAssignments() {
        List<AssignmentDto> dtos = stageService.getAssignments();
        return ResponseEntity.ok(dtos);
    }



    // StageController.java
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> stats = stageService.getStatistiques();
        // Add totalEtudiants if needed
        stats.put("totalEtudiants", etudiantRepository.count());
        return ResponseEntity.ok(stats);
    }
    /** Exporter les listes */
    @GetMapping("/export")
    public ResponseEntity<?> exporterListes(@RequestParam String format) {
        return stageService.exporterListes(format);
    }

    /** Générer automatiquement la convention d’un stage */
    @PostMapping("/generer-convention")
    public ResponseEntity<?> genererConvention(@RequestParam Long idStage) {
        return stageService.genererConventionAuto(idStage);
    }

    /**
     * Attribuer un encadrant à un étudiant
     */
    @PostMapping("/assigner-encadrant")
    public ResponseEntity<?> assignerEncadrantAEtudiant(@RequestBody AssignmentDto dto) {
        return stageService.assignerEncadrantAEtudiant(dto);
    }

    /** Attribuer un document de convention */
    @PostMapping("/attribuer-convention")
    public ResponseEntity<?> attribuerConvention(@RequestParam Long idStage,
                                                 @RequestParam("file") MultipartFile file) {
        return stageService.attribuerDocument(idStage, file, "Convention");
    }

    /** Attribuer un document d’assurance */
    @PostMapping("/attribuer-assurance")
    public ResponseEntity<?> attribuerAssurance(@RequestParam Long idStage,
                                                @RequestParam("file") MultipartFile file) {
        return stageService.attribuerDocument(idStage, file, "Assurance");
    }

    @PutMapping("/{id}/documents")
    public ResponseEntity<String> ajouterDocuments(
            @PathVariable("id") Long stageId,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("types") List<String> types
    ) throws IOException {
        // files.size()==types.size()==2
        stageService.ajouterDocuments(stageId, files, types);
        return ResponseEntity.ok("Documents ajoutés avec succès");
    }


    @GetMapping("/users")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        return ResponseEntity.ok(utilisateurService.getAllUsers());
    }

    @GetMapping("/stages")
    public ResponseEntity<List<Stage>> getAllStages() {
        return ResponseEntity.ok(stageService.getAllStages());
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<Utilisateur>> getUsersByRole(
            @PathVariable("role") String roleStr) {

        Role role;
        try {
            role = Role.valueOf(roleStr);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(utilisateurService.getByRole(role));
    }








}
