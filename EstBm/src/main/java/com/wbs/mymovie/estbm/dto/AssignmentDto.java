// src/main/java/com/wbs/mymovie/estbm/dto/AssignmentDto.java
package com.wbs.mymovie.estbm.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
//
//@Data
//public class AssignmentDto {
//    private Long etudiantId;
//    private String etudiantNom;
//    private Long encadrantId;
//    private String encadrantNom;
//
//    // Getters et Setters
//}
//

@Data
public class AssignmentDto {
    private Long etudiantId;
    private Long encadrantId;
    private String etudiantNom;
    private String encadrantNom;
}