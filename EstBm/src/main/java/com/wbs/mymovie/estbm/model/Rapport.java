package com.wbs.mymovie.estbm.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Lob
    private byte[] data;

    @OneToOne
    private Stage stage;
}
