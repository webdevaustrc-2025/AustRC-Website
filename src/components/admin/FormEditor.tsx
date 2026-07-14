import React, { useState, useEffect } from 'react';
import { useAdminStyles } from './useAdminStyles';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  FileSpreadsheet,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from 'lucide-react';

const API_BASE_URL = (
  import.meta.env.VITE_SUB_EXECUTIVE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'tel' | 'number' | 'url';
  required: boolean;
  step: '01' | '02' | '03';
  placeholder?: string;
  options?: string[];
}

interface FormConfig {
  id: string;
  categoryName: string;
  fields: FormField[];
  createdAt: string;
}

export function FormEditor() {
  const s = useAdminStyles();
  const t = s.t;

  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  
  // Field editing details
  const [fName, setFName] = useState('');
  const [fLabel, setFLabel] = useState('');
  const [fType, setFType] = useState<FormField['type']>('text');
  const [fRequired, setFRequired] = useState(true);
  const [fStep, setFStep] = useState<FormField['step']>('01');
  const [fPlaceholder, setFPlaceholder] = useState('');
  const [fOptionsText, setFOptionsText] = useState(''); // Comma-separated options

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/form-config`);
      const payload = await res.json();
      if (payload.success) {
        setConfigs(payload.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchConfigs();
  }, []);

  const handleAddCategory = () => {
    setEditingId(null);
    setCategoryName('');
    setFields([
      { name: 'fullName', label: 'Name', type: 'text', required: true, step: '01', placeholder: 'Enter your full name' },
      { name: 'departmentId', label: 'Department', type: 'select', required: true, step: '01' },
      { name: 'studentId', label: 'Student ID', type: 'text', required: true, step: '01', placeholder: 'Example: 20230104001' },
      { name: 'semesterId', label: 'Semester', type: 'select', required: true, step: '01' },
      { name: 'phoneNumber', label: 'Phone number', type: 'tel', required: true, step: '01', placeholder: '+8801XXXXXXXXX' },
      { name: 'eduEmail', label: 'Educational email', type: 'email', required: true, step: '01', placeholder: 'your-id@aust.edu' },
      { name: 'personalEmail', label: 'Personal email', type: 'email', required: true, step: '01', placeholder: 'yourname@gmail.com' },
      { name: 'linkedinUrl', label: 'LinkedIn profile', type: 'url', required: false, step: '01', placeholder: 'https://www.linkedin.com/in/your-profile' },
      { name: 'teamId', label: 'Team', type: 'select', required: true, step: '02' }
    ]);
    setSelectedFieldIdx(null);
    setShowModal(true);
  };

  const handleEditCategory = (conf: FormConfig) => {
    setEditingId(conf.id);
    setCategoryName(conf.categoryName);
    setFields(conf.fields || []);
    setSelectedFieldIdx(null);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form configuration?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/form-config/${id}`, {
        method: 'DELETE',
      });
      const payload = await res.json();
      if (payload.success) {
        await fetchConfigs();
      } else {
        alert(payload.error?.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting configuration');
    }
  };

  // Field editing
  const selectField = (idx: number) => {
    if (idx < 0 || idx >= fields.length) return;
    const field = fields[idx];
    if (!field) return;
    setSelectedFieldIdx(idx);
    setFName(field.name || '');
    setFLabel(field.label || '');
    setFType(field.type || 'text');
    setFRequired(!!field.required);
    setFStep(field.step || '01');
    setFPlaceholder(field.placeholder || '');
    setFOptionsText(field.options?.join(', ') || '');
  };

  const saveFieldDetail = () => {
    if (selectedFieldIdx === null) return;
    const updated = [...fields];
    
    // Parse options
    let opts: string[] | undefined = undefined;
    if (['select', 'checkbox', 'radio'].includes(fType)) {
      opts = fOptionsText
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    }

    updated[selectedFieldIdx] = {
      name: fName.trim(),
      label: fLabel.trim(),
      type: fType,
      required: fRequired,
      step: fStep,
      placeholder: fPlaceholder.trim() || undefined,
      options: opts,
    };
    setFields(updated);
    setSelectedFieldIdx(null);
  };

  const addNewField = () => {
    const newField: FormField = {
      name: `customField_${Date.now()}`,
      label: 'New Custom Field',
      type: 'text',
      required: true,
      step: '03',
      placeholder: '',
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    setSelectedFieldIdx(newFields.length - 1);
    setFName(newField.name);
    setFLabel(newField.label);
    setFType(newField.type);
    setFRequired(newField.required);
    setFStep(newField.step);
    setFPlaceholder(newField.placeholder || '');
    setFOptionsText('');
  };

  const deleteField = (idx: number) => {
    const updated = fields.filter((_, i) => i !== idx);
    setFields(updated);
    setSelectedFieldIdx(null);
  };

  const moveField = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === fields.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...fields];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    setFields(updated);
    setSelectedFieldIdx(null);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Category name is required.');
      return;
    }
    
    // Auto-save the currently active field configuration details if open
    let finalFields = [...fields];
    if (selectedFieldIdx !== null) {
      let opts: string[] | undefined = undefined;
      if (['select', 'checkbox', 'radio'].includes(fType)) {
        opts = fOptionsText
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean);
      }
      finalFields[selectedFieldIdx] = {
        name: fName.trim(),
        label: fLabel.trim(),
        type: fType,
        required: fRequired,
        step: fStep,
        placeholder: fPlaceholder.trim() || undefined,
        options: opts,
      };
    }

    if (finalFields.length === 0) {
      alert('Form must contain at least one field.');
      return;
    }

    try {
      setSaving(true);
      const url = editingId
        ? `${API_BASE_URL}/admin/form-config/${editingId}`
        : `${API_BASE_URL}/admin/form-config`;

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: categoryName.trim(),
          fields: finalFields,
        }),
      });

      const payload = await res.json();
      if (payload.success) {
        await fetchConfigs();
        setShowModal(false);
      } else {
        alert(payload.error?.message || 'Failed to save configuration');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    window.open(`${API_BASE_URL}/admin/export-registrations`, '_blank');
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .form-field-item:hover {
          background-color: rgba(255,255,255,0.02) !important;
        }
        .form-field-active {
          border-color: ${t.brandGreen} !important;
          background-color: rgba(46,204,113,0.03) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ color: t.textPrimary, fontSize: 28, fontWeight: 800, margin: 0 }}>Form Configuration Engine</h2>
          <p style={{ color: t.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Configure dynamic fields, manage registration categories, and export records.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleExport} style={s.btnGhost}>
            <FileSpreadsheet size={16} style={{ color: t.brandGreen }} /> Export Excel
          </button>
          <button onClick={handleAddCategory} style={s.btnPrimary}>
            <Plus size={16} /> Create Form Category
          </button>
        </div>
      </div>

      {/* Category List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={32} color={t.brandGreen} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : configs.length === 0 ? (
        <div style={s.empty}>No form categories created yet. Click "Create Form Category" to get started.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {configs.map((conf) => (
            <div key={conf.id} style={s.card}>
              <div style={s.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={18} style={{ color: t.brandGreen }} />
                  <h4 style={{ color: t.textPrimary, fontSize: 16, fontWeight: 700, margin: 0 }}>{conf.categoryName}</h4>
                </div>
                <p style={{ color: t.textSecondary, fontSize: 12, margin: '6px 0 0' }}>
                  Total configured fields: <strong>{conf.fields?.length || 0}</strong>
                </p>
                <p style={{ color: t.textMuted, fontSize: 10, margin: '4px 0 0' }}>
                  Created: {new Date(conf.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={s.cardFooter}>
                <button onClick={() => handleEditCategory(conf)} style={s.btnEdit}>
                  <Edit2 size={12} /> Edit Fields
                </button>
                <button onClick={() => handleDeleteCategory(conf.id)} style={s.btnDanger}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: 900 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${t.brandGreen}, transparent)`, borderRadius: '20px 20px 0 0' }} />
            
            <div style={s.modalHeader}>
              <h3 style={{ color: t.textPrimary, fontSize: 18, fontWeight: 700, margin: 0 }}>
                {editingId ? `Configure: ${categoryName}` : 'Create Form Category'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} style={s.modalBody}>
              {/* Category Name */}
              <div>
                <label style={s.label}>Category Name <span style={{ color: t.brandGreen }}>*</span></label>
                <input
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Sub-Executive, General Member"
                  style={s.inputBase}
                />
              </div>

              {/* Designer Board */}
              <div style={s.divider}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, margin: 0 }}>Fields Structure</h4>
                  <button type="button" onClick={addNewField} style={{ ...s.btnPrimary, padding: '6px 12px', fontSize: 12 }}>
                    <Plus size={14} /> Add Field
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, minHeight: 300 }}>
                  {/* Left Column: List of Fields */}
                  <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${t.borderSubtle}`, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.textMuted }}>
                      Form Fields Order
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: 350, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fields.map((field, idx) => (
                        <div
                          key={field.name + idx}
                          onClick={() => selectField(idx)}
                          className={`form-field-item ${selectedFieldIdx === idx ? 'form-field-active' : ''}`}
                          style={{
                            padding: '8px 10px',
                            border: `1px solid ${t.borderSubtle}`,
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'border-color 0.15s, background 0.15s'
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {field.label || '(Untitled Field)'}
                            </div>
                            <div style={{ fontSize: 9, color: t.textMuted }}>
                              {field.name} • {field.type} • Step {field.step}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={(e) => e.stopPropagation()}>
                            <button type="button" onClick={() => moveField(idx, 'up')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 2 }}>
                              <ChevronUp size={14} />
                            </button>
                            <button type="button" onClick={() => moveField(idx, 'down')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 2 }}>
                              <ChevronDown size={14} />
                            </button>
                            <button type="button" onClick={() => deleteField(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2, marginLeft: 2 }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Active Field Details Form */}
                  <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: 12, padding: 16, backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    {selectedFieldIdx === null ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.textMuted, fontSize: 13 }}>
                        <Settings size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                        Select a field from the list to modify its settings, or add a new field.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.borderSubtle}`, paddingBottom: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: t.brandGreen }}>Configure Field #{selectedFieldIdx + 1}</span>
                          <button type="button" onClick={saveFieldDetail} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: t.brandGreen, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            <CheckCircle size={14} /> Save Config
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={s.label}>Field Label</label>
                            <input value={fLabel} onChange={(e) => setFLabel(e.target.value)} placeholder="e.g. Email Address" style={s.inputBase} />
                          </div>
                          <div>
                            <label style={s.label}>Field Name (Key in Database)</label>
                            <input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="e.g. emailAddress" style={s.inputBase} />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={s.label}>Field Type</label>
                            <select value={fType} onChange={(e) => setFType(e.target.value as FormField['type'])} style={s.inputBase}>
                              <option value="text">Single Line Text</option>
                              <option value="textarea">Multi-line Text (Textarea)</option>
                              <option value="select">Dropdown Select</option>
                              <option value="checkbox">Checkboxes (Multiple choice)</option>
                              <option value="radio">Radio Buttons (Single choice)</option>
                              <option value="email">Email Input</option>
                              <option value="tel">Telephone Input</option>
                              <option value="number">Number Input</option>
                              <option value="url">URL Input</option>
                            </select>
                          </div>
                          <div>
                            <label style={s.label}>Form step placement</label>
                            <select value={fStep} onChange={(e) => setFStep(e.target.value as FormField['step'])} style={s.inputBase}>
                              <option value="01">Step 01 - Personal Info</option>
                              <option value="02">Step 02 - Team Preference</option>
                              <option value="03">Step 03 - Screening Questions</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'center' }}>
                          <div>
                            <label style={s.label}>Placeholder</label>
                            <input value={fPlaceholder} onChange={(e) => setFPlaceholder(e.target.value)} placeholder="e.g. Enter your email" style={s.inputBase} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                            <input type="checkbox" id="field-required-chk" checked={fRequired} onChange={(e) => setFRequired(e.target.checked)} style={{ cursor: 'pointer' }} />
                            <label htmlFor="field-required-chk" style={{ color: t.textPrimary, fontSize: 13, cursor: 'pointer', margin: 0 }}>Required</label>
                          </div>
                        </div>

                        {['select', 'checkbox', 'radio'].includes(fType) && (
                          <div style={{ borderTop: `1px dashed ${t.borderDefault}`, paddingTop: 8 }}>
                            <label style={s.label}>Options list (Comma-separated)</label>
                            <input value={fOptionsText} onChange={(e) => setFOptionsText(e.target.value)} placeholder="e.g. Beginner, Intermediate, Expert" style={s.inputBase} />
                            <span style={{ fontSize: 10, color: t.textMuted, marginTop: 4, display: 'block' }}>Provide options separated by a comma (e.g. Option 1, Option 2).</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div style={s.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnGhost}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.7 : 1 }}>
                  {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : editingId ? 'Update Config' : 'Save Config'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
