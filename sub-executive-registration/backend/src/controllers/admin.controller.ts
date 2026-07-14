import type { Request, Response } from 'express';
import { pool } from '../config/database';
import { AppError } from '../utils/AppError';
import ExcelJS from 'exceljs';

// GET all form configs
export async function getFormConfigs(request: Request, response: Response) {
  const { category } = request.query;

  if (category) {
    const result = await pool.query(
      `SELECT id, category_name AS "categoryName", fields, created_at AS "createdAt"
       FROM form_configs
       WHERE category_name = $1`,
      [category]
    );
    response.json({ success: true, data: result.rows[0] || null });
    return;
  }

  const result = await pool.query(
    `SELECT id, category_name AS "categoryName", fields, created_at AS "createdAt"
     FROM form_configs
     ORDER BY category_name`
  );
  response.json({ success: true, data: result.rows });
}

// GET form config by ID
export async function getFormConfigById(request: Request, response: Response) {
  const { id } = request.params;
  const result = await pool.query(
    `SELECT id, category_name AS "categoryName", fields, created_at AS "createdAt"
     FROM form_configs
     WHERE id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError(404, 'CONFIG_NOT_FOUND', 'Form configuration not found.');
  }
  response.json({ success: true, data: row });
}

// GET form config by Category Name
export async function getFormConfigByCategory(request: Request, response: Response) {
  const { categoryName } = request.params;
  const result = await pool.query(
    `SELECT id, category_name AS "categoryName", fields, created_at AS "createdAt"
     FROM form_configs
     WHERE category_name = $1`,
    [categoryName]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError(404, 'CONFIG_NOT_FOUND', `Form configuration for category "${categoryName}" not found.`);
  }
  response.json({ success: true, data: row });
}

// POST create form config
export async function createFormConfig(request: Request, response: Response) {
  const { categoryName, fields } = request.body;
  if (!categoryName?.trim()) {
    throw new AppError(400, 'BAD_REQUEST', 'Category name is required.');
  }
  if (!Array.isArray(fields)) {
    throw new AppError(400, 'BAD_REQUEST', 'Fields must be an array.');
  }

  try {
    const result = await pool.query(
      `INSERT INTO form_configs (category_name, fields)
       VALUES ($1, $2::jsonb)
       RETURNING id, category_name AS "categoryName", fields, created_at AS "createdAt"`,
      [categoryName.trim(), JSON.stringify(fields)]
    );
    response.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') { // unique violation
      throw new AppError(409, 'DUPLICATE_CATEGORY', `A form configuration for "${categoryName}" already exists.`);
    }
    throw error;
  }
}

// PUT update form config
export async function updateFormConfig(request: Request, response: Response) {
  const { id } = request.params;
  const { categoryName, fields } = request.body;
  if (!categoryName?.trim()) {
    throw new AppError(400, 'BAD_REQUEST', 'Category name is required.');
  }
  if (!Array.isArray(fields)) {
    throw new AppError(400, 'BAD_REQUEST', 'Fields must be an array.');
  }

  try {
    const result = await pool.query(
      `UPDATE form_configs
       SET category_name = $2, fields = $3::jsonb
       WHERE id = $1
       RETURNING id, category_name AS "categoryName", fields, created_at AS "createdAt"`,
      [id, categoryName.trim(), JSON.stringify(fields)]
    );
    const row = result.rows[0];
    if (!row) {
      throw new AppError(404, 'CONFIG_NOT_FOUND', 'Form configuration not found to update.');
    }
    response.json({ success: true, data: row });
  } catch (error: any) {
    if (error.code === '23505') {
      throw new AppError(409, 'DUPLICATE_CATEGORY', `Another form configuration for "${categoryName}" already exists.`);
    }
    throw error;
  }
}

// DELETE form config
export async function deleteFormConfig(request: Request, response: Response) {
  const { id } = request.params;
  const result = await pool.query(
    `DELETE FROM form_configs
     WHERE id = $1
     RETURNING id`,
    [id]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError(404, 'CONFIG_NOT_FOUND', 'Form configuration not found to delete.');
  }
  response.json({ success: true, message: 'Form configuration deleted successfully.' });
}

// GET export registrations to Excel
export async function exportRegistrations(request: Request, response: Response) {
  try {
    // Fetch all registrations from the view
    const result = await pool.query(`
      SELECT 
        application_id,
        application_number,
        status,
        submission_data,
        admin_notes,
        submitted_at,
        updated_at,
        applicant_id,
        full_name,
        student_id,
        department_name,
        semester,
        edu_email,
        personal_email,
        phone_number,
        linkedin_url,
        team_name,
        recruitment_cycle
      FROM v_sub_ex_applications
      ORDER BY submitted_at DESC
    `);

    const rows = result.rows;

    // Collect all unique keys in submission_data across all rows
    const dynamicKeys = new Set<string>();
    for (const row of rows) {
      if (row.submission_data && typeof row.submission_data === 'object') {
        Object.keys(row.submission_data).forEach(key => {
          const standardFields = [
            'fullName',
            'studentId',
            'departmentId',
            'semesterId',
            'phoneNumber',
            'eduEmail',
            'personalEmail',
            'linkedinUrl',
            'teamId'
          ];
          if (!standardFields.includes(key)) {
            dynamicKeys.add(key);
          }
        });
      }
    }

    const dynamicKeysList = Array.from(dynamicKeys);

    // Create workbook & sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    // Define columns
    const columns = [
      { header: 'Application Number', key: 'application_number', width: 22 },
      { header: 'Full Name', key: 'full_name', width: 25 },
      { header: 'Student ID', key: 'student_id', width: 18 },
      { header: 'Department', key: 'department_name', width: 30 },
      { header: 'Semester', key: 'semester', width: 12 },
      { header: 'Educational Email', key: 'edu_email', width: 28 },
      { header: 'Personal Email', key: 'personal_email', width: 28 },
      { header: 'Phone Number', key: 'phone_number', width: 18 },
      { header: 'LinkedIn URL', key: 'linkedin_url', width: 35 },
      { header: 'Applied Team', key: 'team_name', width: 25 },
      { header: 'Recruitment Cycle', key: 'recruitment_cycle', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Submitted At', key: 'submitted_at', width: 22 },
      { header: 'Admin Notes', key: 'admin_notes', width: 35 }
    ];

    // Add columns for dynamic keys
    dynamicKeysList.forEach(key => {
      // capitalize key name for header
      const headerLabel = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      columns.push({ header: headerLabel, key: `dyn_${key}`, width: 30 });
    });

    worksheet.columns = columns;

    // Apply header row styles
    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2ECC71' } // AUSTRC Green theme color
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    headerRow.height = 28;

    // Add rows
    rows.forEach(row => {
      const rowData: any = {
        application_number: row.application_number,
        full_name: row.full_name,
        student_id: row.student_id,
        department_name: row.department_name,
        semester: row.semester,
        edu_email: row.edu_email,
        personal_email: row.personal_email,
        phone_number: row.phone_number,
        linkedin_url: row.linkedin_url || '',
        team_name: row.team_name,
        recruitment_cycle: row.recruitment_cycle,
        status: row.status.toUpperCase().replace('_', ' '),
        submitted_at: row.submitted_at ? new Date(row.submitted_at).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) : '',
        admin_notes: row.admin_notes || ''
      };

      // Fill in dynamic keys
      dynamicKeysList.forEach(key => {
        const val = row.submission_data?.[key];
        rowData[`dyn_${key}`] = Array.isArray(val) ? val.join(', ') : val ?? '';
      });

      const excelRow = worksheet.addRow(rowData);
      excelRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    });

    // Add gridlines and zebra stripe styling
    worksheet.views = [{ showGridLines: true }];
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.height = 22;
      if (i % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2FAF4' } // Soft green tint for zebra striping
        };
      }
    }

    // Set borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        };
      });
    });

    // Set response headers and send Excel file
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=sub-executive-registrations.xlsx'
    );

    await workbook.xlsx.write(response);
    response.end();
  } catch (error) {
    console.error('Failed to export registrations:', error);
    response.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_FAILED',
        message: 'Could not generate the Excel file. Please try again later.'
      }
    });
  }
}
