import { useState, useEffect, useCallback, useRef } from 'react'

const SIEMS = [
  {
    id: 'sentinel',
    name: 'Microsoft Sentinel',
    short: 'Sentinel',
    platform: 'Azure',
    color: '#0078d4',
    description: 'Cloud-native SIEM/SOAR on Azure. Queries use KQL (Kusto Query Language). Deep integration with Microsoft 365, Entra ID, and Defender products.',
    officialRepo: true,
    libraryUrl: (id) => `https://github.com/Azure/Azure-Sentinel/search?q=${id}&type=code`,
    libraryLabel: 'Azure/Azure-Sentinel — Official Detection Rules (GitHub)',
    docsUrl: 'https://learn.microsoft.com/en-us/azure/sentinel/detect-threats-built-in',
    docsLabel: 'Sentinel Built-in Analytics Rules',
  },
  {
    id: 'splunk',
    name: 'Splunk',
    short: 'Splunk',
    platform: 'On-prem / Cloud',
    color: '#65a637',
    description: 'Industry-standard SIEM with SPL (Search Processing Language). Highly customizable with a large marketplace of detection content via Splunk ES.',
    officialRepo: true,
    libraryUrl: (id) => `https://github.com/splunk/security_content/search?q=${id}&type=code`,
    libraryLabel: 'splunk/security_content — Official Splunk Detection Library (GitHub)',
    docsUrl: 'https://research.splunk.com/detections/',
    docsLabel: 'Splunk Threat Research — Detection Portal',
  },
  {
    id: 'elastic',
    name: 'Elastic SIEM',
    short: 'Elastic',
    platform: 'On-prem / Cloud / AWS',
    color: '#f04e98',
    description: 'Open-source-friendly SIEM built on the Elastic Stack. Uses EQL (Event Query Language) for sequence detection and correlation rules.',
    officialRepo: true,
    libraryUrl: (id) => `https://github.com/elastic/detection-rules/search?q=${id}&type=code`,
    libraryLabel: 'elastic/detection-rules — Official Prebuilt Rules (GitHub)',
    docsUrl: 'https://www.elastic.co/guide/en/security/current/prebuilt-rules.html',
    docsLabel: 'Elastic Prebuilt Rules Reference',
  },
  {
    id: 'qradar',
    name: 'IBM QRadar',
    short: 'QRadar',
    platform: 'On-prem / Cloud',
    color: '#be95ff',
    description: 'Enterprise SIEM with AQL (Ariel Query Language). Strong network flow analysis and offense correlation built for large on-prem environments.',
    officialRepo: false,
    noRepoReason: 'IBM does not maintain a public detection rule library for QRadar. Rules are managed inside the product or via IBM X-Force Exchange, which requires an account.',
    docsUrl: 'https://www.ibm.com/docs/en/qsip/7.5?topic=rules-creating-custom',
    docsLabel: 'QRadar Custom Rules Documentation',
  },
  {
    id: 'crowdstrike',
    name: 'CrowdStrike Falcon',
    short: 'Falcon',
    platform: 'Cloud (SaaS)',
    color: '#e3181a',
    description: 'Endpoint-focused XDR/SIEM. Uses Falcon Query Language (FQL) with deep endpoint telemetry. Best-in-class for endpoint detection and threat hunting.',
    officialRepo: false,
    noRepoReason: 'CrowdStrike does not publish a public detection rule repository. Detection logic is managed inside the Falcon console and is proprietary.',
    docsUrl: 'https://falcon.crowdstrike.com/documentation/page/a2a7fc0e/custom-ioa-rule-groups',
    docsLabel: 'Falcon Custom IOA Rules Docs',
  },
  {
    id: 'chronicle',
    name: 'Google Chronicle',
    short: 'Chronicle',
    platform: 'Google Cloud',
    color: '#34a853',
    description: 'Google Cloud SIEM with YARA-L 2.0 for rule writing. Petabyte-scale log retention at flat pricing. Strong UDM (Unified Data Model) normalization.',
    officialRepo: false,
    noRepoReason: 'The GoogleCloudPlatform/security-analytics repo (YARA-L rules) was archived in August 2025 and is no longer maintained.',
    docsUrl: 'https://cloud.google.com/chronicle/docs/detection/yara-l-2-0-overview',
    docsLabel: 'Chronicle YARA-L 2.0 Overview',
  },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[11px] px-2 py-0.5 rounded border transition-colors"
      style={{
        borderColor: copied ? '#3fb950' : '#30363d',
        color: copied ? '#3fb950' : '#8b949e',
        backgroundColor: '#0d1117',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-8 justify-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#58a6ff] opacity-60"
          style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )
}

function SiemGuidanceView({ technique, siemId, siemMeta }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGuidance = useCallback(async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch('/api/siem-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technique_id: technique.id,
          technique_name: technique.name,
          technique_description: technique.description || technique.what_to_detect || technique.name,
          siem: siemId,
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
  }, [technique.id, siemId])

  useEffect(() => {
    fetchGuidance()
  }, [fetchGuidance])

  if (loading) return <LoadingDots />

  if (error) return (
    <div className="py-4 text-center space-y-2">
      <p className="text-[12px] text-red-400">{error}</p>
      <button
        onClick={fetchGuidance}
        className="text-[11px] text-[#58a6ff] hover:underline"
      >
        Retry
      </button>
    </div>
  )

  if (!data) return null

  const isPortal = data.mode === 'portal'

  return (
    <div className="space-y-4">
      {/* AI-generated warning for platforms without official repos */}
      {siemMeta && !siemMeta.officialRepo && !isPortal && (
        <div
          className="rounded p-2.5 text-[11px]"
          style={{ backgroundColor: 'rgba(200,90,20,0.08)', border: '1px solid rgba(200,90,20,0.3)', color: '#f97316' }}
        >
          ⚠ No official query library exists for {siemMeta.name}. Query is AI-generated — validate before production use.
        </div>
      )}

      {isPortal ? (
        /* Portal-based: numbered steps */
        <>
          <div
            className="rounded p-2.5 text-[11px]"
            style={{ backgroundColor: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.3)', color: '#58a6ff' }}
          >
            {siemMeta?.name} uses a UI-driven rule builder — no standalone query language. Follow the steps below in the console.
          </div>
          {data.portal_steps?.length > 0 && (
            <ol className="space-y-3">
              {data.portal_steps.map((item) => (
                <li key={item.step} className="flex gap-2.5">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ backgroundColor: '#1c2333', border: '1px solid #58a6ff', color: '#58a6ff' }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <p className="text-[12px] text-[#e6edf3] font-medium leading-tight">{item.title}</p>
                    {item.detail && (
                      <p className="text-[11px] text-[#8b949e] mt-0.5 leading-relaxed">{item.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        /* Query-based: detection query + checklist */
        <>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold">
                Detection Query {data.query_language && <span className="normal-case font-normal">({data.query_language})</span>}
              </h4>
              <CopyButton text={data.detection_query} />
            </div>
            <pre
              className="text-[11px] leading-relaxed rounded p-3 overflow-x-auto"
              style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            >
              {data.detection_query}
            </pre>
            {data.query_notes && (
              <p className="text-[11px] text-[#8b949e] mt-1.5 leading-relaxed">{data.query_notes}</p>
            )}
          </div>

          {data.implementation_checklist?.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-2 font-semibold">Implementation Checklist</h4>
              <ol className="space-y-2.5">
                {data.implementation_checklist.map((item) => (
                  <li key={item.step} className="flex gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ backgroundColor: '#1c2333', border: '1px solid #30363d', color: '#58a6ff' }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="text-[12px] text-[#e6edf3] font-medium leading-tight">{item.action}</p>
                      {item.detail && (
                        <p className="text-[11px] text-[#8b949e] mt-0.5 leading-relaxed">{item.detail}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {/* Data Sources Required — shown for both modes */}
      {data.data_sources_required?.length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Data Sources Required</h4>
          <div className="flex flex-wrap gap-1">
            {data.data_sources_required.map((ds, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded"
                style={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}
              >
                {ds}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Library + Docs Links */}
      {siemMeta && (
        <div className="pt-2 border-t border-[#30363d] space-y-2">
          {siemMeta.officialRepo ? (
            <a
              href={siemMeta.libraryUrl(technique.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] font-medium hover:underline"
              style={{ color: siemMeta.color }}
            >
              {siemMeta.libraryLabel}
              <span className="text-[11px]">↗</span>
            </a>
          ) : (
            <div
              className="rounded p-3 text-[11px] leading-relaxed"
              style={{ backgroundColor: 'rgba(200,90,20,0.1)', border: '1px solid rgba(200,90,20,0.4)', color: '#fbbf24' }}
            >
              <span className="font-semibold block mb-1">No official public detection library</span>
              {siemMeta.noRepoReason} The query above is AI-generated — review carefully before using in production.
            </div>
          )}
          <a
            href={siemMeta.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-[#8b949e] hover:text-[#e6edf3] hover:underline"
          >
            {siemMeta.docsLabel}
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default function TechniquePanel({ technique, onClose }) {
  const score = technique.relevance_score || 0
  // Auto-select Sentinel for relevant techniques so queries load immediately
  const [selectedSiem, setSelectedSiem] = useState(score > 0 ? 'sentinel' : null)
  const siemSectionRef = useRef(null)

  // Scroll to SIEM section automatically for relevant techniques
  useEffect(() => {
    if (score > 0 && siemSectionRef.current) {
      setTimeout(() => {
        siemSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [technique.id])

  function getScoreBadgeColor(s) {
    if (s === 0) return 'bg-[#21262d] text-[#8b949e]'
    if (s <= 3) return 'bg-[rgba(37,99,180,0.3)] text-[#60a5fa]'
    if (s <= 6) return 'bg-[rgba(161,128,0,0.3)] text-[#fbbf24]'
    if (s <= 8) return 'bg-[rgba(200,90,20,0.3)] text-[#f97316]'
    return 'bg-[rgba(200,30,30,0.3)] text-[#f87171]'
  }

  function getScoreLabel(s) {
    if (s === 0) return 'Not Flagged'
    if (s <= 3) return 'Low'
    if (s <= 6) return 'Medium'
    if (s <= 8) return 'High'
    return 'Critical'
  }

  const tactics = technique.tactics || []
  const tools = technique.tools || []
  const dataSources = technique.data_sources || []
  const selectedSiemMeta = SIEMS.find((s) => s.id === selectedSiem)

  return (
    <div
      className="absolute inset-y-0 right-0 w-[420px] bg-[#161b22] border-l border-[#30363d] flex flex-col z-50 shadow-2xl"
      style={{ animation: 'slideIn 0.2s ease-out' }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-[#30363d] shrink-0">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-mono bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-2 py-0.5 rounded shrink-0">
              {technique.id}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getScoreBadgeColor(score)}`}>
              {getScoreLabel(score)}{score > 0 ? ` (${score}/10)` : ''}
            </span>
          </div>
          <h2 className="text-sm font-semibold text-[#e6edf3] leading-tight">{technique.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#30363d] transition-colors shrink-0 text-[#8b949e] hover:text-[#e6edf3]"
          aria-label="Close panel"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Tactics */}
        {tactics.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Tactic</h3>
            <div className="flex flex-wrap gap-1">
              {tactics.map((tactic) => (
                <span
                  key={tactic}
                  className="text-[11px] bg-[#0d1117] border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded capitalize"
                >
                  {tactic.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Why Relevant */}
        {technique.why_relevant && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Why Relevant</h3>
            <p className="text-[13px] text-[#e6edf3] leading-relaxed">{technique.why_relevant}</p>
          </div>
        )}

        {/* What to Detect */}
        {technique.what_to_detect && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">What to Detect</h3>
            <p className="text-[13px] text-[#e6edf3] leading-relaxed">{technique.what_to_detect}</p>
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Tools to Implement</h3>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-[#1f2937] border border-[#374151] text-[#60a5fa] px-2 py-0.5 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* MITRE Detection Guidance */}
        {technique.detection && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">MITRE Detection Guidance</h3>
            <p className="text-[12px] text-[#8b949e] leading-relaxed">{technique.detection}</p>
          </div>
        )}

        {/* Description */}
        {technique.description && !technique.why_relevant && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Description</h3>
            <p className="text-[12px] text-[#8b949e] leading-relaxed">{technique.description}</p>
          </div>
        )}

        {/* Platforms */}
        {technique.platforms?.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1.5 font-semibold">Platforms</h3>
            <div className="flex flex-wrap gap-1">
              {technique.platforms.map((p) => (
                <span key={p} className="text-[11px] bg-[#0d1117] border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SIEM Detection Guidance */}
        <div className="border-t border-[#30363d] pt-4" ref={siemSectionRef}>
          <h3 className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-2 font-semibold">SIEM Detection Guidance</h3>
          <p className="text-[11px] text-[#8b949e] mb-3">Select your SIEM platform to get a detection query and implementation checklist.</p>

          {/* SIEM Selector Grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {SIEMS.map((siem) => (
              <button
                key={siem.id}
                onClick={() => setSelectedSiem(selectedSiem === siem.id ? null : siem.id)}
                className="text-left rounded px-2.5 py-2 transition-all"
                style={{
                  backgroundColor: selectedSiem === siem.id ? `${siem.color}22` : '#0d1117',
                  border: `1px solid ${selectedSiem === siem.id ? siem.color : '#30363d'}`,
                }}
              >
                <div className="text-[12px] font-semibold" style={{ color: selectedSiem === siem.id ? siem.color : '#e6edf3' }}>
                  {siem.short}
                </div>
                <div className="text-[10px] text-[#8b949e] mt-0.5">{siem.platform}</div>
              </button>
            ))}
          </div>

          {/* SIEM Description */}
          {selectedSiemMeta && (
            <div
              className="rounded p-3 mb-4 space-y-2"
              style={{ backgroundColor: '#0d1117', border: `1px solid ${selectedSiemMeta.color}33` }}
            >
              <p className="text-[11px] text-[#8b949e] leading-relaxed">
                <span className="font-semibold" style={{ color: selectedSiemMeta.color }}>{selectedSiemMeta.name}</span>
                {' — '}{selectedSiemMeta.description}
              </p>
              <a
                href={selectedSiemMeta.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[12px] font-medium hover:underline"
                style={{ color: selectedSiemMeta.color }}
              >
                {selectedSiemMeta.docsLabel}
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          )}

          {/* SIEM Guidance Content */}
          {selectedSiem && (
            <SiemGuidanceView
              key={`${technique.id}-${selectedSiem}`}
              technique={technique}
              siemId={selectedSiem}
              siemMeta={selectedSiemMeta}
            />
          )}
        </div>

        {/* Links */}
        <div className="pt-2 border-t border-[#30363d] space-y-2">
          {technique.url && (
            <a
              href={technique.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#58a6ff] hover:underline"
            >
              View on MITRE ATT&CK
              <span className="text-[11px]">↗</span>
            </a>
          )}
          {technique.microsoft_docs_url && (
            <a
              href={technique.microsoft_docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#58a6ff] hover:underline"
            >
              Microsoft Docs
              <span className="text-[11px]">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
