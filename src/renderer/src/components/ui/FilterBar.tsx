import React from 'react'
import { Search } from 'lucide-react'
import { TaskFilters } from '../../hooks/useTaskFilters'
import { Priority } from '../../lib/constants'

interface FilterBarProps {
  filters: TaskFilters
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void
  categories: string[]
}

export function FilterBar({ filters, setFilter, categories }: FilterBarProps): React.ReactElement {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 16,
      flexWrap: 'wrap',
      gap: 12
    }}>
      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
        {(['all', 'pending', 'in-progress', 'done'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter('status', status)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: filters.status === status ? 'var(--bg-elevated)' : 'transparent',
              color: filters.status === status ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: filters.status === status ? 600 : 400,
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px 6px 32px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              width: 180,
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          />
        </div>

        {/* Priority Dropdown */}
        <select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value as Priority | 'all')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Priority: All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Category: All</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        {/* Sort Dropdown */}
        <select
          value={filters.sortField}
          onChange={(e) => setFilter('sortField', e.target.value as any)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="createdAt">Sort: Created</option>
        </select>
      </div>
    </div>
  )
}
