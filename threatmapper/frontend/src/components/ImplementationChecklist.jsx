const PRIORITY_ORDER = ['High', 'Medium', 'Low']

function getPriorityBadge(priority) {
  switch (priority) {
    case 'High':
      return 'bg-red-900/60 text-red-300 border border-red-800'
    case 'Medium':
      return 'bg-yellow-900/60 text-yellow-300 border border-yellow-800'
    case 'Low':
      return 'bg-green-900/60 text-green-300 border border-green-800'
    default:
      return 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'
  }
}

function getEffortBadge(effort) {
  switch (effort) {
    case 'Days':
      return 'bg-[#0d1117] text-green-400 border border-green-900'
    case 'Weeks':
      return 'bg-[#0d1117] text-yellow-400 border border-yellow-900'
    case 'Months':
      return 'bg-[#0d1117] text-orange-400 border border-orange-900'
    default:
      return 'bg-[#0d1117] text-[#8b949e] border border-[#30363d]'
  }
}

export default function ImplementationChecklist({ checklist }) {
  if (!checklist || checklist.length === 0) {
    return (
      <div className="p-4 text-[#8b949e] text-sm text-center mt-8">
        No checklist items generated.
      </div>
    )
  }

  const grouped = PRIORITY_ORDER.reduce((acc, priority) => {
    const items = checklist.filter((item) => item.priority === priority)
    if (items.length > 0) acc[priority] = items
    return acc
  }, {})

  // Catch any items with unexpected priority values
  const knownPriorities = new Set(PRIORITY_ORDER)
  const other = checklist.filter((item) => !knownPriorities.has(item.priority))
  if (other.length > 0) grouped['Other'] = other

  return (
    <div className="p-3 space-y-4">
      {Object.entries(grouped).map(([priority, items]) => (
        <div key={priority}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getPriorityBadge(priority)}`}>
              {priority}
            </span>
            <span className="text-[11px] text-[#8b949e]">{items.length} action{items.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3"
              >
                <p className="text-[13px] text-[#e6edf3] leading-snug mb-2">{item.action}</p>

                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {item.effort && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getEffortBadge(item.effort)}`}>
                      {item.effort}
                    </span>
                  )}
                  {item.tools && item.tools.map((tool, j) => (
                    <span
                      key={j}
                      className="text-[10px] bg-[#1f2937] border border-[#374151] text-[#60a5fa] px-1.5 py-0.5 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {item.techniques_covered && item.techniques_covered.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.techniques_covered.map((tid, j) => (
                      <span
                        key={j}
                        className="text-[10px] font-mono bg-[#161b22] border border-[#30363d] text-[#8b949e] px-1.5 py-0.5 rounded"
                      >
                        {tid}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
