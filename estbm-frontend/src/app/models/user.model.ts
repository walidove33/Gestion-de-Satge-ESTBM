// export interface User {
//   id: number;
//   email: string;
//   nom: string;
//   prenom: string;
//   role: 'ADMIN' | 'ENCADRANT' | 'ETUDIANT';
//   telephone?: string;
//   codeApogee?: string;
//   codeMassar?: string;
//   dateNaissance?: string;
//   specialite?: string;
// }

// export interface CreateEncadrantRequest {
//   email: string;
//   password: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
//   specialite: string;
// }

// export interface CreateAdminRequest {
//   email: string;
//   password: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
// }
export interface User {
  id: number
  email: string
  nom: string
  prenom: string
  role: "ETUDIANT" | "ENCADRANT" | "ADMIN"
  telephone?: string
  codeApogee?: string
  codeMassar?: string
  dateNaissance?: string
  specialite?: string
  filiere?: string
  niveau?: string
}

export interface CreateEncadrantRequest {
  email: string
  password: string
  nom: string
  prenom: string
  telephone: string
  specialite: string
}

export interface CreateAdminRequest {
  email: string
  password: string
  nom: string
  prenom: string
  telephone: string
}
