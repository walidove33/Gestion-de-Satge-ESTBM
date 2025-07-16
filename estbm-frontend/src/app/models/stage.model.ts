// export interface Stage {
//   id: number;
//   sujet: string;
//   entreprise: string;
//   filiere: string;
//   dateDebut: string;
//   dateFin: string;
//   etat: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'EN_COURS' | 'TERMINE';
//   note?: string;
//   etudiantId?: number;
//   encadrantId?: number;
// }

// export interface StageRequest {
//   sujet: string;
//   entreprise: string;
//   filiere: string;
//   dateDebut: string;
//   dateFin: string;
//   assurance?: File;
//   convention?: File;
// }

// export interface Rapport {
//   id: number;
//   nom: string;
//   data: Blob;
//   stageId: number;
//   dateUpload: string;
//   etat: 'SOUMIS' | 'VALIDE' | 'REJETE';
//   commentaire?: string;
// }

export interface Stage {
  id: number
  sujet: string
  entreprise: string
  filiere: string
  dateDebut: string
  dateFin: string
  etat: "EN_ATTENTE" | "APPROUVE" | "REJETE" | "EN_COURS" | "TERMINE"
  note?: string
  etudiantId: number
  encadrantId?: number
  createdAt?: string
  updatedAt?: string
}

export interface StageRequest {
  sujet: string
  entreprise: string
  filiere: string
  dateDebut: string
  dateFin: string
  etudiantId: number
}

export interface Rapport {
  id: number
  nom: string
  dateUpload: string
  etat: "EN_ATTENTE" | "VALIDE" | "REJETE"
  commentaire?: string
  stageId: number
  data?: Blob
}

export interface AssignmentRequest {
  etudiantId: number
  encadrantId: number
  stageId?: number
}

export interface StudentAssignment {
  id: number
  etudiantId: number
  encadrantId: number
  stageId?: number
  createdAt: string
  etudiant?: {
    id: number
    nom: string
    prenom: string
    email: string
  }
  encadrant?: {
    id: number
    nom: string
    prenom: string
    email: string
  }
  stage?: Stage
}
