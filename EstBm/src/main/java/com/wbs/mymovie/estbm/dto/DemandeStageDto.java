package com.wbs.mymovie.estbm.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

@Data
public class DemandeStageDto {
    private Long idEtudiant;
    private String sujet;
    private String entreprise;
    private String adresseEntreprise;  // Nouveau champ
    private String telephoneEntreprise;  // Nouveau champ
    private String representantEntreprise;  // Nouveau champ
    private String filiere;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private MultipartFile assurance;
    private MultipartFile convention;
}