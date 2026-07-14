import { pool } from '../config/database';

async function runMigration() {
  console.log('Starting database migration...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create form_configs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS form_configs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_name VARCHAR(150) NOT NULL UNIQUE,
        fields JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ form_configs table created or already exists.');

    // 2. Add submission_data column to applications table
    await client.query(`
      ALTER TABLE applications 
      ADD COLUMN IF NOT EXISTS submission_data JSONB
    `);
    console.log('✓ submission_data column added to applications table or already exists.');

    // 3. Drop and recreate the view v_sub_ex_applications to include submission_data
    await client.query(`
      DROP VIEW IF EXISTS v_sub_ex_applications CASCADE;
      
      CREATE VIEW v_sub_ex_applications AS
      SELECT
          a.id AS application_id,
          a.application_number,
          a.status,
          a.submission_data,
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
    `);
    console.log('✓ v_sub_ex_applications view recreated successfully.');

    // 4. Seed default Form Config for Sub-Executive Registration if it doesn't exist
    const checkConfig = await client.query('SELECT id FROM form_configs WHERE category_name = $1', ['Sub-Executive']);
    if (checkConfig.rows.length === 0) {
      const defaultFields = [
        { name: 'fullName', label: 'Name', type: 'text', required: true, step: '01', placeholder: 'Enter your full name' },
        { name: 'departmentId', label: 'Department', type: 'select', required: true, step: '01' },
        { name: 'studentId', label: 'Student ID', type: 'text', required: true, step: '01', placeholder: 'Example: 20230104001' },
        { name: 'semesterId', label: 'Semester', type: 'select', required: true, step: '01' },
        { name: 'phoneNumber', label: 'Phone number', type: 'tel', required: true, step: '01', placeholder: '+8801XXXXXXXXX' },
        { name: 'eduEmail', label: 'Educational email', type: 'email', required: true, step: '01', placeholder: 'your-id@aust.edu' },
        { name: 'personalEmail', label: 'Personal email', type: 'email', required: true, step: '01', placeholder: 'yourname@gmail.com' },
        { name: 'linkedinUrl', label: 'LinkedIn profile', type: 'url', required: false, step: '01', placeholder: 'https://www.linkedin.com/in/your-profile' },
        { name: 'teamId', label: 'Team', type: 'select', required: true, step: '02' }
      ];
      await client.query(
        'INSERT INTO form_configs (category_name, fields) VALUES ($1, $2::jsonb)',
        ['Sub-Executive', JSON.stringify(defaultFields)]
      );
      console.log('✓ Seeded default form configuration for "Sub-Executive".');
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

void runMigration();
