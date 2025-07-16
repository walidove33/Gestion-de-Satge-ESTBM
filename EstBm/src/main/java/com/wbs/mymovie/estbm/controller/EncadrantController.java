package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.DecisionDto;
import com.wbs.mymovie.estbm.dto.NoteDto;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.service.EncadrantService;
import com.wbs.mymovie.estbm.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stages/encadrants")
public class EncadrantController {

    @Autowired
    private EncadrantService encadrantService;

    @Autowired
    private StageService stageService;

    @GetMapping("/{id}/stages")
    public ResponseEntity<List<Stage>> getStagesByEncadrant(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStagesParEncadrant(id));
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/valider")
    public ResponseEntity<?> validerStage(@PathVariable Long idEncadrant, @PathVariable Long idStage) {
        boolean success = encadrantService.validerStage(idEncadrant, idStage);
        return success ? ResponseEntity.ok("Stage validé") : ResponseEntity.badRequest().body("Erreur de validation");
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/refuser")
    public ResponseEntity<?> refuserStage(@PathVariable Long idEncadrant, @PathVariable Long idStage) {
        boolean success = encadrantService.refuserStage(idEncadrant, idStage);
        return success ? ResponseEntity.ok("Stage refusé") : ResponseEntity.badRequest().body("Erreur de refus");
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/note")
    public ResponseEntity<?> noterStage(@PathVariable Long idEncadrant,
                                        @PathVariable Long idStage,
                                        @RequestParam String commentaire) {
        boolean success = encadrantService.attribuerNote(idEncadrant, idStage, commentaire);
        return success ? ResponseEntity.ok("Commentaire enregistré")
                : ResponseEntity.badRequest().body("Erreur lors de l'ajout du commentaire");
    }

    @GetMapping("/demandes")
    public ResponseEntity<?> listerDemandes(@RequestParam(required = false) String filiere) {
        return ResponseEntity.ok(stageService.listerDemandesPourEncadrant(filiere));
    }

    @PostMapping("/decision")
    public ResponseEntity<?> decisionDemande(@RequestBody DecisionDto dto) {
        return ResponseEntity.ok(stageService.approuverOuRefuser(dto));
    }

    @PostMapping("/note")
    public ResponseEntity<?> noter(@RequestBody NoteDto dto) {
        return ResponseEntity.ok(stageService.ajouterNote(dto));
    }



}
