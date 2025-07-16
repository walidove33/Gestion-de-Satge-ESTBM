package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByEtudiantId(Long etudiantId);
    List<Document> findByStageId(Long stageId);
}