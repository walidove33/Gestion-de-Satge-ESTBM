package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.DecisionDto;
import com.wbs.mymovie.estbm.dto.NoteDto;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.model.enums.EtatStage;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.repository.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EncadrantService {

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private StageRepository stageRepository;

    /**
     * Valider un stage par l'encadrant.
     */
    public boolean validerStage(Long idEncadrant, Long idStage) {
        Optional<Stage> stageOpt = stageRepository.findById(idStage);
        if (stageOpt.isPresent()) {
            Stage stage = stageOpt.get();
            if (stage.getEncadrant() != null && stage.getEncadrant().getId().equals(idEncadrant)) {
                stage.setEtat(EtatStage.valueOf("VALIDE"));
                stageRepository.save(stage);
                return true;
            }
        }
        return false;
    }

    /**
     * Refuser un stage.
     */
    public boolean refuserStage(Long idEncadrant, Long idStage) {
        Optional<Stage> stageOpt = stageRepository.findById(idStage);
        if (stageOpt.isPresent()) {
            Stage stage = stageOpt.get();
            if (stage.getEncadrant() != null && stage.getEncadrant().getId().equals(idEncadrant)) {
                stage.setEtat(EtatStage.valueOf("REFUSE"));
                stageRepository.save(stage);
                return true;
            }
        }
        return false;
    }


    public boolean attribuerNote(Long idEncadrant, Long idStage, String commentaire) {
        Optional<Stage> stageOpt = stageRepository.findById(idStage);
        if (stageOpt.isPresent()) {
            Stage stage = stageOpt.get();
            if (stage.getEncadrant() != null && stage.getEncadrant().getId().equals(idEncadrant)) {
                stage.setNote(commentaire); // ici note est un texte
                stageRepository.save(stage);
                return true;
            }
        }
        return false;
    }

    public String decisionStage(DecisionDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage()).orElseThrow();
        s.setEtat(dto.isApprouver() ? EtatStage.VALIDE : EtatStage.REFUSE);
        stageRepository.save(s);
        return "OK";
    }

    public String attribuerNote(NoteDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage()).orElseThrow();
        s.setNote(dto.getCommentaire());
        stageRepository.save(s);
        return "OK";
    }

    public List<byte[]> getRapportsParEncadrant(Long idEnc) {
        // implémentation simple : récupérer stages puis rapports
        return List.of();
    }

}
