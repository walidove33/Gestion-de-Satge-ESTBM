package com.wbs.mymovie.estbm.model;

import com.wbs.mymovie.estbm.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.wbs.mymovie.estbm.model.Document;


@Entity
@Table(name = "etudiants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codeApogee;

    @Column(nullable = false, unique = true)
    private String codeMassar;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id")
    private Utilisateur utilisateur;



    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private Encadrant encadrant;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<Document> documents;

}
