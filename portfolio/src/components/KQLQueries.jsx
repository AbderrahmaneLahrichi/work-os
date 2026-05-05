import { useState, useEffect, useRef } from 'react'
import { kqlQueries } from '../data/portfolioData'
import { observeElements } from '../utils/helpers'
import './KQLQueries.css'

const scenarioColors = {
  'Initial Access': '#f97316',
  'Defense Evasion': '#a78bfa',
  'Threat Hunting': '#14b8a6',
  'Lateral Movement': '#f43f5e',
  'Phishing': '#fb923c',
  'Credential Access': '#facc15',
  'C2 Detection': '#60a5fa',
  'DLP': '#34d399',
  'Information Protection': '#818cf8',
  'Mailbox Audit': '#f472b6',
  'Retention': '#fb923c',
  'Exfiltration Detection': '#f43f5e'
}

const toolOrder = [
  'Microsoft Defender for Endpoint',
  'Microsoft Defender for Office 365',
  'Microsoft Purview'
]

function KQLQueries() {
  const [copied, setCopied] = useState(null)
  const cardsRef = useRef([])

  const grouped = toolOrder.map(tool => ({
    tool,
    queries: kqlQueries.filter(q => q.tool === tool)
  })).filter(g => g.queries.length > 0)

  let cardIndex = 0

  useEffect(() => {
    const cleanup = observeElements(cardsRef.current)
    return cleanup
  }, [])

  const handleCopy = (id, query) => {
    navigator.clipboard.writeText(query).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <section id="kql" className="section">
      <h2 className="section-title">Threat Hunting Queries</h2>
      <p className="kql-intro">
        Advanced Hunting queries written for Microsoft Defender XDR and Entra ID.
        Each query targets a specific attack scenario and is designed to run across enterprise device populations.
      </p>
      {grouped.map(group => (
        <div key={group.tool} className="kql-group">
          <h3 className="kql-group-title">{group.tool}</h3>
          <div className="kql-grid">
            {group.queries.map(item => {
              const idx = cardIndex++
              return (
                <div
                  key={item.id}
                  className="kql-card"
                  ref={el => cardsRef.current[idx] = el}
                >
                  <div className="kql-card-header">
                    <div className="kql-meta">
                      <span
                        className="kql-scenario"
                        style={{ color: scenarioColors[item.scenario] || '#14b8a6', borderColor: scenarioColors[item.scenario] || '#14b8a6' }}
                      >
                        {item.scenario}
                      </span>
                    </div>
                    <h3 className="kql-title">{item.title}</h3>
                    <p className="kql-description">{item.description}</p>
                  </div>
                  <div className="kql-code-block">
                    <button
                      className="kql-copy-btn"
                      onClick={() => handleCopy(item.id, item.query)}
                    >
                      {copied === item.id ? 'Copied' : 'Copy'}
                    </button>
                    <pre><code>{item.query}</code></pre>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export default KQLQueries
