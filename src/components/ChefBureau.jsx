import { useState } from 'react';
import { useMalus } from '../hooks/useMalus';

const TYPES = ['malus', 'bonus'];
const EXTRAS = ['', 'personnage', 'kart', 'roues', 'maudit'];
const EXTRA_LABELS = { '': 'Aucun', personnage: 'Personnage aléatoire', kart: 'Kart aléatoire', roues: 'Roues aléatoires', maudit: 'Circuit maudit' };

const EMPTY = { texte: '', type: 'malus', extra: '', unique: false };

export default function ChefBureau({ onBack }) {
  const { malus, loading, addMalus, updateMalus, deleteMalus } = useMalus();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY);

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({ texte: item.texte, type: item.type, extra: item.extra || '', unique: item.unique || false });
    setAdding(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function saveEdit() {
    updateMalus(editingId, { texte: editForm.texte, type: editForm.type, extra: editForm.extra, unique: editForm.unique || false });
    setEditingId(null);
    setEditForm(null);
  }

  function handleAdd() {
    if (!newForm.texte.trim()) return;
    addMalus({ texte: newForm.texte.trim(), type: newForm.type, extra: newForm.extra, unique: newForm.unique || false });
    setNewForm(EMPTY);
    setAdding(false);
  }

  const malusList = malus.filter(m => m.type === 'malus');
  const bonusList = malus.filter(m => m.type === 'bonus');

  return (
    <div className="screen chef-bureau-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <div className="chef-header">
        <span className="chef-icon-sm">👨‍💼</span>
        <h2>Bureau du Chef</h2>
      </div>

      <div className="chef-actions">
        <button className="btn btn-primary" onClick={() => { setAdding(true); setEditingId(null); }}>
          + Ajouter un malus/bonus
        </button>
      </div>

      {adding && (
        <div className="chef-form-card">
          <h4>Nouveau malus / bonus</h4>
          <FormFields form={newForm} onChange={setNewForm} />
          <div className="chef-form-btns">
            <button className="btn btn-primary" onClick={handleAdd} disabled={!newForm.texte.trim()}>Ajouter</button>
            <button className="btn btn-secondary" onClick={() => { setAdding(false); setNewForm(EMPTY); }}>Annuler</button>
          </div>
        </div>
      )}

      <Section
        title="🔴 Malus"
        items={malusList}
        editingId={editingId}
        editForm={editForm}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={saveEdit}
        onDelete={deleteMalus}
        onFormChange={setEditForm}
        loading={loading}
      />

      <Section
        title="🟢 Bonus"
        items={bonusList}
        editingId={editingId}
        editForm={editForm}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={saveEdit}
        onDelete={deleteMalus}
        onFormChange={setEditForm}
        loading={loading}
      />
    </div>
  );
}

function Section({ title, items, editingId, editForm, onEdit, onCancel, onSave, onDelete, onFormChange, loading }) {
  return (
    <div className="chef-section">
      <h3 className="chef-section-title">{title} ({items.length})</h3>
      {loading && <p className="empty-msg">Chargement...</p>}
      {!loading && items.length === 0 && <p className="empty-msg">Aucun élément.</p>}
      {items.map(item => (
        <div key={item.id} className={`chef-item ${editingId === item.id ? 'editing' : ''}`}>
          {editingId === item.id ? (
            <div className="chef-edit-inline">
              <FormFields form={editForm} onChange={onFormChange} />
              <div className="chef-form-btns">
                <button className="btn btn-primary btn-sm" onClick={onSave}>✓ Sauvegarder</button>
                <button className="btn btn-secondary btn-sm" onClick={onCancel}>Annuler</button>
              </div>
            </div>
          ) : (
            <div className="chef-item-content">
              <div className="chef-item-text">
                <span className="chef-item-label">
                  {item.texte}
                  {item.unique && <span className="chef-unique-badge">UNIQUE</span>}
                </span>
                {item.extra && <span className="chef-item-extra">→ {EXTRA_LABELS[item.extra]}</span>}
              </div>
              <div className="chef-item-btns">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>✏️</button>
                <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Supprimer ce malus/bonus ?')) onDelete(item.id); }}>✕</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FormFields({ form, onChange }) {
  return (
    <div className="chef-form-fields">
      <div className="field">
        <label>Texte</label>
        <input
          type="text"
          value={form.texte}
          onChange={e => onChange({ ...form, texte: e.target.value })}
          placeholder="Description du malus/bonus..."
        />
      </div>
      <div className="chef-form-row">
        <div className="field">
          <label>Type</label>
          <select value={form.type} onChange={e => onChange({ ...form, type: e.target.value })}>
            {TYPES.map(t => <option key={t} value={t}>{t === 'malus' ? '🔴 Malus' : '🟢 Bonus'}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Extra</label>
          <select value={form.extra || ''} onChange={e => onChange({ ...form, extra: e.target.value })}>
            {EXTRAS.map(e => <option key={e} value={e}>{EXTRA_LABELS[e]}</option>)}
          </select>
        </div>
      </div>
      <label className="chef-unique-label">
        <input
          type="checkbox"
          checked={form.unique || false}
          onChange={e => onChange({ ...form, unique: e.target.checked })}
        />
        <span>Unique par manche (un seul joueur peut recevoir ce malus/bonus par manche)</span>
      </label>
    </div>
  );
}
