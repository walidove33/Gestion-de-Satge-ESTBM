package com.wbs.mymovie.estbm.dto;

import com.wbs.mymovie.estbm.model.enums.EtatStage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StageDto {
    private Long id;
    private String sujet;
    private String entreprise;
    private String adresseEntreprise;
    private String telephoneEntreprise;
    private String representantEntreprise;
    private String filiere;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private EtatStage etat;
    private LocalDateTime dateCreation;
}
