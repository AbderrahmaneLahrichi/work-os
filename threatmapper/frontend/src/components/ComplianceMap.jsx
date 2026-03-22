import { useState, useMemo } from 'react'

const PRIORITY_COLOR = {
  High:   { fill: 'rgba(200,30,30,0.85)',   stroke: '#f87171', label: '#fca5a5' },
  Medium: { fill: 'rgba(200,90,20,0.8)',    stroke: '#f97316', label: '#fdba74' },
  Low:    { fill: 'rgba(37,99,180,0.75)',   stroke: '#60a5fa', label: '#93c5fd' },
}

const FRAMEWORK_COLORS = [
  '#58a6ff', '#3fb950', '#f97316', '#a371f7', '#ff7b72', '#79c0ff', '#ffa657',
]

function polarToXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function shortEdge(from, to, fromR, toR) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return ''
  const ux = dx / dist
  const uy = dy / dist
  const sx = from.x + ux * fromR
  const sy = from.y + uy * fromR
  const ex = to.x  - ux * toR
  const ey = to.y  - uy * toR
  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2
  return `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
}

export default function ComplianceMap({ frameworks, companyName, onSelectControl }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [layoutMode, setLayoutMode]   = useState('radial') // 'radial' | 'network'

  const totalControls = useMemo(
    () => frameworks.reduce((sum, f) => sum + (f.controls?.length || 0), 0),
    [frameworks]
  )

  // ── Radial sizing ──────────────────────────────────────────────────────────
  const CENTER_R = 52
  const NODE_R   = Math.max(16, Math.min(22, Math.floor(520 / Math.max(totalControls, 8))))
  const FW_R     = Math.max(30, Math.round(NODE_R * 1.75))
  const INNER_R  = CENTER_R + FW_R + 24
  const minOuter = Math.ceil((totalControls * (NODE_R * 2 + 10)) / (2 * Math.PI))
  const OUTER_R  = Math.max(INNER_R + FW_R + NODE_R + 36, minOuter)
  const PAD      = NODE_R + 50
  const RW = OUTER_R * 2 + PAD * 2
  const RH = OUTER_R * 2 + PAD * 2
  const RCX = RW / 2
  const RCY = RH / 2

  // ── Network / layered sizing ───────────────────────────────────────────────
  const NET_NR   = Math.max(14, Math.min(20, Math.floor(460 / Math.max(totalControls, 8))))
  const NET_FW_R = Math.max(28, Math.round(NET_NR * 1.7))
  const NET_W    = 960
  const colX     = { company: 110, framework: 340, control: 830 }
  const NET_H    = Math.max(500, (totalControls + 2) * (NET_NR * 2 + 12))

  // ── Layout computation ─────────────────────────────────────────────────────
  const radialLayout = useMemo(() => {
    const nodes = [], edges = []
    let ci = 0
    frameworks.forEach((fw, fi) => {
      const fwAngle = (fi / frameworks.length) * 360
      const fwPos   = polarToXY(RCX, RCY, INNER_R, fwAngle)
      const fwId    = `fw-${fi}`
      const color   = FRAMEWORK_COLORS[fi % FRAMEWORK_COLORS.length]
      nodes.push({ id: fwId, type: 'framework', label: fw.name, pos: fwPos, color, fw, count: fw.controls?.length || 0 })
      edges.push({ from: { x: RCX, y: RCY }, to: fwPos, id: `c-${fwId}`, color, fromR: CENTER_R, toR: FW_R })
      ;(fw.controls || []).forEach((ctrl, cj) => {
        const angle  = (ci / totalControls) * 360; ci++
        const ctrlPos = polarToXY(RCX, RCY, OUTER_R, angle)
        const ctrlId  = `ctrl-${fi}-${cj}`
        const pc = PRIORITY_COLOR[ctrl.priority] || PRIORITY_COLOR.Low
        nodes.push({ id: ctrlId, type: 'control', label: ctrl.id, name: ctrl.name, pos: ctrlPos, pc, ctrl, fw, color })
        edges.push({ from: fwPos, to: ctrlPos, id: `${fwId}-${ctrlId}`, color: `${color}50`, fromR: FW_R, toR: NODE_R })
      })
    })
    return { nodes, edges }
  }, [frameworks, totalControls, RCX, RCY])

  const networkLayout = useMemo(() => {
    const nodes = [], edges = []
    const cy = NET_H / 2
    // company node
    nodes.push({ id: 'company', type: 'company', pos: { x: colX.company, y: cy }, label: companyName })

    // framework nodes — evenly spaced vertically
    const fwSpacing = NET_H / (frameworks.length + 1)
    frameworks.forEach((fw, fi) => {
      const color  = FRAMEWORK_COLORS[fi % FRAMEWORK_COLORS.length]
      const fwPos  = { x: colX.framework, y: fwSpacing * (fi + 1) }
      const fwId   = `fw-${fi}`
      nodes.push({ id: fwId, type: 'framework', label: fw.name, pos: fwPos, color, fw, count: fw.controls?.length || 0 })
      edges.push({ from: { x: colX.company, y: cy }, to: fwPos, id: `c-${fwId}`, color, fromR: CENTER_R, toR: NET_FW_R })

      const controls = fw.controls || []
      const ctrlSpacing = NET_H / (totalControls + 1)
      let runningIndex = frameworks.slice(0, fi).reduce((s, f) => s + (f.controls?.length || 0), 0)
      controls.forEach((ctrl, cj) => {
        const ctrlPos = { x: colX.control, y: ctrlSpacing * (runningIndex + cj + 1) }
        const ctrlId  = `ctrl-${fi}-${cj}`
        const pc = PRIORITY_COLOR[ctrl.priority] || PRIORITY_COLOR.Low
        nodes.push({ id: ctrlId, type: 'control', label: ctrl.id, name: ctrl.name, pos: ctrlPos, pc, ctrl, fw, color })
        edges.push({ from: fwPos, to: ctrlPos, id: `${fwId}-${ctrlId}`, color: `${color}50`, fromR: NET_FW_R, toR: NET_NR })
      })
    })
    return { nodes, edges }
  }, [frameworks, totalControls, companyName, NET_H])

  const isRadial = layoutMode === 'radial'
  const layout   = isRadial ? radialLayout : networkLayout
  const W        = isRadial ? RW  : NET_W
  const H        = isRadial ? RH  : NET_H
  const CX       = isRadial ? RCX : colX.company
  const CY       = isRadial ? RCY : NET_H / 2
  const nR       = isRadial ? NODE_R  : NET_NR
  const fwR      = isRadial ? FW_R    : NET_FW_R
  const labelSize = Math.max(8, nR * 0.52)

  const fwNodes   = layout.nodes.filter(n => n.type === 'framework')
  const ctrlNodes = layout.nodes.filter(n => n.type === 'control')

  return (
    <div className="w-full overflow-auto">
      {/* Layout toggle */}
      <div className="flex justify-end pr-2 pb-2 gap-1.5">
        {['radial', 'network'].map(mode => (
          <button
            key={mode}
            onClick={() => setLayoutMode(mode)}
            className="text-[11px] px-2.5 py-1 rounded border transition-colors capitalize"
            style={layoutMode === mode
              ? { backgroundColor: '#58a6ff22', borderColor: '#58a6ff', color: '#58a6ff' }
              : { backgroundColor: 'transparent', borderColor: '#30363d', color: '#8b949e' }
            }
          >
            {mode}
          </button>
        ))}
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '0 auto' }}>

        {/* Edges */}
        {layout.edges.map(e => (
          <path
            key={e.id}
            d={shortEdge(e.from, e.to, e.fromR || 0, e.toR || 0)}
            fill="none" stroke={e.color} strokeWidth="1" opacity="0.35"
          />
        ))}

        {/* Center / company node */}
        <circle cx={CX} cy={CY} r={CENTER_R} fill="#0d1117" stroke="#58a6ff" strokeWidth="2" />
        <text x={CX} y={CY - 8}  textAnchor="middle" fill="#e6edf3" fontSize="12" fontWeight="bold">
          {companyName.length > 13 ? companyName.slice(0, 12) + '…' : companyName}
        </text>
        <text x={CX} y={CY + 7}  textAnchor="middle" fill="#8b949e" fontSize="9">Compliance</text>
        <text x={CX} y={CY + 20} textAnchor="middle" fill="#58a6ff" fontSize="8">{totalControls} controls</text>

        {/* Framework nodes */}
        {fwNodes.map(n => (
          <g key={n.id}>
            <circle cx={n.pos.x} cy={n.pos.y} r={fwR} fill="#161b22" stroke={n.color} strokeWidth="2" />
            <text x={n.pos.x} y={n.pos.y - 4} textAnchor="middle" fill={n.color} fontSize={labelSize + 1} fontWeight="bold">
              {n.label.split(' ')[0]}
            </text>
            <text x={n.pos.x} y={n.pos.y + 9} textAnchor="middle" fill={n.color} fontSize={labelSize - 1}>
              {n.label.split(' ').slice(1).join(' ')}
            </text>
            {!isRadial && (
              <text x={n.pos.x} y={n.pos.y + fwR + 12} textAnchor="middle" fill={n.color} fontSize="7" opacity="0.6">
                {n.count}
              </text>
            )}
          </g>
        ))}

        {/* Control nodes */}
        {ctrlNodes.map(n => {
          const isHovered = hoveredNode === n.id
          const r    = isHovered ? nR + 4 : nR
          const TW   = 200
          const TH   = 82
          const tx   = isRadial
            ? Math.min(Math.max(n.pos.x - TW / 2, 6), W - TW - 6)
            : Math.max(n.pos.x - TW - nR - 10, 6)
          const ty   = isRadial
            ? (n.pos.y > CY ? n.pos.y - TH - r - 6 : n.pos.y + r + 6)
            : n.pos.y - TH / 2
          const desc = n.ctrl.description || ''

          return (
            <g
              key={n.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectControl({ ...n.ctrl, framework: n.fw.name, framework_color: n.color })}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {isHovered && (
                <circle cx={n.pos.x} cy={n.pos.y} r={r + 6} fill="none" stroke={n.pc.stroke} strokeWidth="1.5" opacity="0.2" />
              )}
              <circle cx={n.pos.x} cy={n.pos.y} r={r} fill={n.pc.fill} stroke={n.pc.stroke} strokeWidth={isHovered ? 2.5 : 1.5} />
              <text
                x={n.pos.x} y={n.pos.y + 4}
                textAnchor="middle" fill={n.pc.label} fontSize={labelSize} fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {n.label.length > 9 ? n.label.slice(0, 8) + '…' : n.label}
              </text>

              {isHovered && (
                <g style={{ pointerEvents: 'none' }}>
                  <rect x={tx} y={ty} width={TW} height={TH} rx={5} fill="#0d1117" stroke={n.color} strokeWidth="1.5" />
                  <text x={tx + 10} y={ty + 15} fill={n.color} fontSize="10" fontWeight="bold">{n.ctrl.id}</text>
                  <text x={tx + TW - 10} y={ty + 15} textAnchor="end" fill={n.pc.label} fontSize="9">{n.ctrl.priority}</text>
                  <line x1={tx + 2} y1={ty + 21} x2={tx + TW - 2} y2={ty + 21} stroke={n.color} strokeWidth="0.5" opacity="0.3" />
                  <text x={tx + 10} y={ty + 34} fill="#e6edf3" fontSize="10" fontWeight="600">
                    {n.name?.length > 26 ? n.name.slice(0, 25) + '…' : n.name}
                  </text>
                  <text x={tx + 10} y={ty + 49} fill="#8b949e" fontSize="9">
                    {desc.slice(0, 34)}{desc.length > 34 ? '…' : ''}
                  </text>
                  {desc.length > 34 && (
                    <text x={tx + 10} y={ty + 61} fill="#8b949e" fontSize="9">
                      {desc.slice(34, 66)}{desc.length > 66 ? '…' : ''}
                    </text>
                  )}
                  <text x={tx + TW - 10} y={ty + TH - 8} textAnchor="end" fill="#58a6ff" fontSize="8">
                    Click for steps →
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Network mode: column labels */}
        {!isRadial && (
          <>
            <text x={colX.framework} y={18} textAnchor="middle" fill="#8b949e" fontSize="9" fontWeight="600" letterSpacing="1">FRAMEWORKS</text>
            <text x={colX.control}   y={18} textAnchor="middle" fill="#8b949e" fontSize="9" fontWeight="600" letterSpacing="1">CONTROLS</text>
          </>
        )}
      </svg>

      <div className="flex items-center gap-5 justify-center mt-2 pb-4">
        {Object.entries(PRIORITY_COLOR).map(([level, c]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.fill, border: `1px solid ${c.stroke}` }} />
            <span className="text-[11px] text-[#8b949e]">{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
