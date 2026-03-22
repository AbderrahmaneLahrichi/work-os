const SCORE_COLORS = {
  low:      { bg: 'rgba(37, 99, 180, 0.8)',   border: '#3b82f6', text: '#93c5fd' },
  medium:   { bg: 'rgba(161, 128, 0, 0.85)',  border: '#f59e0b', text: '#fde68a' },
  high:     { bg: 'rgba(200, 90, 20, 0.9)',   border: '#f97316', text: '#fed7aa' },
  critical: { bg: 'rgba(200, 30, 30, 0.95)',  border: '#ef4444', text: '#fecaca' },
}

const SCORE_LABELS = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }

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

// Layout constants
const ROOT_X = 24
const ROOT_W = 148
const ROOT_H = 52
const COL_GAP = 70
const TACTIC_X = ROOT_X + ROOT_W + COL_GAP
const TACTIC_W = 130
const TACTIC_H = 40
const TECH_X = TACTIC_X + TACTIC_W + COL_GAP
const TECH_W = 168
const TECH_H = 58
const TECH_SPACING = 10
const GROUP_GAP = 28
const MARGIN_Y = 32

function bezierH(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
}

export default function AttackTree3D({ matrix, tacticOrder, companyName, onSelectTechnique, selectedTechnique }) {
  const activeTactics = tacticOrder
    .filter((id) => matrix[id] && matrix[id].techniques.some((t) => t.relevance_score > 0))
    .map((id) => ({
      id,
      name: matrix[id].name,
      techniques: matrix[id].techniques
        .filter((t) => t.relevance_score > 0)
        .sort((a, b) => b.relevance_score - a.relevance_score),
    }))

  // Calculate y positions for each tactic group
  let currentY = MARGIN_Y
  const layout = activeTactics.map((tactic) => {
    const groupH = tactic.techniques.length * (TECH_H + TECH_SPACING) - TECH_SPACING
    const tacticY = currentY + groupH / 2 - TACTIC_H / 2

    const techniques = tactic.techniques.map((tech, i) => ({
      ...tech,
      layoutY: currentY + i * (TECH_H + TECH_SPACING),
      tier: getScoreTier(tech.relevance_score),
    }))

    currentY += groupH + GROUP_GAP
    return { ...tactic, tacticY, techniques }
  })

  const canvasH = Math.max(currentY - GROUP_GAP + MARGIN_Y, ROOT_H + MARGIN_Y * 2)
  const rootY = canvasH / 2 - ROOT_H / 2
  const canvasW = TECH_X + TECH_W + 24

  return (
    <div style={{ width: '100%', overflowY: 'auto', overflowX: 'auto', padding: '8px 0' }}>
      <svg
        width={canvasW}
        height={canvasH}
        style={{ display: 'block' }}
      >
        {/* Root → Tactic paths */}
        {layout.map((tactic) => (
          <path
            key={`r-${tactic.id}`}
            d={bezierH(
              ROOT_X + ROOT_W, rootY + ROOT_H / 2,
              TACTIC_X, tactic.tacticY + TACTIC_H / 2
            )}
            fill="none"
            stroke="rgba(88,166,255,0.3)"
            strokeWidth={1.5}
          />
        ))}

        {/* Tactic → Technique paths */}
        {layout.map((tactic) =>
          tactic.techniques.map((tech) => {
            const c = SCORE_COLORS[tech.tier]
            return (
              <path
                key={`${tactic.id}-${tech.id}`}
                d={bezierH(
                  TACTIC_X + TACTIC_W, tactic.tacticY + TACTIC_H / 2,
                  TECH_X, tech.layoutY + TECH_H / 2
                )}
                fill="none"
                stroke={c.border}
                strokeWidth={1}
                strokeOpacity={0.35}
              />
            )
          })
        )}

        {/* Root node */}
        <rect x={ROOT_X} y={rootY} width={ROOT_W} height={ROOT_H} rx={7}
          fill="#1c2333" stroke="#58a6ff" strokeWidth={1.5} />
        <text x={ROOT_X + ROOT_W / 2} y={rootY + 18}
          textAnchor="middle" fill="#58a6ff" fontSize={9}
          fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.08em">
          ATTACK PROFILE
        </text>
        <text x={ROOT_X + ROOT_W / 2} y={rootY + 35}
          textAnchor="middle" fill="#e6edf3" fontSize={12}
          fontFamily="sans-serif" fontWeight="600">
          {truncate(companyName, 14)}
        </text>

        {/* Tactic nodes */}
        {layout.map((tactic) => (
          <g key={tactic.id}>
            <rect x={TACTIC_X} y={tactic.tacticY} width={TACTIC_W} height={TACTIC_H} rx={6}
              fill="#161b22" stroke="#30363d" strokeWidth={1} />
            <text x={TACTIC_X + TACTIC_W / 2} y={tactic.tacticY + TACTIC_H / 2 + 4}
              textAnchor="middle" fill="#8b949e" fontSize={10}
              fontWeight="700" fontFamily="sans-serif">
              {tactic.name}
            </text>
          </g>
        ))}

        {/* Technique nodes */}
        {layout.map((tactic) =>
          tactic.techniques.map((tech) => {
            const c = SCORE_COLORS[tech.tier]
            const isSelected = selectedTechnique?.id === tech.id
            return (
              <g key={tech.id} onClick={() => onSelectTechnique(tech)} style={{ cursor: 'pointer' }}>
                {/* Node background */}
                <rect
                  x={TECH_X} y={tech.layoutY}
                  width={TECH_W} height={TECH_H} rx={6}
                  fill={c.bg}
                  stroke={isSelected ? '#ffffff' : c.border}
                  strokeWidth={isSelected ? 2 : 1}
                />
                {/* Hover highlight layer (always rendered, controlled via CSS) */}
                <rect
                  x={TECH_X} y={tech.layoutY}
                  width={TECH_W} height={TECH_H} rx={6}
                  fill="transparent"
                  stroke="transparent"
                  className="tech-hover-overlay"
                />
                {/* Score badge */}
                <rect x={TECH_X + TECH_W - 28} y={tech.layoutY + 6} width={22} height={16} rx={3}
                  fill="rgba(0,0,0,0.4)" />
                <text
                  x={TECH_X + TECH_W - 17} y={tech.layoutY + 17}
                  textAnchor="middle" fill={c.text} fontSize={10}
                  fontWeight="bold" fontFamily="monospace">
                  {tech.relevance_score}
                </text>
                {/* Technique ID */}
                <text x={TECH_X + 10} y={tech.layoutY + 20}
                  fill={c.text} fontSize={10} fontFamily="monospace" fontWeight="600">
                  {tech.id}
                </text>
                {/* Technique name */}
                <text x={TECH_X + 10} y={tech.layoutY + 38}
                  fill="#e6edf3" fontSize={12} fontFamily="sans-serif">
                  {truncate(tech.name, 20)}
                </text>
                {/* Score label */}
                <text x={TECH_X + 10} y={tech.layoutY + 52}
                  fill={c.text} fontSize={9} fontFamily="sans-serif" opacity={0.8}>
                  {SCORE_LABELS[tech.tier]}
                </text>
              </g>
            )
          })
        )}
      </svg>
    </div>
  )
}
