package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.model.Rapport;
import com.wbs.mymovie.estbm.service.RapportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stages/rapports")
public class RapportController {

    @Autowired
    private RapportService rapportService;

    @PostMapping("/")
    public ResponseEntity<Rapport> uploadRapport(@RequestBody Rapport rapport) {
        return ResponseEntity.ok(rapportService.enregistrer(rapport));
    }

    @GetMapping("/stage/{id}")
    public ResponseEntity<Rapport> getRapport(@PathVariable Long id) {
        return rapportService.parStage(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}