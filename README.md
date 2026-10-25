# HerHealth — Women's Healthcare Tracker

HerHealth is a web application designed to help users track symptoms, monitor menstrual cycles, view dashboard statistics, and explore women's health awareness information.

## Features

- **Dashboard:** View symptom tracking statistics.
- **Symptom Tracker:** Add, view, and delete symptom records.
- **Period Tracker:** Estimate the next period using the last period start date and cycle length.
- **Health Awareness:** Explore women's health awareness information.

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Java, Spring Boot
- Database: MySQL
- Period tracker data: Browser localStorage

## Project Structure

- `frontend/` — Frontend pages, styles, and JavaScript
- `herhealth-api/` — Spring Boot backend and API

## Local Setup

### 1. Database
Install MySQL and create a database named `herhealth`.

### 2. Backend
Configure your local database credentials in `application.properties`. Never commit real passwords or credentials to a public repository.

From the `herhealth-api` folder, run:

`.\mvnw.cmd spring-boot:run`

The backend runs on port 8080 by default.

### 3. Frontend
Open the frontend using VS Code Live Server or another local web server. Ensure the frontend API configuration points to the running backend.

## Important Note

HerHealth is an educational tracking application and is not a substitute for professional medical advice or diagnosis.

## Security

Do not commit real database passwords, API keys, personal health records, or other sensitive information.
