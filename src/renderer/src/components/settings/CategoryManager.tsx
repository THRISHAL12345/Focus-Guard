import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { useTaskStore } from '../../store/useTaskStore'

export function CategoryManager(): React.ReactElement {
  const categories = useTaskStore(s => s.categories)
  const addCategory = useTaskStore(s => s.addCategory)
  const updateCategory = useTaskStore(s => s.updateCategory)
  const deleteCategory = useTaskStore(s => s.deleteCategory)

  const [newCat, setNewCat] = useState('')
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      addCategory(newCat.trim())
      setNewCat('')
    }
  }

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat)
    setEditValue(cat)
  }

  const handleSaveEdit = () => {
    if (editingCat && editValue.trim() && editValue.trim() !== editingCat && !categories.includes(editValue.trim())) {
      updateCategory(editingCat, editValue.trim())
    }
    setEditingCat(null)
  }

  const handleDelete = (cat: string) => {
    if (categories.length > 1) { // Prevent deleting all categories
      deleteCategory(cat)
    }
  }

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    outline: 'none',
    width: '100%'
  }

  const iconBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* List */}
      {categories.map(cat => (
        <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          {editingCat === cat ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <input
                type="text"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
              />
              <button onClick={handleSaveEdit} style={{ ...iconBtnStyle, color: 'var(--done)' }}><Check size={14} /></button>
              <button onClick={() => setEditingCat(null)} style={{ ...iconBtnStyle, color: 'var(--text-muted)' }}><X size={14} /></button>
            </div>
          ) : (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>{cat}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => handleStartEdit(cat)} style={iconBtnStyle} title="Edit"><Edit2 size={14} /></button>
                <button 
                  onClick={() => handleDelete(cat)} 
                  style={{ ...iconBtnStyle, opacity: categories.length > 1 ? 1 : 0.3 }} 
                  disabled={categories.length <= 1}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add New */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <input
          type="text"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder="New Category..."
          style={{ ...inputStyle, flex: 1 }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button 
          onClick={handleAdd}
          disabled={!newCat.trim() || categories.includes(newCat.trim())}
          style={{
            padding: '6px 12px',
            background: 'var(--accent)',
            border: 'none',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            cursor: newCat.trim() ? 'pointer' : 'not-allowed',
            opacity: newCat.trim() ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Plus size={14} /> ADD
        </button>
      </div>
    </div>
  )
}
