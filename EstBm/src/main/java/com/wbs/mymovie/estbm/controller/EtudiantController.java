package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.UpdateProfileDto;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.service.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stages/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiant(@PathVariable Long id) {
        return etudiantService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @ModelAttribute UpdateProfileDto dto) {
        Etudiant updated = etudiantService.updateProfile(id, dto);
        return ResponseEntity.ok(updated);
    }




}