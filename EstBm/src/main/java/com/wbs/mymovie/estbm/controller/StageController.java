package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.DemandeStageDto;
import com.wbs.mymovie.estbm.model.Document;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/stages/stages")
public class StageController {

    @Autowired
    private StageService stageService;



    @GetMapping("/etudiant/{id}")
    public List<Stage> getStagesByEtudiant(@PathVariable Long id) {
        return stageService.getStagesParEtudiant(id);
    }

    @GetMapping("/encadrant/{id}")
    public List<Stage> getStagesByEncadrant(@PathVariable Long id) {
        return stageService.getStagesParEncadrant(id);
    }

    @PreAuthorize("hasRole('ETUDIANT')") // ou similaire
    @PostMapping("/demande")
    public ResponseEntity<Stage> creerDemande(@RequestBody DemandeStageDto dto) {
        return ResponseEntity.ok(stageService.creerDemande(dto));
    }



    @GetMapping("/etat")
    public ResponseEntity<String> suivreEtat(@RequestParam Long idEtudiant) {
        return ResponseEntity.ok(stageService.etatDemande(idEtudiant));
    }

    @GetMapping("/convention")
    public ResponseEntity<Resource> telechargerConvention(@RequestParam Long idStage) {
        return stageService.genererEtTelechargerConvention(idStage);
    }

    @PostMapping("/rapport")
    public ResponseEntity<String> soumettreRapport(@RequestParam Long idStage,
                                                   @RequestParam MultipartFile rapport) {
        return ResponseEntity.ok(stageService.soumettreRapport(idStage, rapport));
    }

    // Nouveaux endpoints pour la gestion des documents
    @GetMapping("/{stageId}/documents")
    public ResponseEntity<List<Document>> getDocumentsDuStage(@PathVariable Long stageId) {
        return ResponseEntity.ok(stageService.getDocumentsByStageId(stageId));
    }

    @PutMapping("/{id}/documents")
    public ResponseEntity<String> ajouterDocuments(
            @PathVariable("id") Long stageId,
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("types") List<String> types
    ) throws IOException {
        stageService.ajouterDocuments(stageId, files, types);
        return ResponseEntity.ok("Documents ajoutés");
    }

}