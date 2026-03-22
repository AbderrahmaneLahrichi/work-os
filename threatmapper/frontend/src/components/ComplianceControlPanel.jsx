import { useState, useEffect, useCallback } from 'react'

const PRIORITY_COLOR = {
  High:   'bg-red-900/30 text-red-400 border border-red-800',
  Medium: 'bg-orange-900/30 text-orange-400 border border-orange-800',
  Low:    'bg-blue-900/30 text-blue-400 border border-blue-800',
}

const PERSPECTIVE = {
  'Engineering':   { color: '#60a5fa', bg: 'rgba(37,99,180,0.12)',  border: '#1d4ed8',  label: 'code, CLI, config' },
  'Portal/Config': { color: '#a371f7', bg: 'rgba(109,40,217,0.12)', border: '#7c3aed',  label: 'admin console, UI settings' },
  'Policy':        { color: '#3fb950', bg: 'rgba(22,101,52,0.12)',  border: '#15803d',  label: 'documentation, governance' },
}

const PLATFORM_ORDER = ['All', 'AWS', 'Azure', 'GCP', 'Okta', 'Microsoft 365', 'On-Premise', 'Any']

function LoadingDots() {
  return (
    <div className="flex items-center gap-2 py-12 justify-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-[#58a6ff]"
          style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

function AccordionCard({ perspective, steps, frameworkColor }) {
  const [open, setOpen] = useState(true)
  const p = PERSPECTIVE[perspective]
  if (!steps || steps.length === 0) return null

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: p.border + '80' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:brightness-110"
        style={{ backgroundColor: p.bg }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold" style={{ color: p.color }}>{perspective}</span>
          <span className="text-[11px] text-[#8b949e]">— {p.label}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: p.bg, border: `1px solid ${p.border}`, color: p.color }}
          >
            {steps.length}
          </span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ color: p.color, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <ol className="px-4 py-3 space-y-4 bg-[#0d1117]">
          {steps.map((item) => (
            <li key={item.step} className="flex gap-3">
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{ backgroundColor: p.bg, border: `1px solid ${p.border}80`, color: p.color }}
              >
                {item.step}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-[#e6edf3] font-semibold leading-snug">{item.action}</p>
                {item.detail && (
                  <p className="text-[12px] text-[#8b949e] mt-1 leading-relaxed">{item.detail}</p>
                )}
                {item.platform && item.platform !== 'Any' && (
                  <span
                    className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}
                  >
                    {item.platform}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function ComplianceControlPanel({ control, companyName, industry, onClose }) {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState('All')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await window.fetch('/api/compliance-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          framework:           control.framework,
          control_id:          control.id,
          control_name:        control.name,
          control_description: control.description || control.name,
          company_name:        companyName,
          industry,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Error ${res.status}`)
      }
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [control.id, control.framework, companyName])

  useEffect(() => { load() }, [load])

  // Derive which platforms are present in the steps
  const allSteps = data?.implementation_steps || []
  const presentPlatforms = ['All', ...new Set(
    allSteps.map(s => s.platform).filter(Boolean).filter(p => p !== 'Any')
  )].filter(p => PLATFORM_ORDER.includes(p))

  const filteredSteps = selectedPlatform === 'All'
    ? allSteps
    : allSteps.filter(s => s.platform === selectedPlatform || s.platform === 'Any')

  const stepsByPerspective = filteredSteps.reduce((acc, s) => {
    const key = s.perspective || 'Engineering'
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const priorityClass = PRIORITY_COLOR[control.priority] || PRIORITY_COLOR.Low

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div
        className="bg-[#0d1117] rounded-2xl border border-[#30363d] w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl"
        style={{ animation: 'blobIn 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <style>{`@keyframes blobIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363d] bg-[#161b22] rounded-t-2xl shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: '#0d1117',
                    border: `1px solid ${control.framework_color || '#30363d'}`,
                    color: control.framework_color || '#58a6ff',
                  }}
                >
                  {control.id}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${priorityClass}`}>
                  {control.priority}
                </span>
                <span className="text-[11px] text-[#8b949e]">{control.framework}</span>
              </div>
              <h2 className="text-[16px] font-bold text-[#e6edf3] leading-tight">{control.name}</h2>
              {control.description && (
                <p className="text-[12px] text-[#8b949e] mt-1 leading-relaxed">{control.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#30363d] transition-colors shrink-0 text-[#8b949e] hover:text-[#e6edf3]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading && <LoadingDots />}

          {error && (
            <div className="py-6 text-center space-y-2">
              <p className="text-[13px] text-red-400">{error}</p>
              <button onClick={load} className="text-[12px] text-[#58a6ff] hover:underline">Retry</button>
            </div>
          )}

          {data && (
            <>
              {/* What it means */}
              {data.what_it_means && (
                <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d]">
                  <p className="text-[13px] text-[#c9d1d9] leading-relaxed">{data.what_it_means}</p>
                </div>
              )}

              {/* MITRE correlation */}
              {data.mitre_correlation && data.mitre_correlation !== 'null' && (
                <div className="rounded-xl p-3 border flex gap-3 items-start"
                  style={{ backgroundColor: 'rgba(88,166,255,0.07)', borderColor: '#1d4ed8' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#60a5fa] shrink-0 mt-0.5">MITRE</span>
                  <p className="text-[12px] text-[#93c5fd] leading-relaxed">{data.mitre_correlation}</p>
                </div>
              )}

              {/* Platform filter — only show if multiple platforms present */}
              {presentPlatforms.length > 2 && (
                <div className="flex flex-wrap gap-1.5">
                  {presentPlatforms.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className="text-[11px] px-2.5 py-1 rounded-full border transition-colors font-medium"
                      style={selectedPlatform === p
                        ? { backgroundColor: control.framework_color || '#58a6ff', borderColor: control.framework_color || '#58a6ff', color: '#fff' }
                        : { backgroundColor: 'transparent', borderColor: '#30363d', color: '#8b949e' }
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Accordion cards by perspective */}
              <div className="space-y-2">
                {['Engineering', 'Portal/Config', 'Policy'].map(perspective => (
                  <AccordionCard
                    key={perspective}
                    perspective={perspective}
                    steps={stepsByPerspective[perspective]}
                    frameworkColor={control.framework_color}
                  />
                ))}
              </div>

              {/* Tools */}
              {data.tools_and_technologies?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Tools & Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.tools_and_technologies.map((t, i) => (
                      <span key={i}
                        className="text-[11px] px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#60a5fa' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {data.evidence_required?.length > 0 && (
                <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d]">
                  <p className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-2 font-semibold">Audit Evidence Required</p>
                  <ul className="space-y-1.5">
                    {data.evidence_required.map((e, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-[#8b949e]">
                        <span className="text-[#3fb950] shrink-0">✓</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Docs link */}
              {data.docs_url && (
                <a
                  href={data.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[13px] hover:underline pb-2"
                  style={{ color: control.framework_color || '#58a6ff' }}
                >
                  Official {control.framework} Documentation
                  <span className="text-[11px]">↗</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
