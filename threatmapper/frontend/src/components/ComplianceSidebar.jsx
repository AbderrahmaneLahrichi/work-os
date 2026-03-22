const PRIORITY_DOT = {
  High:   'bg-red-500',
  Medium: 'bg-orange-400',
  Low:    'bg-blue-400',
}

export default function ComplianceSidebar({ frameworks, onSelectControl }) {
  if (!frameworks || frameworks.length === 0) {
    return (
      <div className="p-4 text-[#8b949e] text-sm text-center mt-8">
        No compliance frameworks identified.
      </div>
    )
  }

  return (
    <div className="p-3 space-y-3">
      {frameworks.map((framework, i) => {
        const controls = framework.controls || []
        return (
          <div key={i} className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#30363d]">
              <h3 className="text-sm font-semibold text-[#e6edf3]">{framework.name}</h3>
              {framework.reason && (
                <p className="text-[11px] text-[#8b949e] mt-0.5 leading-relaxed">{framework.reason}</p>
              )}
            </div>

            {controls.length > 0 ? (
              <ul className="divide-y divide-[#21262d]">
                {controls.map((ctrl, j) => (
                  <li
                    key={j}
                    onClick={() => onSelectControl?.({ ...ctrl, framework: framework.name })}
                    className={`px-3 py-2 flex items-start gap-2.5 ${onSelectControl ? 'cursor-pointer hover:bg-[#161b22] transition-colors' : ''}`}
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[ctrl.priority] || PRIORITY_DOT.Low}`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-[#58a6ff] shrink-0">{ctrl.id}</span>
                        <span className="text-[11px] text-[#e6edf3] font-medium leading-tight">{ctrl.name}</span>
                      </div>
                      {ctrl.description && (
                        <p className="text-[10px] text-[#8b949e] mt-0.5 leading-relaxed">{ctrl.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              framework.key_controls?.length > 0 && (
                <ul className="p-3 space-y-1">
                  {framework.key_controls.map((ctrl, j) => (
                    <li key={j} className="flex items-start gap-2 text-[12px] text-[#8b949e]">
                      <span className="text-[#58a6ff] mt-0.5 shrink-0">•</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        )
      })}
    </div>
  )
}
