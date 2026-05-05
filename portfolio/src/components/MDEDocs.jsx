import { useState } from 'react'
import './MDEDocs.css'

const categories = [
  {
    id: 'device-health',
    label: 'Device Health',
    description: 'Query device sensor status, onboarding state, last seen timestamps, and exposure levels. Used during escalations to understand device posture before diving into telemetry.',
    table: 'DeviceInfo',
    queries: [
      {
        id: 'dh-1',
        title: 'Full Device Profile Lookup',
        description: 'Pull the latest state for a specific device — OS, sensor health, exposure level, client version, and machine group.',
        query: `DeviceInfo
| summarize arg_max(Timestamp, *) by DeviceId
| where DeviceName contains "DEVICE-NAME"
| project DeviceName, OSPlatform, OSVersion, OSBuild, DeviceType,
          OnboardingStatus, SensorHealthState, ExposureLevel,
          ClientVersion, MachineGroup, IsAzureADJoined, PublicIP, Timestamp`
      },
      {
        id: 'dh-2',
        title: 'Devices with Unhealthy Sensor State',
        description: 'Find all onboarded devices where the EDR sensor is not reporting as Active. Useful for identifying connectivity issues or misconfigurations at scale.',
        query: `DeviceInfo
| summarize arg_max(Timestamp, *) by DeviceId
| where OnboardingStatus == "Onboarded"
| where SensorHealthState != "Active"
| project DeviceName, SensorHealthState, OSPlatform,
          ExposureLevel, MachineGroup, Timestamp
| sort by SensorHealthState asc`
      },
      {
        id: 'dh-3',
        title: 'Devices Not Seen in 7+ Days',
        description: 'Surface onboarded devices that have gone silent. Used to identify machines that may be offline, decommissioned, or have lost connectivity to the MDE service.',
        query: `DeviceInfo
| summarize LastSeen = max(Timestamp) by DeviceId, DeviceName, OSPlatform, MachineGroup, OnboardingStatus
| where LastSeen < ago(7d)
| where OnboardingStatus == "Onboarded"
| project DeviceName, LastSeen, OSPlatform, MachineGroup
| sort by LastSeen asc`
      },
      {
        id: 'dh-4',
        title: 'High-Exposure Devices',
        description: 'List all onboarded devices with a High exposure level. Used for prioritizing remediation efforts and stakeholder reporting.',
        query: `DeviceInfo
| summarize arg_max(Timestamp, *) by DeviceId
| where OnboardingStatus == "Onboarded"
    and ExposureLevel == "High"
| project DeviceName, OSPlatform, OSVersion, ExposureLevel, SensorHealthState,
          MachineGroup, AssetValue, IsInternetFacing, Timestamp
| sort by IsInternetFacing desc, DeviceName asc`
      }
    ]
  },
  {
    id: 'av-status',
    label: 'Antivirus Status',
    description: 'Check Defender Antivirus signature versions, engine versions, AV mode, and configuration compliance across device populations. AV version data is stored in DeviceTvmSecureConfigurationAssessment under specific configuration IDs (scid-2010 for mode, scid-2011 for versions).',
    table: 'DeviceTvmSecureConfigurationAssessment',
    queries: [
      {
        id: 'av-1',
        title: 'AV Signature Version, Engine Version, and Mode',
        description: 'Returns Defender AV signature version, engine version, last update time, platform version, and operating mode (Active, Passive, EDR Blocked) per device.',
        query: `let avmodetable = DeviceTvmSecureConfigurationAssessment
| where ConfigurationId == "scid-2010" and isnotnull(Context)
| extend avdata = parsejson(Context)
| extend AVMode = iif(tostring(avdata[0][0]) == '0', 'Active',
                  iif(tostring(avdata[0][0]) == '1', 'Passive',
                  iif(tostring(avdata[0][0]) == '4', 'EDR Blocked', 'Unknown')))
| project DeviceId, AVMode;
DeviceTvmSecureConfigurationAssessment
| where ConfigurationId == "scid-2011" and isnotnull(Context)
| extend avdata = parsejson(Context)
| extend AVSigVersion        = tostring(avdata[0][0])
| extend AVEngineVersion     = tostring(avdata[0][1])
| extend AVSigLastUpdateTime = tostring(avdata[0][2])
| extend AVProductVersion    = tostring(avdata[0][3])
| project DeviceId, DeviceName, OSPlatform, AVSigVersion, AVEngineVersion,
          AVSigLastUpdateTime, AVProductVersion, IsCompliant, IsApplicable
| join kind=leftouter avmodetable on DeviceId
| project-away DeviceId1`
      },
      {
        id: 'av-2',
        title: 'Non-Compliant Antivirus Configurations',
        description: 'Find all devices failing Defender AV configuration checks with the specific check that failed, risk description, and remediation guidance.',
        query: `DeviceTvmSecureConfigurationAssessment
| where ConfigurationSubcategory == 'Antivirus' and IsApplicable == 1 and IsCompliant == 0
| join kind=leftouter (
    DeviceTvmSecureConfigurationAssessmentKB
    | project ConfigurationId, ConfigurationName, ConfigurationDescription,
              RiskDescription, ConfigurationImpact, RemediationOptions
) on ConfigurationId
| project DeviceName, OSPlatform, ConfigurationName,
          ConfigurationDescription, RiskDescription,
          ConfigurationImpact, RemediationOptions
| sort by ConfigurationImpact desc`
      },
      {
        id: 'av-3',
        title: 'AV Compliance Rate Across All Devices',
        description: 'Summarizes pass/fail rates for every antivirus configuration check across the entire device population. Useful for compliance reporting.',
        query: `DeviceTvmSecureConfigurationAssessment
| where ConfigurationSubcategory == 'Antivirus' and IsApplicable == 1
| join kind=leftouter (
    DeviceTvmSecureConfigurationAssessmentKB
    | project ConfigurationId, ConfigurationName, RemediationOptions
) on ConfigurationId
| summarize
    TotalDevices     = dcount(DeviceId),
    CompliantDevices = dcountif(DeviceId, IsCompliant == true),
    NonCompliant     = dcountif(DeviceId, IsCompliant == false)
    by ConfigurationName, RemediationOptions
| extend ComplianceRate = round(100.0 * CompliantDevices / TotalDevices, 1)
| sort by ComplianceRate asc`
      }
    ]
  },
  {
    id: 'tvm',
    label: 'Vulnerability Management',
    description: 'TVM queries for surfacing exploitable CVEs, missing patches, and zero-days. Used during vulnerability assessments, remediation tracking, and stakeholder reporting.',
    table: 'DeviceTvmSoftwareVulnerabilities',
    queries: [
      {
        id: 'tvm-1',
        title: 'Exploitable CVEs by Device (Critical and High)',
        description: 'Lists Critical and High severity CVEs where public exploit code is available, ranked by CVSS score. First priority list for remediation conversations with customer stakeholders.',
        query: `DeviceTvmSoftwareVulnerabilities
| join kind=inner (
    DeviceTvmSoftwareVulnerabilitiesKB
    | where IsExploitAvailable == 1
    | project CveId, CvssScore, VulnerabilityDescription, PublishedDate
) on CveId
| where VulnerabilitySeverityLevel in ("Critical", "High")
| project DeviceName, OSPlatform, SoftwareName, SoftwareVersion,
          CveId, CvssScore, VulnerabilitySeverityLevel,
          RecommendedSecurityUpdate, RecommendedSecurityUpdateId,
          VulnerabilityDescription, PublishedDate
| sort by CvssScore desc, DeviceName asc`
      },
      {
        id: 'tvm-2',
        title: 'Missing Patches Per Device',
        description: 'Ranks devices by number of missing security updates with separate counts for Critical and High CVEs. Used to prioritize patch deployment and track remediation progress.',
        query: `DeviceTvmSoftwareVulnerabilities
| where isnotempty(RecommendedSecurityUpdateId)
| summarize
    MissingUpdates = dcount(RecommendedSecurityUpdateId),
    CriticalCount  = dcountif(CveId, VulnerabilitySeverityLevel == "Critical"),
    HighCount      = dcountif(CveId, VulnerabilitySeverityLevel == "High")
    by DeviceId, DeviceName, OSPlatform
| sort by CriticalCount desc, MissingUpdates desc`
      },
      {
        id: 'tvm-3',
        title: 'Zero-Day CVEs with No Available Patch',
        description: 'Surfaces vulnerabilities tagged as ZeroDay or where no security update exists. Used to identify risk that cannot be remediated through patching alone and requires compensating controls.',
        query: `DeviceTvmSoftwareVulnerabilities
| where CveTags has "ZeroDay" or CveTags has "NoSecurityUpdate"
| join kind=inner (
    DeviceTvmSoftwareVulnerabilitiesKB
    | project CveId, CvssScore, IsExploitAvailable, VulnerabilityDescription
) on CveId
| project DeviceName, OSPlatform, SoftwareName, SoftwareVersion,
          CveId, CvssScore, IsExploitAvailable, VulnerabilitySeverityLevel,
          CveTags, VulnerabilityDescription
| sort by IsExploitAvailable desc, CvssScore desc`
      }
    ]
  },
  {
    id: 'software',
    label: 'Software Inventory',
    description: 'Query installed software across device populations. Used to verify patch deployment, identify end-of-support software, and scope vulnerability impact during active investigations.',
    table: 'DeviceTvmSoftwareInventory',
    queries: [
      {
        id: 'sw-1',
        title: 'Find Specific Software Across All Devices',
        description: 'Locate where a specific application is installed and which versions are in use. Useful for scoping vulnerability impact or verifying a software rollout.',
        query: `DeviceTvmSoftwareInventory
| where SoftwareName contains "SOFTWARE-NAME"
| summarize
    DeviceCount = dcount(DeviceId),
    Versions    = make_set(SoftwareVersion)
    by SoftwareName, SoftwareVendor
| sort by DeviceCount desc`
      },
      {
        id: 'sw-2',
        title: 'Software Past End-of-Support',
        description: 'Finds installed software that has reached end-of-support or end-of-life. EOS software no longer receives security patches and represents persistent unmitigable risk.',
        query: `DeviceTvmSoftwareInventory
| where EndOfSupportStatus in ("EOS", "EOL") or EndOfSupportDate <= now()
| summarize
    AffectedDevices = dcount(DeviceId),
    ExampleDevices  = make_set(DeviceName, 5)
    by SoftwareName, SoftwareVendor, SoftwareVersion,
       EndOfSupportDate, EndOfSupportStatus
| sort by AffectedDevices desc`
      },
      {
        id: 'sw-3',
        title: 'Full Software Inventory for a Single Device',
        description: 'Returns all software installed on a specific device including end-of-support status. Used during device-level investigations or compliance checks.',
        query: `DeviceTvmSoftwareInventory
| where DeviceName == "DEVICE-FQDN-HERE"
| project SoftwareName, SoftwareVendor, SoftwareVersion,
          EndOfSupportStatus, EndOfSupportDate, ProductCodeCpe
| sort by SoftwareName asc`
      }
    ]
  }
]

function MDEDocs() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [copied, setCopied] = useState(null)

  const current = categories.find(c => c.id === activeCategory)

  const handleCopy = (id, query) => {
    navigator.clipboard.writeText(query).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <section id="mde-docs" className="section">
      <h2 className="section-title">MDE Reference</h2>
      <p className="mde-docs-intro">
        Advanced Hunting query reference for Microsoft Defender for Endpoint. Organized by use case — device health checks, AV status, vulnerability management, and software inventory.
      </p>

      <div className="mde-docs-layout">
        <nav className="mde-docs-sidebar">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`mde-sidebar-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="mde-sidebar-label">{cat.label}</span>
              <span className="mde-sidebar-table">{cat.table}</span>
            </button>
          ))}
        </nav>

        <div className="mde-docs-content">
          <div className="mde-category-header">
            <h3 className="mde-category-title">{current.label}</h3>
            <code className="mde-table-badge">{current.table}</code>
          </div>
          <p className="mde-category-description">{current.description}</p>

          <div className="mde-queries">
            {current.queries.map(q => (
              <div key={q.id} className="mde-query-block">
                <div className="mde-query-header">
                  <h4 className="mde-query-title">{q.title}</h4>
                  <button
                    className="mde-copy-btn"
                    onClick={() => handleCopy(q.id, q.query)}
                  >
                    {copied === q.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="mde-query-description">{q.description}</p>
                <div className="mde-code-block">
                  <pre><code>{q.query}</code></pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MDEDocs
