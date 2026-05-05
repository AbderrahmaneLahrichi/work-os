import { useState } from 'react'
import { Link } from 'react-router-dom'
import { kqlQueries, mdeCategories } from '../data/portfolioData'
import './Docs.css'

const toolOrder = [
  'Microsoft Defender for Endpoint',
  'Microsoft Defender for Office 365',
  'Microsoft Purview'
]

const scenarioColors = {
  'Initial Access': '#f97316',
  'Threat Hunting': '#14b8a6',
  'Lateral Movement': '#f43f5e',
  'Phishing': '#fb923c',
  'C2 Detection': '#60a5fa',
  'DLP': '#34d399',
  'Information Protection': '#818cf8',
  'Mailbox Audit': '#f472b6',
  'Retention': '#fb923c',
  'Exfiltration Detection': '#f43f5e',
  'Malware': '#e879f9'
}

const allSections = [
  {
    groupLabel: 'Microsoft Defender for Endpoint',
    items: [
      {
        id: 'mde-threat-hunting',
        label: 'Threat Hunting',
        table: null,
        description: 'Advanced Hunting queries for detecting threats at the endpoint — macro execution, IOC sweeps across device populations, lateral movement detection, and C2 beaconing.',
        queries: kqlQueries.filter(q => q.tool === 'Microsoft Defender for Endpoint'),
        showScenario: true
      },
      ...mdeCategories.map(cat => ({
        ...cat,
        id: `mde-${cat.id}`,
        showScenario: false
      }))
    ]
  },
  {
    groupLabel: 'Microsoft Defender for Office 365',
    items: [
      {
        id: 'mdo-threat-hunting',
        label: 'Threat Hunting',
        table: null,
        description: 'Advanced Hunting queries for email-based threats — inbound emails carrying malicious attachments and phishing URLs that were delivered and clicked.',
        queries: kqlQueries.filter(q => q.tool === 'Microsoft Defender for Office 365'),
        showScenario: true
      }
    ]
  },
  {
    groupLabel: 'Microsoft Purview',
    items: [
      {
        id: 'purview-compliance',
        label: 'DLP & Compliance',
        table: 'CloudAppEvents',
        description: 'Advanced Hunting queries for DLP policy violations, sensitivity label activity, Exchange mailbox auditing, litigation hold changes, and inbox rule monitoring across M365 tenants.',
        queries: kqlQueries.filter(q => q.tool === 'Microsoft Purview'),
        showScenario: true
      }
    ]
  }
]

function QueryCard({ query, showScenario }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(query.query).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="docs-query-block">
      <div className="docs-query-header">
        <div className="docs-query-meta">
          <h4 className="docs-query-title">{query.title}</h4>
          {showScenario && query.scenario && (
            <span
              className="docs-scenario-tag"
              style={{
                color: scenarioColors[query.scenario] || '#14b8a6',
                borderColor: scenarioColors[query.scenario] || '#14b8a6'
              }}
            >
              {query.scenario}
            </span>
          )}
        </div>
        <button className="docs-copy-btn" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="docs-query-description">{query.description}</p>
      <div className="docs-code-block">
        <pre><code>{query.query}</code></pre>
      </div>
    </div>
  )
}

function Docs() {
  const firstItem = allSections[0].items[0]
  const [activeId, setActiveId] = useState(firstItem.id)

  const allItems = allSections.flatMap(s => s.items)
  const active = allItems.find(item => item.id === activeId)

  return (
    <div className="docs-page">
      <header className="docs-header">
        <Link to="/" className="docs-back-link">← Portfolio</Link>
        <span className="docs-header-title">KQL Documentation</span>
        <span className="docs-header-sub">Microsoft Defender XDR · Purview · Advanced Hunting</span>
      </header>

      <div className="docs-layout">
        <nav className="docs-sidebar">
          {allSections.map(section => (
            <div key={section.groupLabel} className="docs-sidebar-group">
              <span className="docs-sidebar-group-label">{section.groupLabel}</span>
              {section.items.map(item => (
                <button
                  key={item.id}
                  className={`docs-sidebar-btn ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                >
                  <span className="docs-sidebar-item-label">{item.label}</span>
                  {item.table && (
                    <span className="docs-sidebar-item-table">{item.table}</span>
                  )}
                  <span className="docs-sidebar-count">
                    {item.queries.length} {item.queries.length === 1 ? 'query' : 'queries'}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <main className="docs-content">
          {active && (
            <>
              <div className="docs-content-header">
                <div className="docs-content-title-row">
                  <h2 className="docs-content-title">{active.label}</h2>
                  {active.table && (
                    <code className="docs-table-badge">{active.table}</code>
                  )}
                </div>
                <p className="docs-content-description">{active.description}</p>
              </div>

              <div className="docs-queries-list">
                {active.queries.map(q => (
                  <QueryCard key={q.id} query={q} showScenario={active.showScenario} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Docs
