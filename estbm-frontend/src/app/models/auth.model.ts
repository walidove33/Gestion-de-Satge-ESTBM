// export interface AuthResponse {
//   token: string;
//   role: 'ADMIN' | 'ENCADRANT' | 'ETUDIANT';
// }

// export interface RegisterRequest {
//   codeApogee: string;
//   codeMassar: string;
//   dateNaissance: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   telephone: string;
//   password: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nom: string
  prenom: string
  telephone: string
  codeApogee?: string
  codeMassar?: string
  dateNaissance?: string
  filiere?: string
  niveau?: string
}

export interface AuthResponse {
  token: string
  role: string
  user: {
    id: number
    email: string
    nom: string
    prenom: string
    role: string
  }
}
