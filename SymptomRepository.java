
package com.herhealth.api;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SymptomRepository
        extends JpaRepository<Symptom, Long> {
}
