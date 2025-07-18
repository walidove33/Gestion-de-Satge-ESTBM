package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.model.enums.EtatStage;
import com.wbs.mymovie.estbm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.text.DocumentException;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.Optional;

@Service
public class StageService {

    @Autowired private StageRepository stageRepository;
    @Autowired private EtudiantRepository etudiantRepository;
    @Autowired private EncadrantRepository encadrantRepository;
    @Autowired private RapportRepository rapportRepository;
    @Autowired private DocumentModeleRepository documentModeleRepository;
    @Autowired private DocumentRepository documentRepository;
    @Autowired private ConventionGeneratorService conventionGeneratorService;

    @Value("${upload.directory}")
    private String uploadDir;

    public Stage creerDemande(DemandeStageDto dto) {
        Etudiant etu = etudiantRepository.findById(dto.getIdEtudiant())
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        Stage s = new Stage();
        s.setSujet(dto.getSujet());
        s.setEntreprise(dto.getEntreprise());
        s.setAdresseEntreprise(dto.getAdresseEntreprise());
        s.setTelephoneEntreprise(dto.getTelephoneEntreprise());
        s.setRepresentantEntreprise(dto.getRepresentantEntreprise());
        s.setFiliere(dto.getFiliere());
        s.setDateDebut(dto.getDateDebut());
        s.setDateFin(dto.getDateFin());
        s.setEtat(EtatStage.EN_ATTENTE);
        s.setEtudiant(etu);
        s.setDateCreation(LocalDateTime.now());
        return stageRepository.save(s);
    }

    public List<Stage> getStagesParEtudiant(Long idEtudiant) {
        return stageRepository.findByEtudiantId(idEtudiant);
    }

    public List<Stage> getStagesParEncadrant(Long idEncadrant) {
        return stageRepository.findByEncadrantId(idEncadrant);
    }

    public String etatDemande(Long idEtudiant) {
        Optional<Stage> stageOpt = stageRepository.findTopByEtudiantIdOrderByDateCreationDesc(idEtudiant);
        return stageOpt.map(stage -> stage.getEtat().name()).orElse("Aucune demande");
    }

    public String soumettreRapport(Long idStage, MultipartFile rapport) {
        try {
            Stage s = stageRepository.findById(idStage)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));
            Rapport r = new Rapport();
            r.setStage(s);
            r.setNom(rapport.getOriginalFilename());
            r.setData(rapport.getBytes());
            rapportRepository.save(r);
            s.setEtat(EtatStage.RAPPORT_SOUMIS);
            stageRepository.save(s);
            return "Rapport soumis avec succès";
        } catch (Exception e) {
            return "Erreur lors du dépôt du rapport";
        }
    }

    public ResponseEntity<Resource> genererEtTelechargerConvention(Long idStage) {
        Stage stage = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

        try {
            byte[] pdfContent = conventionGeneratorService.generateConventionPdf(stage);
            ByteArrayResource resource = new ByteArrayResource(pdfContent);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=convention_" + idStage + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("Erreur de génération PDF".getBytes()));
        }
    }

    public Map<String, Object> getStatistiques() {
        long total = stageRepository.count();
        long enAttente = stageRepository.countByEtat(EtatStage.EN_ATTENTE);
        long valides = stageRepository.countByEtat(EtatStage.VALIDE);
        long refuses = stageRepository.countByEtat(EtatStage.REFUSE);
        Map<String,Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("enAttente", enAttente);
        stats.put("valides", valides);
        stats.put("refuses", refuses);
        return stats;
    }

    public ResponseEntity<?> exporterListes(String format) {
        // Implémentation réelle à compléter
        String data = "Export " + format;
        ByteArrayResource res = new ByteArrayResource(data.getBytes());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=list." + format)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(res);
    }

    public ResponseEntity<?> genererConventionAuto(Long idStage) {
        return genererEtTelechargerConvention(idStage);
    }

    public ResponseEntity<?> assignerEncadrant(Long idStage, Long idEncadrant) {
        Stage s = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        Encadrant e = encadrantRepository.findById(idEncadrant)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
        s.setEncadrant(e);
        stageRepository.save(s);
        return ResponseEntity.ok("Encadrant assigné");
    }

    public ResponseEntity<?> attribuerDocument(Long idStage, MultipartFile file, String type) {
        try {
            Stage stage = stageRepository.findById(idStage)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = type + "_" + idStage + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setNom(file.getOriginalFilename());
            document.setType(type);
            document.setCheminFichier(filePath.toString());
            document.setStage(stage);
            document.setEtudiant(stage.getEtudiant());
            documentRepository.save(document);

            return ResponseEntity.ok(type + " attribué au stage " + idStage);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload du fichier");
        }
    }

    public String approuverOuRefuser(DecisionDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        s.setEtat(dto.isApprouver() ? EtatStage.VALIDE : EtatStage.REFUSE);
        stageRepository.save(s);
        return "Décision enregistrée";
    }

    public String ajouterNote(NoteDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        s.setNote(dto.getCommentaire());
        stageRepository.save(s);
        return "Commentaire ajouté";
    }

    public List<Stage> listerDemandesPourEncadrant(String filiere) {
        if (filiere == null) {
            return stageRepository.findByEtat(EtatStage.EN_ATTENTE);
        }
        return stageRepository.findByFiliereAndEtat(filiere, EtatStage.EN_ATTENTE);
    }

    public ResponseEntity<?> assignerEncadrantAEtudiant(AssignmentDto dto) {
        Etudiant etu = etudiantRepository.findById(dto.getIdEtudiant())
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        Encadrant enc = encadrantRepository.findById(dto.getIdEncadrant())
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
        etu.setEncadrant(enc);
        etudiantRepository.save(etu);
        return ResponseEntity.ok("Encadrant affecté à l'étudiant");
    }

    // Nouvelle méthode pour récupérer les documents d'un stage
    public List<Document> getDocumentsByStageId(Long stageId) {
        return documentRepository.findByStageId(stageId);
    }

    public void ajouterDocuments(Long stageId,
                                 List<MultipartFile> fichiers,
                                 List<String> types) throws IOException {
        Stage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé avec ID: " + stageId));

        // Créer le dossier uploads/stages/{stageId}
        Path uploadDir = Paths.get("uploads/stages/" + stageId);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Boucle sur chaque fichier + son type
        for (int i = 0; i < fichiers.size(); i++) {
            MultipartFile fichier = fichiers.get(i);
            String type    = types.get(i);

            if (fichier == null || fichier.isEmpty()) continue;

            String nomFichier = System.currentTimeMillis() + "_" + fichier.getOriginalFilename();
            Path   cible      = uploadDir.resolve(nomFichier);
            Files.copy(fichier.getInputStream(), cible, StandardCopyOption.REPLACE_EXISTING);

            Document doc = new Document();
            doc.setNom(fichier.getOriginalFilename());
            doc.setType(type);
            doc.setCheminFichier(cible.toString());
            doc.setStage(stage);
            // (optionnel) doc.setEtudiant(stage.getEtudiant());
            documentRepository.save(doc);
        }
    }
}