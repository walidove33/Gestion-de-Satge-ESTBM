//package com.wbs.mymovie.estbm.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Entity
//@Data
//public class Rapport {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String nomFichier;
//
//    private LocalDate dateDepot;
//
//    @JsonIgnore
//    @Lob
//    private byte[] data;
//
//
//    @OneToOne
//    @JoinColumn(name = "stage_id")
//    private Stage stage;
//}

// src/main/java/com/wbs/mymovie/estbm/model/Rapport.java
package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;
    private LocalDate dateDepot;
    private String cloudinaryUrl; // Stocke l'URL Cloudinary
    private String publicId; // ID unique Cloudinary

    @OneToOne
    @JoinColumn(name = "stage_id")
    private Stage stage;
}