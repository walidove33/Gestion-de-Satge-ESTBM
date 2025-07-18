package com.wbs.mymovie.estbm.dto;

import com.wbs.mymovie.estbm.model.Utilisateur;

public class JwtResponse {
    private String token;
    private String role;
    private Utilisateur user; // Ajout


    public JwtResponse(String token, String role, Utilisateur user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public Utilisateur getUser() { return user; } //
}
