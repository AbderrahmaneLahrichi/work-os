import { useState, useEffect, useCallback, useRef } from 'react'
import CompanySearch from './components/CompanySearch'
import LoadingState from './components/LoadingState'
import MitreMatrix from './components/MitreMatrix'
import TechniquePanel from './components/TechniquePanel'
import ComplianceSidebar from './components/ComplianceSidebar'
import ComplianceMap from './components/ComplianceMap'
import ComplianceControlPanel from './components/ComplianceControlPanel'
import ImplementationChecklist from './components/ImplementationChecklist'

export default function App() {
  const [phase, setPhase] = useState('search')
  const [analysis, setAnalysis] = useState(null)
  const [selectedTechnique, setSelectedTechnique] = useState(null)
  const [selectedControl, setSelectedControl] = useState(null)
  const [error, setError] = useState(null)
  const [loadingCompany, setLoadingCompany] = useState('')
  const [sidebarTab, setSidebarTab] = useState('compliance')
  const [complianceView, setComplianceView] = useState('list')
  const [theme, setTheme] = useState('dark')


  // Warm server cache for compliance control on hover — by the time user clicks, it's ready
  const prefetchControl = useCallback((control) => {
    if (!analysis) return
    fetch('/api/compliance-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        framework:           control.framework,
        control_id:          control.id,
        control_name:        control.name,
        control_description: control.description || control.name,
        company_name:        analysis.company_name,
        industry:            analysis.industry,
      }),
    }).catch(() => {})
  }, [analysis])

  // On results load, prefetch Sentinel guidance for the top-scored techniques
  useEffect(() => {
    if (!analysis) return
    const top = Object.values(analysis.matrix)
      .flatMap(t => t.techniques)
      .filter(t => t.relevance_score >= 7)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 6)

    top.forEach(t => {
      fetch('/api/siem-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technique_id:          t.id,
          technique_name:        t.name,
          technique_description: t.description || t.name,
          siem:                  'sentinel',
        }),
      }).catch(() => {})
    })
  }, [analysis])

  async function handleAnalyze(companyName) {
    setLoadingCompany(companyName)
    setError(null)
    setPhase('loading')
    setSelectedTechnique(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setAnalysis(data)
      setPhase('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('search')
    }
  }

  function handleNewSearch() {
    setPhase('search')
    setAnalysis(null)
    setSelectedTechnique(null)
    setError(null)
  }

  const relevantCount = analysis
    ? Object.values(analysis.matrix).reduce((acc, tactic) => {
        return acc + tactic.techniques.filter((t) => t.relevance_score > 0).length
      }, 0)
    : 0

  return (
    <div
      className="min-h-screen bg-background text-text-primary flex flex-col"
      style={theme === 'light' ? { filter: 'invert(1) hue-rotate(180deg) contrast(1.15) brightness(1.02)' } : {}}
    >
      {/* Navigation */}
      <nav className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between shrink-0 relative z-[60]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewSearch}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl">🛡️</span>
            <span className="text-lg font-semibold text-text-primary tracking-tight">ThreatMapper</span>
          </button>
          {phase === 'results' && analysis && (
            <span className="text-text-secondary text-sm ml-2">
              / {analysis.company_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {phase === 'results' && (
            <>
              <span className="text-text-secondary text-sm">
                {relevantCount} relevant techniques identified
              </span>
              <button
                onClick={handleNewSearch}
                className="bg-surface border border-border text-text-primary text-sm px-4 py-1.5 rounded hover:border-accent hover:text-accent transition-colors"
              >
                New Search
              </button>
            </>
          )}
          {/* Light / dark toggle — counter-inverted so it always renders correctly */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-5 rounded-full border relative flex items-center px-0.5 shrink-0"
            style={{
              backgroundColor: '#58a6ff',
              borderColor: '#58a6ff',
              filter: theme === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none',
            }}
          >
            <span
              className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: theme === 'light' ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </nav>

      {/* Main content */}
      {phase === 'search' && (
        <CompanySearch onAnalyze={handleAnalyze} error={error} />
      )}

      {phase === 'loading' && (
        <LoadingState companyName={loadingCompany} />
      )}

      {phase === 'results' && analysis && (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main area — matrix or compliance map */}
          <div className="flex-1 overflow-auto p-4">
            {/* Company summary */}
            <div className="mb-4 bg-surface border border-border rounded-lg p-4">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="flex-1 min-w-64">
                  <p className="text-text-secondary text-sm">{analysis.company_summary}</p>
                </div>
                <div className="flex gap-6 text-sm shrink-0">
                  <div>
                    <span className="text-text-secondary block text-xs uppercase tracking-wider mb-1">Industry</span>
                    <span className="text-text-primary">{analysis.industry}</span>
                  </div>
                  {analysis.data_handled.length > 0 && (
                    <div>
                      <span className="text-text-secondary block text-xs uppercase tracking-wider mb-1">Data Handled</span>
                      <div className="flex flex-wrap gap-1">
                        {analysis.data_handled.slice(0, 4).map((d) => (
                          <span key={d} className="bg-background border border-border text-text-secondary text-xs px-2 py-0.5 rounded">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {complianceView === 'map' ? (
              <ComplianceMap
                frameworks={analysis.compliance_frameworks}
                companyName={analysis.company_name}
                onSelectControl={setSelectedControl}
              />
            ) : (
              <MitreMatrix
                matrix={analysis.matrix}
                companyName={analysis.company_name}
                onSelectTechnique={setSelectedTechnique}
                selectedTechnique={selectedTechnique}
              />
            )}
          </div>

          {/* Technique panel — inside relative container so it sits below the nav */}
          {selectedTechnique && complianceView !== 'map' && (
            <TechniquePanel
              technique={selectedTechnique}
              onClose={() => setSelectedTechnique(null)}
            />
          )}

          {/* Compliance control panel */}
          {selectedControl && (
            <ComplianceControlPanel
              control={selectedControl}
              companyName={analysis.company_name}
              industry={analysis.industry}
              onClose={() => setSelectedControl(null)}
            />
          )}

          {/* Right sidebar */}
          <div className="w-80 bg-surface border-l border-border flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-border shrink-0">
              <button
                onClick={() => setSidebarTab('compliance')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'compliance'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Compliance
              </button>
              <button
                onClick={() => setSidebarTab('checklist')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'checklist'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Checklist
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sidebarTab === 'compliance' ? (
                <>
                  {/* Map toggle */}
                  <div className="p-3 border-b border-border">
                    <button
                      onClick={() => {
                        setComplianceView(v => v === 'map' ? 'list' : 'map')
                        setSelectedControl(null)
                        setSelectedTechnique(null)
                      }}
                      className={`w-full text-sm py-1.5 px-3 rounded border transition-colors ${
                        complianceView === 'map'
                          ? 'bg-accent/10 border-accent text-accent'
                          : 'border-border text-text-secondary hover:border-accent hover:text-accent'
                      }`}
                    >
                      {complianceView === 'map' ? '← Back to Threat Matrix' : 'View Compliance Map'}
                    </button>
                  </div>
                  <ComplianceSidebar
                    frameworks={analysis.compliance_frameworks}
                    onSelectControl={setSelectedControl}
                  />
                </>
              ) : (
                <ImplementationChecklist checklist={analysis.implementation_checklist} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
