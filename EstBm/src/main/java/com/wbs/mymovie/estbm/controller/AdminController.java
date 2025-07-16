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
import com.wbs.mymovie.estbm.service.StageService;
import com.wbs.mymovie.estbm.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/stages/admin")
public class AdminController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private StageService stageService;

    /** Créer un compte encadrant */
    @PostMapping("/encadrants")
    public ResponseEntity<?> creerEncadrant(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(utilisateurService.creerCompteEncadrant(req));
    }

    /** Statistiques globales */
    @GetMapping("/statistiques")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(stageService.getStatistiques());
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
}
