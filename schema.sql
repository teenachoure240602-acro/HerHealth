
CREATE DATABASE IF NOT EXISTS herhealth;
USE herhealth;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS symptoms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    symptom_name VARCHAR(100) NOT NULL,
    severity INT NOT NULL,
    recorded_date DATE NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CHECK (severity BETWEEN 1 AND 10)
);

CREATE TABLE IF NOT EXISTS periods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    notes VARCHAR(300),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS health_articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    source_url VARCHAR(500)
);
