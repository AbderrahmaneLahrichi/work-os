import { useState } from 'react'

const EXAMPLE_COMPANIES = ['Microsoft', 'Shopify', 'Stripe', 'Kaiser Permanente', 'Palantir', 'Coinbase']
const VALID_PATTERN = /^[a-zA-Z0-9\s.,\-&']*$/

export default function CompanySearch({ onAnalyze, error }) {
  const [value, setValue] = useState('')
  const [validationError, setValidationError] = useState('')

  function validate(v) {
    if (!v.trim()) return ''
    if (v.length > 100) return 'Company name must be 100 characters or fewer'
    if (!VALID_PATTERN.test(v)) return 'Only letters, numbers, spaces, and . , - & \' are allowed'
    return ''
  }

  function handleChange(e) {
    const v = e.target.value
    setValue(v)
    setValidationError(validate(v))
  }

  function handleSubmit() {
    const err = validate(value)
    if (err) {
      setValidationError(err)
      return
    }
    if (!value.trim()) return
    onAnalyze(value.trim())
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleExampleClick(name) {
    setValue(name)
    setValidationError('')
    onAnalyze(name)
  }

  const isDisabled = !value.trim() || !!validationError

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        {/* Logo / title */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">ThreatMapper</h1>
          <p className="text-text-secondary text-lg">
            Enter a company name to generate a MITRE ATT&amp;CK threat profile
          </p>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Company name (e.g. Stripe, Kaiser Permanente)"
            autoFocus
            className="w-full bg-surface border border-border text-text-primary text-lg px-5 py-4 rounded-lg placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
          />
          {validationError && (
            <p className="mt-2 text-red-400 text-sm">{validationError}</p>
          )}
          {error && !validationError && (
            <p className="mt-2 text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Analyze button */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-accent text-background font-semibold text-base px-6 py-4 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyze
        </button>

        {/* Example companies */}
        <div className="mt-8">
          <p className="text-text-secondary text-sm text-center mb-3">Try an example</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() => handleExampleClick(company)}
                className="bg-surface border border-border text-text-secondary text-sm px-4 py-2 rounded-full hover:border-accent hover:text-accent transition-colors"
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
