
package com.herhealth.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
@CrossOrigin(origins = {
    "http://localhost:5500",
    "http://127.0.0.1:5500"
})
public class SymptomController {

    private final SymptomRepository repository;

    public SymptomController(SymptomRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Symptom> getSymptoms() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addSymptom(
            @RequestBody Symptom symptom) {

        if (symptom.getName() == null
                || symptom.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Symptom name is required");
        }

        if (symptom.getSeverity() < 1
                || symptom.getSeverity() > 10) {
            return ResponseEntity.badRequest()
                    .body("Severity must be between 1 and 10");
        }

        if (symptom.getDate() == null) {
            return ResponseEntity.badRequest()
                    .body("Date is required");
        }

        Symptom saved = repository.save(symptom);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved);
    }
     
    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteSymptom(@PathVariable Long id) {
    if (!repository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    repository.deleteById(id);
    return ResponseEntity.noContent().build();
}
}
