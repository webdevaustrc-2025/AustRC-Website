-- ============================================================================
-- AUST Robotics Club
-- Sub-Executive Registration System
-- PostgreSQL / Neon Database Schema
--
-- IMPORTANT:
-- This script recreates the registration schema from scratch.
-- Re-running it will DELETE existing data from these tables.
-- Use it for first-time setup or development reset.
-- ============================================================================

BEGIN;

-- UUID generation support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- CLEAN RESET
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_sub_ex_application_answers;
DROP VIEW IF EXISTS v_sub_ex_applications;

DROP TABLE IF EXISTS application_answers CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS screening_questions CASCADE;
DROP TABLE IF EXISTS recruitment_cycles CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

DROP SEQUENCE IF EXISTS sub_ex_application_seq;

DROP FUNCTION IF EXISTS validate_application_answer_team() CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- ----------------------------------------------------------------------------
-- COMMON UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- Stores the academic departments available in the registration form.
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    id              SMALLSERIAL PRIMARY KEY,
    code            VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL UNIQUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SEMESTERS
-- Stores selectable semesters in a controlled order.
-- ----------------------------------------------------------------------------
CREATE TABLE semesters (
    id              SMALLSERIAL PRIMARY KEY,
    name            VARCHAR(20) NOT NULL UNIQUE,
    display_order   SMALLINT NOT NULL UNIQUE CHECK (display_order > 0),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TEAMS
-- Stores the club teams/wings an applicant can select.
-- ----------------------------------------------------------------------------
CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL UNIQUE,
    slug            VARCHAR(150) NOT NULL UNIQUE,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_teams_set_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. RECRUITMENT CYCLES
-- Allows the same system to be reused for future recruitment rounds.
-- ----------------------------------------------------------------------------
CREATE TABLE recruitment_cycles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL UNIQUE,
    start_at        TIMESTAMPTZ,
    end_at          TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_recruitment_cycle_dates
        CHECK (
            start_at IS NULL
            OR end_at IS NULL
            OR end_at > start_at
        )
);

-- Only one recruitment cycle can be active at a time.
CREATE UNIQUE INDEX uq_only_one_active_recruitment_cycle
ON recruitment_cycles (is_active)
WHERE is_active = TRUE;

CREATE TRIGGER trg_recruitment_cycles_set_updated_at
BEFORE UPDATE ON recruitment_cycles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. TEAM-SPECIFIC SCREENING QUESTIONS
-- Each question belongs to one team.
--
-- Supported question_type values:
-- short_text, long_text, single_choice, multiple_choice,
-- yes_no, number, url
--
-- For choice questions, store choices in options as JSON, for example:
-- ["Beginner", "Intermediate", "Advanced"]
-- ----------------------------------------------------------------------------
CREATE TABLE screening_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id         UUID NOT NULL
                    REFERENCES teams(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

    question_text   TEXT NOT NULL,
    question_type   VARCHAR(30) NOT NULL DEFAULT 'long_text',
    is_required     BOOLEAN NOT NULL DEFAULT TRUE,
    display_order   SMALLINT NOT NULL CHECK (display_order > 0),
    options         JSONB,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_screening_question_type
        CHECK (
            question_type IN (
                'short_text',
                'long_text',
                'single_choice',
                'multiple_choice',
                'yes_no',
                'number',
                'url'
            )
        ),

    CONSTRAINT uq_team_question_order
        UNIQUE (team_id, display_order),

    CONSTRAINT chk_question_options_are_array
        CHECK (
            options IS NULL
            OR jsonb_typeof(options) = 'array'
        ),

    CONSTRAINT chk_choice_question_has_options
        CHECK (
            question_type NOT IN ('single_choice', 'multiple_choice')
            OR options IS NOT NULL
        )
);

CREATE INDEX idx_screening_questions_team
ON screening_questions(team_id, display_order);

CREATE TRIGGER trg_screening_questions_set_updated_at
BEFORE UPDATE ON screening_questions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 6. APPLICANTS
-- Stores a student's basic profile.
-- A student is stored once and may apply again in a future recruitment cycle.
-- ----------------------------------------------------------------------------
CREATE TABLE applicants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(150) NOT NULL,
    department_id   SMALLINT NOT NULL
                    REFERENCES departments(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
    student_id      VARCHAR(50) NOT NULL UNIQUE,
    semester_id     SMALLINT NOT NULL
                    REFERENCES semesters(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
    edu_email       VARCHAR(255) NOT NULL,
    personal_email  VARCHAR(255) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL,
    linkedin_url    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_full_name_not_blank
        CHECK (BTRIM(full_name) <> ''),

    CONSTRAINT chk_student_id_not_blank
        CHECK (BTRIM(student_id) <> ''),

    CONSTRAINT chk_edu_email_format
        CHECK (edu_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),

    CONSTRAINT chk_personal_email_format
        CHECK (personal_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),

    CONSTRAINT chk_phone_number_length
        CHECK (CHAR_LENGTH(BTRIM(phone_number)) BETWEEN 7 AND 20),

    CONSTRAINT chk_linkedin_url
        CHECK (
            linkedin_url IS NULL
            OR linkedin_url = ''
            OR linkedin_url ~* '^https?://([a-z]{2,3}\.)?linkedin\.com/'
        )
);

-- Case-insensitive uniqueness for email addresses.
CREATE UNIQUE INDEX uq_applicants_edu_email_lower
ON applicants (LOWER(edu_email));

CREATE UNIQUE INDEX uq_applicants_personal_email_lower
ON applicants (LOWER(personal_email));

CREATE INDEX idx_applicants_department
ON applicants(department_id);

CREATE INDEX idx_applicants_semester
ON applicants(semester_id);

CREATE TRIGGER trg_applicants_set_updated_at
BEFORE UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 7. APPLICATIONS
-- Connects an applicant to one recruitment cycle and one selected team.
-- ----------------------------------------------------------------------------
CREATE SEQUENCE sub_ex_application_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE applications (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_number      VARCHAR(40) NOT NULL UNIQUE DEFAULT (
                                'SUBEX-'
                                || TO_CHAR(CURRENT_DATE, 'YYYY')
                                || '-'
                                || LPAD(NEXTVAL('sub_ex_application_seq')::TEXT, 5, '0')
                            ),

    applicant_id            UUID NOT NULL
                            REFERENCES applicants(id)
                            ON UPDATE CASCADE
                            ON DELETE RESTRICT,

    recruitment_cycle_id    UUID NOT NULL
                            REFERENCES recruitment_cycles(id)
                            ON UPDATE CASCADE
                            ON DELETE RESTRICT,

    team_id                 UUID NOT NULL
                            REFERENCES teams(id)
                            ON UPDATE CASCADE
                            ON DELETE RESTRICT,

    status                  VARCHAR(30) NOT NULL DEFAULT 'submitted',
    admin_notes             TEXT,
    submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_application_status
        CHECK (
            status IN (
                'submitted',
                'under_review',
                'shortlisted',
                'interview',
                'selected',
                'rejected'
            )
        ),

    CONSTRAINT uq_applicant_per_recruitment_cycle
        UNIQUE (applicant_id, recruitment_cycle_id)
);

CREATE INDEX idx_applications_team_status
ON applications(team_id, status);

CREATE INDEX idx_applications_cycle_status
ON applications(recruitment_cycle_id, status);

CREATE INDEX idx_applications_submitted_at
ON applications(submitted_at DESC);

CREATE TRIGGER trg_applications_set_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 8. APPLICATION ANSWERS
-- Stores answers to the selected team's screening questions.
--
-- Use answer_text for normal text, number, yes/no, single-choice and URL answers.
-- Use answer_json for multiple-choice answers, for example:
-- ["React", "Node.js", "PostgreSQL"]
-- ----------------------------------------------------------------------------
CREATE TABLE application_answers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id  UUID NOT NULL
                    REFERENCES applications(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

    question_id     UUID NOT NULL
                    REFERENCES screening_questions(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,

    answer_text     TEXT,
    answer_json     JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_one_answer_per_question
        UNIQUE (application_id, question_id),

    CONSTRAINT chk_answer_has_value
        CHECK (
            NULLIF(BTRIM(COALESCE(answer_text, '')), '') IS NOT NULL
            OR answer_json IS NOT NULL
        )
);

CREATE INDEX idx_application_answers_application
ON application_answers(application_id);

CREATE INDEX idx_application_answers_question
ON application_answers(question_id);

CREATE TRIGGER trg_application_answers_set_updated_at
BEFORE UPDATE ON application_answers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Prevent an applicant from answering questions belonging to another team.
CREATE OR REPLACE FUNCTION validate_application_answer_team()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    selected_team_id UUID;
    question_team_id UUID;
BEGIN
    SELECT team_id
    INTO selected_team_id
    FROM applications
    WHERE id = NEW.application_id;

    SELECT team_id
    INTO question_team_id
    FROM screening_questions
    WHERE id = NEW.question_id;

    IF selected_team_id IS NULL THEN
        RAISE EXCEPTION 'Application % does not exist.', NEW.application_id;
    END IF;

    IF question_team_id IS NULL THEN
        RAISE EXCEPTION 'Screening question % does not exist.', NEW.question_id;
    END IF;

    IF selected_team_id <> question_team_id THEN
        RAISE EXCEPTION
            'The selected screening question does not belong to the application team.';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_application_answer_team
BEFORE INSERT OR UPDATE ON application_answers
FOR EACH ROW
EXECUTE FUNCTION validate_application_answer_team();

-- ============================================================================
-- DUMMY / SEED DATA
-- Edit these records according to the club's final requirements.
-- ============================================================================

-- Departments
INSERT INTO departments (code, name) VALUES
    ('CSE',  'Computer Science and Engineering'),
    ('EEE',  'Electrical and Electronic Engineering'),
    ('CE',   'Civil Engineering'),
    ('ME',   'Mechanical Engineering'),
    ('IPE',  'Industrial and Production Engineering'),
    ('TE',   'Textile Engineering'),
    ('ARCH', 'Architecture'),
    ('BBA',  'Business Administration');

-- Semesters
INSERT INTO semesters (name, display_order) VALUES
    ('1.1', 1),
    ('1.2', 2),
    ('2.1', 3),
    ('2.2', 4),
    ('3.1', 5),
    ('3.2', 6),
    ('4.1', 7),
    ('4.2', 8);

-- Teams
INSERT INTO teams (id, name, slug, description) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Web and App Development',
    'web-app-development',
    'Develops and maintains the club website, applications and internal software systems.'
),
(
    '10000000-0000-0000-0000-000000000002',
    'Robotics and Hardware',
    'robotics-hardware',
    'Works on robot design, electronics, sensors, embedded systems and hardware integration.'
),
(
    '10000000-0000-0000-0000-000000000003',
    'Research and Innovation',
    'research-innovation',
    'Explores robotics research, algorithms, artificial intelligence and innovative project ideas.'
),
(
    '10000000-0000-0000-0000-000000000004',
    'Media and Content',
    'media-content',
    'Manages graphics, video, photography, social media and written content.'
),
(
    '10000000-0000-0000-0000-000000000005',
    'Event Management',
    'event-management',
    'Plans, coordinates and executes workshops, competitions, seminars and club events.'
);

-- Active recruitment cycle
INSERT INTO recruitment_cycles (
    id,
    title,
    start_at,
    end_at,
    is_active
) VALUES (
    '20000000-0000-0000-0000-000000000001',
    'Sub-Executive Recruitment 2026',
    '2026-07-01 00:00:00+06',
    '2026-08-31 23:59:59+06',
    TRUE
);

-- Team-specific screening questions
INSERT INTO screening_questions (
    id,
    team_id,
    question_text,
    question_type,
    is_required,
    display_order,
    options
) VALUES
-- Web and App Development
(
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Which web or app development technologies have you worked with?',
    'long_text',
    TRUE,
    1,
    NULL
),
(
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Describe one software project you have completed or want to build.',
    'long_text',
    TRUE,
    2,
    NULL
),
(
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'What is your current development skill level?',
    'single_choice',
    TRUE,
    3,
    '["Beginner", "Intermediate", "Advanced"]'::JSONB
),

-- Robotics and Hardware
(
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'Which robotics, electronics or embedded-system tools have you used?',
    'long_text',
    TRUE,
    1,
    NULL
),
(
    '30000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Describe a hardware or robotics project you have worked on.',
    'long_text',
    TRUE,
    2,
    NULL
),
(
    '30000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000002',
    'Have you used Arduino, ESP32, Raspberry Pi or a similar board?',
    'yes_no',
    TRUE,
    3,
    NULL
),

-- Research and Innovation
(
    '30000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000003',
    'Which research areas in robotics or artificial intelligence interest you most?',
    'long_text',
    TRUE,
    1,
    NULL
),
(
    '30000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000003',
    'Describe how you would investigate a new technical problem.',
    'long_text',
    TRUE,
    2,
    NULL
),
(
    '30000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000003',
    'Have you previously read or written a research paper?',
    'yes_no',
    TRUE,
    3,
    NULL
),

-- Media and Content
(
    '30000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000004',
    'Which media or content-creation tools can you use?',
    'long_text',
    TRUE,
    1,
    NULL
),
(
    '30000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000004',
    'Which area interests you most?',
    'multiple_choice',
    TRUE,
    2,
    '["Graphics Design", "Video Editing", "Photography", "Content Writing", "Social Media"]'::JSONB
),
(
    '30000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000004',
    'Share a portfolio or sample-work link, if available.',
    'url',
    FALSE,
    3,
    NULL
),

-- Event Management
(
    '30000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000005',
    'Describe any event-organizing or volunteer experience you have.',
    'long_text',
    TRUE,
    1,
    NULL
),
(
    '30000000-0000-0000-0000-000000000014',
    '10000000-0000-0000-0000-000000000005',
    'How would you handle a last-minute problem during an event?',
    'long_text',
    TRUE,
    2,
    NULL
),
(
    '30000000-0000-0000-0000-000000000015',
    '10000000-0000-0000-0000-000000000005',
    'Are you comfortable communicating with participants and guests?',
    'yes_no',
    TRUE,
    3,
    NULL
);

-- Dummy applicants
INSERT INTO applicants (
    id,
    full_name,
    department_id,
    student_id,
    semester_id,
    edu_email,
    personal_email,
    phone_number,
    linkedin_url
) VALUES
(
    '40000000-0000-0000-0000-000000000001',
    'Tanvir Ahmed',
    (SELECT id FROM departments WHERE code = 'CSE'),
    '20230104001',
    (SELECT id FROM semesters WHERE name = '3.1'),
    'tanvir.20230104001@aust.edu',
    'tanvir.ahmed@example.com',
    '+8801711111111',
    'https://www.linkedin.com/in/tanvir-ahmed-demo'
),
(
    '40000000-0000-0000-0000-000000000002',
    'Nusrat Jahan',
    (SELECT id FROM departments WHERE code = 'EEE'),
    '20230202015',
    (SELECT id FROM semesters WHERE name = '2.2'),
    'nusrat.20230202015@aust.edu',
    'nusrat.jahan@example.com',
    '+8801812222222',
    'https://www.linkedin.com/in/nusrat-jahan-demo'
),
(
    '40000000-0000-0000-0000-000000000003',
    'Samiul Hasan',
    (SELECT id FROM departments WHERE code = 'ME'),
    '20230308009',
    (SELECT id FROM semesters WHERE name = '2.1'),
    'samiul.20230308009@aust.edu',
    'samiul.hasan@example.com',
    '+8801913333333',
    NULL
);

-- Dummy applications
INSERT INTO applications (
    id,
    application_number,
    applicant_id,
    recruitment_cycle_id,
    team_id,
    status,
    admin_notes
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    'SUBEX-2026-00001',
    '40000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'under_review',
    'Strong interest in frontend development.'
),
(
    '50000000-0000-0000-0000-000000000002',
    'SUBEX-2026-00002',
    '40000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'submitted',
    NULL
),
(
    '50000000-0000-0000-0000-000000000003',
    'SUBEX-2026-00003',
    '40000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000005',
    'shortlisted',
    'Has previous event-volunteering experience.'
);

-- Ensure future automatically generated numbers continue after the dummy records.
SELECT SETVAL('sub_ex_application_seq', 3, TRUE);

-- Dummy answers: Web and App Development
INSERT INTO application_answers (
    application_id,
    question_id,
    answer_text
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'HTML, CSS, JavaScript, React, Node.js and basic PostgreSQL.'
),
(
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'I developed a student task-management website using React and Firebase.'
),
(
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    'Intermediate'
);

-- Dummy answers: Robotics and Hardware
INSERT INTO application_answers (
    application_id,
    question_id,
    answer_text
) VALUES
(
    '50000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000004',
    'Arduino IDE, basic circuit design, sensors and C programming.'
),
(
    '50000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000005',
    'I built a line-following robot for a departmental project.'
),
(
    '50000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000006',
    'Yes'
);

-- Dummy answers: Event Management
INSERT INTO application_answers (
    application_id,
    question_id,
    answer_text
) VALUES
(
    '50000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000013',
    'I volunteered in two university seminars and managed participant registration.'
),
(
    '50000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000014',
    'I would identify the highest-priority issue, inform the responsible person and execute a backup plan.'
),
(
    '50000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000015',
    'Yes'
);

-- ============================================================================
-- ADMIN-FRIENDLY VIEWS
-- ============================================================================

-- One row per application with all basic information.
CREATE VIEW v_sub_ex_applications AS
SELECT
    a.id AS application_id,
    a.application_number,
    a.status,
    a.admin_notes,
    a.submitted_at,
    a.updated_at,

    ap.id AS applicant_id,
    ap.full_name,
    ap.student_id,
    d.code AS department_code,
    d.name AS department_name,
    s.name AS semester,
    ap.edu_email,
    ap.personal_email,
    ap.phone_number,
    ap.linkedin_url,

    t.id AS team_id,
    t.name AS team_name,
    t.slug AS team_slug,

    rc.id AS recruitment_cycle_id,
    rc.title AS recruitment_cycle
FROM applications a
JOIN applicants ap
    ON ap.id = a.applicant_id
JOIN departments d
    ON d.id = ap.department_id
JOIN semesters s
    ON s.id = ap.semester_id
JOIN teams t
    ON t.id = a.team_id
JOIN recruitment_cycles rc
    ON rc.id = a.recruitment_cycle_id;

-- One row per screening answer.
CREATE VIEW v_sub_ex_application_answers AS
SELECT
    a.application_number,
    ap.full_name,
    ap.student_id,
    t.name AS team_name,
    q.display_order,
    q.question_text,
    q.question_type,
    aa.answer_text,
    aa.answer_json,
    aa.created_at AS answered_at
FROM application_answers aa
JOIN applications a
    ON a.id = aa.application_id
JOIN applicants ap
    ON ap.id = a.applicant_id
JOIN teams t
    ON t.id = a.team_id
JOIN screening_questions q
    ON q.id = aa.question_id;

COMMIT;

-- ============================================================================
-- OPTIONAL TEST QUERIES
-- Run these after setup to confirm that everything was created successfully.
-- ============================================================================

-- SELECT * FROM departments ORDER BY id;
-- SELECT * FROM semesters ORDER BY display_order;
-- SELECT * FROM teams ORDER BY name;
-- SELECT * FROM recruitment_cycles;
-- SELECT * FROM screening_questions ORDER BY team_id, display_order;
-- SELECT * FROM v_sub_ex_applications ORDER BY submitted_at DESC;
-- SELECT * FROM v_sub_ex_application_answers
-- ORDER BY application_number, display_order;
