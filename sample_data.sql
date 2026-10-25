
USE herhealth;

INSERT INTO users (display_name, email)
VALUES ('Demo User', 'demo@example.test');

INSERT INTO symptoms
(user_id, symptom_name, severity, recorded_date, notes)
VALUES
(1, 'Cramps', 6, '2026-10-22', 'Fictional demo record'),
(1, 'Fatigue', 4, '2026-10-23', 'Fictional demo record'),
(1, 'Headache', 3, '2026-10-24', 'Fictional demo record');

INSERT INTO periods
(user_id, start_date, end_date, notes)
VALUES
(1, '2026-10-20', '2026-10-24', 'Fictional demo record');

INSERT INTO health_articles
(title, category, content, source_url)
VALUES
(
    'Understanding Menstrual Health',
    'Menstrual Health',
    'Learn about menstrual cycles and when to seek medical advice.',
    'https://www.who.int/health-topics/menstrual-health'
);
