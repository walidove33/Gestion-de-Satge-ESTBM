

export enum EtatStage {
  DEMANDE = "DEMANDE",
  EN_ATTENTE_VALIDATION = "EN_ATTENTE_VALIDATION",
  VALIDATION_EN_COURS = "VALIDATION_EN_COURS",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
  EN_COURS = "EN_COURS",
  TERMINE = "TERMINE",
  RAPPORT_SOUMIS = "RAPPORT_SOUMIS"
}

export interface CommentaireRapport {
  id: number;
  texte: string;
  dateCreation: string;
  rapport: {
    id: number;
    stage: {
      etudiant: { nom: string; prenom: string };
    };
  };
  encadrant: { id: number; nom: string; prenom: string };
}




export interface Stage {
  id: number;
  sujet: string;
  entreprise: string;
  adresseEntreprise?: string;
  telephoneEntreprise?: string;
  representantEntreprise?: string;
  filiere: string;
  dateDebut: string;
  dateFin: string;
  etat: EtatStage;
  note?: string;
  etudiant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  encadrant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  dateCreation?: string;
}

export interface StageRequest {
  sujet: string;
  entreprise: string;
  adresseEntreprise?: string;
  telephoneEntreprise?: string;
  representantEntreprise?: string;
  filiere: string;
  dateDebut: string;
  dateFin: string;
  idEtudiant?: number;
}


export interface Rapport {
  id: number;
  nom: string;
  dateUpload: string;
  etat: "EN_ATTENTE" | "VALIDE" | "REFUSE";
  commentaire?: string;
  stageId: number;
  data?: Blob;
  cloudinaryUrl?: string; // Ajouter cette propriété
}

// export interface AssignmentRequest {
//   encadrantId: number;
//   departementId: number;
//   classeGroupeId: number;
//   anneeScolaireId: number;
// }


// src/app/models/assignment-request.ts
export interface AssignmentRequest {
  encadrantId: number;
  departementId: number;
  classeGroupeId: number;
  anneeScolaireId: number;
}


export interface StudentAssignment {
  id: number;
  idEtudiant: number;
  idEncadrant: number;
  stageId?: number;
  createdAt: string;
  etudiant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  encadrant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  stage?: Stage;
}

export interface DecisionDto {
  idStage: number;
  approuver: boolean;
}




export interface Departement {
  id: number;
  nom: string;
}

export interface ClasseGroupe {
  id: number;
  nom: string;
}

export interface AnneeScolaire {
  id: number;
  libelle: string;
}

// Modifiez votre interface pour utiliser number ou string
export interface GroupAssignmentRequest {
  encadrantId: number | string;
  departementId: number | string;
  classeGroupeId: number | string;
  anneeScolaireId: number | string;
}

