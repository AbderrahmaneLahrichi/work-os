import { Link } from 'react-router-dom'
import './M365AutomationProject.css'

const functions = [
  {
    name: 'Connect-M365',
    params: 'None',
    description: 'Opens a browser login prompt and authenticates to Microsoft Graph. Automatically detects your tenant domain and ID from the signed-in account — no manual configuration required.'
  },
  {
    name: 'New-M365User',
    params: '-CsvPath',
    description: 'Reads a CSV file of new hires and creates each account in Entra ID. Assigns the first available license, adds the user to their department group, generates a temporary password, and sends a welcome email to their personal address.'
  },
  {
    name: 'Send-M365PasswordReminder',
    params: 'None',
    description: 'Checks all users for the ForceChangePasswordNextSignIn flag. Sends a reminder email to anyone who still has a temporary password, using their personal email if available or falling back to their work email.'
  },
  {
    name: 'Invoke-M365Offboard',
    params: '-Email',
    description: 'Offboards a departing user. Blocks sign-in immediately, removes them from all groups, and strips their license so it returns to the available pool. The account stays in Entra ID in a disabled state for audit and compliance purposes. Writes an audit record to CSV after each run.'
  },
  {
    name: 'Remove-M365User',
    params: '-Email, -All',
    description: 'Permanently deletes a user account or all accounts with -All. Strips licenses before deletion so they return to the pool immediately. The admin account is always skipped during bulk deletion.'
  },
  {
    name: 'Get-M365LicenseReport',
    params: 'None',
    description: 'Exports a CSV report of every user in the tenant showing their display name, email, assigned license (or None), and last sign-in date. Used to audit license utilization and spot unused seats.'
  },
  {
    name: 'Get-M365InactiveUsers',
    params: '-Days (default: 30)',
    description: 'Flags users who have not signed in within the specified number of days, including accounts that have never signed in. Exports results to CSV. Run with -Days 90 for a 90-day audit window.'
  }
]

function M365AutomationProject() {
  return (
    <div className="project-page">
      <div className="project-page-inner">

        <div className="project-page-back">
          <Link to="/" className="back-link">&larr; Back to Portfolio</Link>
        </div>

        <header className="project-page-header">
          <div className="project-page-title-row">
            <h1>M365 Automation Module</h1>
            <a
              href="https://github.com/AbderrahmaneLahrichi/M365Automation"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View on GitHub
            </a>
          </div>
          <p className="project-page-subtitle">
            A PowerShell module for automating Microsoft 365 user lifecycle management using the Microsoft Graph SDK.
            Plug-and-play — authenticate with your admin account and run. No hardcoded values, no manual tenant configuration.
          </p>
          <div className="project-tech-tags">
            {['PowerShell', 'Microsoft Graph SDK', 'Microsoft 365', 'Entra ID'].map(tag => (
              <span key={tag} className="tech-tag">{tag}</span>
            ))}
          </div>
        </header>

        <section className="project-section">
          <h2>Overview</h2>
          <p>
            Built to mirror real enterprise IT workflows, this module handles the full user lifecycle — from onboarding new hires
            via CSV to offboarding departing employees while preserving accounts for compliance review. Every action is logged
            with timestamps and exported to CSV where relevant.
          </p>
        </section>

        <section className="project-section">
          <h2>Prerequisites</h2>
          <div className="project-prereqs">
            <div className="prereq-item">
              <span className="prereq-label">PowerShell</span>
              <span className="prereq-value">5.1 or later</span>
            </div>
            <div className="prereq-item">
              <span className="prereq-label">Microsoft Graph SDK</span>
              <span className="prereq-value">Install-Module Microsoft.Graph</span>
            </div>
          </div>
        </section>

        <section className="project-section">
          <h2>Setup</h2>
          <div className="code-block">
            <pre>{`git clone https://github.com/AbderrahmaneLahrichi/M365Automation.git
cd M365Automation
Import-Module .\\M365Automation.psd1 -Force
Connect-M365`}</pre>
          </div>
          <p className="project-note">
            Connect-M365 opens a browser login prompt. Sign in with your Microsoft 365 admin account.
            The module detects your tenant domain automatically.
          </p>
        </section>

        <section className="project-section">
          <h2>Functions</h2>
          <div className="functions-list">
            {functions.map(fn => (
              <div key={fn.name} className="function-card">
                <div className="function-header">
                  <span className="function-name">{fn.name}</span>
                  <span className="function-params">{fn.params}</span>
                </div>
                <p className="function-desc">{fn.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="project-section">
          <h2>Logging</h2>
          <p>All actions are logged with timestamps to:</p>
          <div className="code-block">
            <pre>C:\Users\&lt;YourUsername&gt;\Logs\M365Automation\M365Automation_YYYY-MM-DD.log</pre>
          </div>
          <p style={{ marginTop: '1rem' }}>CSV reports are also saved to the same folder:</p>
          <ul className="project-list">
            <li><strong>OffboardAudit.csv</strong> — record of every offboarded user</li>
            <li><strong>LicenseReport.csv</strong> — full license and sign-in report</li>
            <li><strong>InactiveUsersReport.csv</strong> — users flagged as inactive</li>
          </ul>
        </section>

      </div>
    </div>
  )
}

export default M365AutomationProject
