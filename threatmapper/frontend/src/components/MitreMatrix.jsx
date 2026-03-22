import { useState } from 'react'
import AttackTree3D from './AttackTree3D'

const TACTIC_ORDER = [
  'reconnaissance',
  'resource-development',
  'initial-access',
  'execution',
  'persistence',
  'privilege-escalation',
  'defense-evasion',
  'credential-access',
  'discovery',
  'lateral-movement',
  'collection',
  'command-and-control',
  'exfiltration',
  'impact',
]

const SCORE_COLORS = {
  low:      { bg: 'rgba(37, 99, 180, 0.75)',  border: 'rgba(37, 99, 180, 0.5)',  label: '#60a5fa' },
  medium:   { bg: 'rgba(161, 128, 0, 0.85)',  border: 'rgba(161, 128, 0, 0.6)',  label: '#fbbf24' },
  high:     { bg: 'rgba(200, 90, 20, 0.9)',   border: 'rgba(200, 90, 20, 0.7)',  label: '#f97316' },
  critical: { bg: 'rgba(200, 30, 30, 0.95)',  border: 'rgba(200, 30, 30, 0.8)',  label: '#f87171' },
}

function getScoreClass(score) {
  if (score === 0) return ''
  if (score <= 3) return 'score-low'
  if (score <= 6) return 'score-medium'
  if (score <= 8) return 'score-high'
  return 'score-critical'
}

function getScoreTier(score) {
  if (score <= 3) return 'low'
  if (score <= 6) return 'medium'
  if (score <= 8) return 'high'
  return 'critical'
}

function truncate(str, max) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

function TechniqueCell({ technique, isSelected, onClick }) {
  const scoreClass = getScoreClass(technique.relevance_score)
  const isRelevant = technique.relevance_score > 0
  return (
    <div
      className={`matrix-cell ${scoreClass} ${isSelected ? 'ring-1 ring-white' : ''}`}
      onClick={() => onClick(technique)}
      title={`${technique.id}: ${technique.name}${isRelevant ? ` (Score: ${technique.relevance_score})` : ''}`}
    >
      <span className="text-[10px] text-text-secondary font-mono leading-tight block">
        {technique.id}
        {isRelevant && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80 align-middle" />}
      </span>
      <span className="text-[11px] text-text-primary leading-tight block mt-0.5">
        {truncate(technique.name, 20)}
      </span>
    </div>
  )
}

function AttackTreeView({ matrix, orderedTactics, selectedTechnique, onSelectTechnique }) {
  const activeTactics = orderedTactics
    .map((id) => ({ id, ...matrix[id] }))
    .filter((t) => t.techniques.some((x) => x.relevance_score > 0))
    .map((t) => ({
      ...t,
      techniques: t.techniques
        .filter((x) => x.relevance_score > 0)
        .sort((a, b) => b.relevance_score - a.relevance_score),
    }))

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-start gap-0" style={{ minWidth: `${activeTactics.length * 200}px` }}>
        {activeTactics.map((tactic, tacticIdx) => {
          const isLast = tacticIdx === activeTactics.length - 1
          return (
            <div key={tactic.id} className="flex items-start" style={{ flexShrink: 0 }}>
              {/* Tactic + techniques column */}
              <div style={{ width: '180px' }}>
                {/* Tactic node */}
                <div
                  className="rounded-md px-3 py-2 mb-2 text-center border"
                  style={{
                    backgroundColor: '#1c2333',
                    borderColor: '#58a6ff',
                    boxShadow: '0 0 8px rgba(88,166,255,0.2)',
                  }}
                >
                  <div className="text-[10px] font-bold text-accent uppercase tracking-wider leading-tight">
                    {tactic.name}
                  </div>
                  <div className="text-[9px] text-text-secondary mt-0.5">
                    {tactic.techniques.length} technique{tactic.techniques.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Vertical line from tactic down */}
                <div className="flex justify-center mb-1">
                  <div style={{ width: '1px', height: '8px', backgroundColor: '#30363d' }} />
                </div>

                {/* Technique nodes */}
                <div className="flex flex-col gap-1.5">
                  {tactic.techniques.map((technique, techIdx) => {
                    const tier = getScoreTier(technique.relevance_score)
                    const colors = SCORE_COLORS[tier]
                    const isSelected = selectedTechnique?.id === technique.id
                    const isLastTech = techIdx === tactic.techniques.length - 1

                    return (
                      <div key={technique.id} className="flex flex-col items-center">
                        {/* Connecting line */}
                        <div style={{ width: '1px', height: '6px', backgroundColor: colors.label, opacity: 0.4 }} />

                        {/* Technique node */}
                        <div
                          onClick={() => onSelectTechnique(technique)}
                          className={`w-full rounded cursor-pointer transition-all hover:brightness-125 ${isSelected ? 'ring-1 ring-white' : ''}`}
                          style={{
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            padding: '5px 8px',
                          }}
                          title={`${technique.id}: ${technique.name} — Score ${technique.relevance_score}/10`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/70">{technique.id}</span>
                            <span
                              className="text-[9px] font-bold rounded px-1"
                              style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: colors.label }}
                            >
                              {technique.relevance_score}
                            </span>
                          </div>
                          <div className="text-[11px] text-white font-medium leading-tight mt-0.5">
                            {truncate(technique.name, 22)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Horizontal connector arrow between tactics */}
              {!isLast && (
                <div className="flex items-start pt-4 px-1" style={{ width: '20px', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '1px', backgroundColor: '#30363d', marginTop: '10px', position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      right: '-4px',
                      top: '-5px',
                      color: '#30363d',
                      fontSize: '10px',
                      lineHeight: 1,
                    }}>▶</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MitreMatrix({ matrix, companyName, onSelectTechnique, selectedTechnique }) {
  const [filteredView, setFilteredView] = useState(false)

  const orderedTactics = TACTIC_ORDER.filter((t) => matrix[t])

  const relevantCount = orderedTactics.reduce((acc, tacticId) => {
    return acc + matrix[tacticId].techniques.filter((t) => t.relevance_score > 0).length
  }, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {filteredView ? 'Attack Chain — Relevant Techniques' : 'ATT&CK Enterprise Matrix'}
        </h2>
        <div className="flex items-center gap-4">
          {/* Legend */}
          {!filteredView && (
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--cell-low)' }} />
                Low
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--cell-medium)' }} />
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--cell-high)' }} />
                High
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--cell-critical)' }} />
                Critical
              </span>
            </div>
          )}

          <button
            onClick={() => setFilteredView((v) => !v)}
            className="text-xs font-medium px-2.5 py-1 rounded border transition-all"
            style={{
              backgroundColor: filteredView ? '#58a6ff' : 'transparent',
              borderColor: '#58a6ff',
              color: filteredView ? '#0d1117' : '#58a6ff',
            }}
          >
            {filteredView ? '← Full Matrix' : `${relevantCount} relevant ↓`}
          </button>
        </div>
      </div>

      {filteredView ? (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          <AttackTree3D
            matrix={matrix}
            tacticOrder={TACTIC_ORDER}
            companyName={companyName || 'Attack Profile'}
            onSelectTechnique={onSelectTechnique}
            selectedTechnique={selectedTechnique}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-1" style={{ minWidth: `${orderedTactics.length * 134}px` }}>
            {orderedTactics.map((tacticId) => {
              const tactic = matrix[tacticId]
              return (
                <div key={tacticId} style={{ width: '130px', flexShrink: 0 }}>
                  <div className="bg-surface border border-border rounded-t px-2 py-1.5 mb-1 text-center">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wide leading-tight block">
                      {tactic.name}
                    </span>
                    <span className="text-[9px] text-text-secondary">
                      {tactic.techniques.filter((t) => t.relevance_score > 0).length}/{tactic.techniques.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {tactic.techniques.map((technique) => (
                      <TechniqueCell
                        key={technique.id}
                        technique={technique}
                        isSelected={selectedTechnique?.id === technique.id}
                        onClick={onSelectTechnique}
                      />
                    ))}
                    {tactic.techniques.length === 0 && (
                      <div className="matrix-cell opacity-30">
                        <span className="text-[10px] text-text-secondary">No techniques</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
