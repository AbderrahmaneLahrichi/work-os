import { useState, useEffect } from 'react'

const MESSAGES = [
  (name) => `Researching ${name}...`,
  () => 'Analyzing industry and data profile...',
  () => 'Mapping to MITRE ATT\u0026CK framework...',
  () => 'Identifying compliance requirements...',
  () => 'Building your threat profile...',
]

export default function LoadingState({ companyName }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < MESSAGES.length - 1) return prev + 1
        return prev
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-accent"
              style={{
                animation: `pulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-text-secondary text-sm uppercase tracking-widest mb-2">Analyzing</p>
          <h2 className="text-3xl font-bold text-text-primary">{companyName}</h2>
        </div>

        <div className="h-6">
          <p className="text-text-secondary text-base transition-all duration-500">
            {MESSAGES[messageIndex](companyName)}
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2 justify-center mt-8">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= messageIndex ? 'bg-accent w-8' : 'bg-border w-4'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
