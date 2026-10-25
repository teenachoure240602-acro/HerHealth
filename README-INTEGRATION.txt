HERHEALTH FRONTEND INTEGRATION
1. Unzip this folder.
2. Start the Spring Boot backend on http://localhost:8080.
3. Open this folder in VS Code and run index.html with Live Server (port 5500).
4. The frontend CORS origin must match http://localhost:5500 or http://127.0.0.1:5500.

Compatibility:
- POST sends {name, date, severity, notes}. Severity is numeric (2=Mild, 5=Moderate, 9=Severe) to match the current API.
- The existing backend persists name, severity, date and notes. Duration is not persisted unless you add a duration field to Symptom.java.
- Period dates remain in browser localStorage because no period endpoint was provided.
- Delete requires DELETE /api/symptoms/{id}. If your controller currently only has GET and POST, add this method inside SymptomController:

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteSymptom(@PathVariable Long id) {
    if (!repository.existsById(id)) return ResponseEntity.notFound().build();
    repository.deleteById(id);
    return ResponseEntity.noContent().build();
}

Add imports if missing:
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

No authentication is included. Do not use with real personal health data in a public deployment without suitable security and privacy controls.
