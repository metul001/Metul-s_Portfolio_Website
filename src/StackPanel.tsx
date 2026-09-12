import type { Technology } from './TechnologyCard'

type Props = {
  selected: Technology[]
  onRemove: (id: string) => void
  onRemoveAll: () => void
}

export default function StackPanel({ selected, onRemove, onRemoveAll }: Props) {
  return (
    <aside className="stack-panel">
      <h3>Your Stack</h3>
      <p className="selected-count">
        {selected.length} {selected.length === 1 ? 'Technology' : 'Technologies'} Selected
      </p>

      {selected.length === 0 ? (
        <div className="empty-stack">
          <div className="empty-icon">＋</div>
          <strong>Your stack is empty</strong>
          <p>Add technologies to build your ideal stack.</p>
        </div>
      ) : (
        <div className="stack-list">
          {selected.map((technology) => (
            <div className="stack-item" key={technology.id}>
              <img src={technology.icon} alt={`${technology.name} logo`} />
              <div className="stack-item-text">
                <strong>{technology.name}</strong>
                <span>{technology.category}</span>
              </div>
              <button
                onClick={() => onRemove(technology.id)}
                aria-label={`Remove ${technology.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="remove-all"
        onClick={onRemoveAll}
        disabled={selected.length === 0}
      >
        Remove All
      </button>
    </aside>
  )
}
