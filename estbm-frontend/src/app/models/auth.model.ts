


// export interface LoginRequest {
//   email: string
//   password: string
// }

// export interface RegisterRequest {
//   email: string
//   password: string
//   nom: string
//   prenom: string
//   telephone: string
//   codeApogee?: string
//   codeMassar?: string
//   dateNaissance?: string
//   filiere?: string
//   niveau?: string
// }

// export interface AuthResponse {
//   token: string
//   refreshToken?: string
//   role: string
//   user: {
//     id: number
//     email: string
//     nom: string
//     prenom: string
//     role: string
//     telephone?: string
//   }
// }

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  codeApogee?: string;
  codeMassar?: string;
  dateNaissance?: string;
  filiere?: string;
  niveau?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  role: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    telephone?: string;
  };
}