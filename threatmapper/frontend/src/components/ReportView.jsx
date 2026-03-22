import { useState, useEffect } from 'react'

function ScoreBadge({ score }) {
  const color =
    score >= 9 ? '#f87171' :
    score >= 7 ? '#f97316' :
    score >= 4 ? '#fbbf24' :
    '#60a5fa'
  const bg =
    score >= 9 ? 'rgba(200,30,30,0.2)' :
    score >= 7 ? 'rgba(200,90,20,0.2)' :
    score >= 4 ? 'rgba(161,128,0,0.2)' :
    'rgba(37,99,180,0.2)'
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
      style={{ color, backgroundColor: bg, border: `1px solid ${color}44` }}
    >
      {score}/10
    </span>
  )
}

function TechniqueCard({ tech }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: '#30363d', backgroundColor: '#0d1117' }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#161b22] transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[11px] font-mono text-[#58a6ff] shrink-0">{tech.id}</span>
          <span className="text-[13px] font-medium text-[#e6edf3] truncate">{tech.name}</span>
          <span className="text-[10px] text-[#8b949e] capitalize shrink-0 hidden sm:inline">{tech.tactic}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <ScoreBadge score={tech.score} />
          <span className="text-[#8b949e] text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#30363d] pt-3">
          <p className="text-[13px] text-[#c9d1d9] leading-relaxed">{tech.context}</p>
          {tech.prevention?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold mb-2">Prevention</p>
              <ul className="space-y-1.5">
                {tech.prevention.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[12px] text-[#8b949e]">
                    <span className="text-[#3fb950] shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-[11px] uppercase tracking-wider font-semibold text-[#8b949e] mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function ReportView({ analysis, onSelectTechnique }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const relevantTechniques = Object.values(analysis.matrix)
    .flatMap((tactic) => tactic.techniques.filter((t) => t.relevance_score > 0))

  async function fetchReport() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: analysis.company_name,
          industry: analysis.industry,
          company_summary: analysis.company_summary,
          relevant_techniques: relevantTechniques,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Error ${res.status}`)
      }
      setReport(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [analysis.company_name])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#58a6ff]"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <p className="text-[13px] text-[#8b949e]">Generating threat report for {analysis.company_name}…</p>
        <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={fetchReport} className="text-[#58a6ff] text-sm hover:underline">
          Retry
        </button>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Executive Summary */}
      <div
        className="rounded-lg p-5 border"
        style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
      >
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#58a6ff] mb-2">Executive Summary</p>
        <p className="text-[14px] text-[#c9d1d9] leading-relaxed">{report.executive_summary}</p>
      </div>

      {/* Attack Narrative */}
      {report.attack_narrative && (
        <Section title="Most Likely Attack Chain">
          <div
            className="rounded-lg p-4 border-l-4"
            style={{ backgroundColor: '#161b22', borderColor: '#f97316', borderLeftWidth: '3px', borderTopWidth: '1px', borderRightWidth: '1px', borderBottomWidth: '1px', borderTopColor: '#30363d', borderRightColor: '#30363d', borderBottomColor: '#30363d' }}
          >
            <p className="text-[13px] text-[#c9d1d9] leading-relaxed">{report.attack_narrative}</p>
          </div>
        </Section>
      )}

      {/* Top Techniques */}
      {report.top_techniques?.length > 0 && (
        <Section title={`Top Techniques (${report.top_techniques.length})`}>
          <div className="space-y-2">
            {report.top_techniques.map((tech) => (
              <TechniqueCard key={tech.id} tech={tech} />
            ))}
          </div>
        </Section>
      )}

      {/* Monitoring Signals */}
      {report.monitoring_signals?.length > 0 && (
        <Section title="Detection & Monitoring">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {report.monitoring_signals.map((cat) => (
              <div
                key={cat.category}
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
              >
                <p className="text-[11px] font-semibold text-[#58a6ff] uppercase tracking-wider mb-2">{cat.category}</p>
                <ul className="space-y-1.5">
                  {cat.signals.map((sig, i) => (
                    <li key={i} className="flex gap-2 text-[12px] text-[#8b949e]">
                      <span className="text-[#58a6ff] shrink-0 mt-0.5">·</span>
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Top Priorities */}
      {report.top_priorities?.length > 0 && (
        <Section title="Priority Roadmap">
          <ol className="space-y-3">
            {report.top_priorities.map((p) => (
              <li
                key={p.rank}
                className="flex gap-4 rounded-lg p-4 border"
                style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold"
                  style={{ backgroundColor: '#1c2333', border: '1px solid #58a6ff', color: '#58a6ff' }}
                >
                  {p.rank}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#e6edf3] mb-1">{p.title}</p>
                  <p className="text-[12px] text-[#8b949e] leading-relaxed">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  )
}
