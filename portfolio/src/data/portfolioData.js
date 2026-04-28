export const personalInfo = {
  name: 'Abderrahmane Lahrichi',
  location: 'Bellevue, WA',
  email: 'a.lahrichi224@gmail.com',
  phone: '(425) 435-9217',
  linkedin: 'https://www.linkedin.com/in/abderrahmane-lahrichi/',
  github: 'https://github.com/AbderrahmaneLahrichi'
}

export const education = [
  {
    id: 1,
    degree: 'Bachelor of Science',
    field: 'Electrical and Computer Engineering',
    school: 'University of Washington',
    location: 'Seattle, WA',
    graduated: 'December 2021'
  },
  {
    id: 2,
    degree: "Associate's Degree",
    field: 'Electrical, Electronics and Communications Engineering',
    school: 'Bellevue College',
    location: 'Bellevue, WA',
    graduated: 'June 2019'
  }
]

export const experiences = [
  {
    id: 4,
    title: 'Founder',
    company: 'Grali',
    location: 'Bellevue, WA',
    period: 'September 2025 - Present',
    summary: 'Founded Grali, an AI-powered security implementation tool that generates prescriptive, phase-based roadmaps from a declarative questionnaire about an organization\'s existing stack.',
    responsibilities: [
      'Conceived and designed Grali, a security implementation tool for IT leads and security admins generating prescriptive, phase-based roadmaps from their existing stack.',
      'Designed the 9-step questionnaire covering identity, cloud, endpoints, network, SIEM, AppSec, and data protection — using real product names, not capability abstractions.',
      'Defined the AI output format and constraints: implementation guides a team can execute, not gap analyses. Iterated on the prompt until outputs matched production-grade expectations.',
      'Validated recommendations against real enterprise environments from prior Microsoft work to ensure the tool produces actionable guidance, not generic advice.'
    ],
    technicalSkills: [
      'Prompt Engineering',
      'AI-Assisted Development',
      'Product Design',
      'Security Architecture'
    ],
    softSkills: ['Product Vision', 'Requirements Definition', 'Domain Validation'],
    frameworks: [],
    frameworkNote: null
  },
  {
    id: 1,
    title: 'Security and Compliance Engineer',
    company: 'Microsoft',
    location: 'Bellevue, WA',
    period: 'September 2024 - August 2025',
    summary: 'One of three founding engineers on the Security and Compliance practice. Subject Matter Expert for Defender for Office 365 and Purview.',
    responsibilities: [
      'Founding engineer on the Security and Compliance practice at Microsoft. Built team processes from scratch and mentored every engineer who joined.',
      'Subject Matter Expert for Microsoft Defender for Office 365 and Microsoft Purview. Primary escalation contact for complex MDO and Purview cases.',
      'Investigate phishing, malware, and email security incidents daily: message headers, detonation results, auth logs, and audit trails.',
      'Respond to critical incidents on-call. Deliver root cause analysis and post-incident summaries to technical teams and leadership.',
      'Configure DLP policies, sensitivity labels, retention rules, and insider risk features in Purview for FedRAMP, NIST, HIPAA, and PCI-DSS environments.',
      'Configure and validate anti-phishing policies, Safe Links, Safe Attachments, and DMARC/DKIM/SPF across enterprise M365 tenants.',
      'Run cross-tenant SIEM investigations alongside the Microsoft Sentinel team.'
    ],
    technicalSkills: [
      'Microsoft Defender for Office 365',
      'Microsoft Purview',
      'Microsoft Sentinel',
      'Data Loss Prevention (DLP)',
      'Sensitivity Labels',
      'Insider Risk Management',
      'Retention Policies',
      'Email Authentication (DMARC, DKIM, SPF)',
      'Incident Response',
      'Microsoft 365 Administration',
      'Entra ID',
      'GCC / GCC High'
    ],
    softSkills: ['Escalation Management', 'Technical Mentorship', 'Incident Leadership', 'Stakeholder Reporting'],
    frameworks: ['FedRAMP', 'NIST', 'HIPAA', 'PCI-DSS'],
    frameworkNote: null
  },
  {
    id: 2,
    title: 'Endpoint Security Engineer',
    company: 'Microsoft',
    location: 'Bellevue, WA',
    period: 'December 2023 - September 2024',
    summary: 'Subject Matter Expert for Microsoft Defender for Endpoint. Tier 2/3 escalations, internal playbooks, and KQL threat hunting across GCC and GCC High.',
    responsibilities: [
      'Subject Matter Expert for Microsoft Defender for Endpoint.',
      'Handled complex escalations peers couldn\'t resolve, wrote the internal playbooks, and trained incoming engineers.',
      'Worked Tier 2/3 endpoint security escalations: process anomalies, registry changes, suspicious connections, and file activity. Reconstructed infection chains end to end.',
      'Wrote KQL queries in Defender Advanced Hunting to sweep for IOCs across large device populations. Cut investigation time by ~20%.',
      'Administered Intune endpoint security policies: Defender Antivirus, Firewall, ASR rules, and CIS baselines across Windows workstations and servers.',
      'Ran vulnerability assessments using Defender TVM. Tracked remediation with customer stakeholders and verified fixes.'
    ],
    technicalSkills: [
      'Microsoft Defender for Endpoint',
      'KQL (Kusto Query Language)',
      'Microsoft Intune',
      'Threat and Vulnerability Management (TVM)',
      'Attack Surface Reduction (ASR)',
      'CIS Benchmarks',
      'Defender Antivirus',
      'Firewall Policies',
      'Windows Endpoint Management',
      'GCC / GCC High'
    ],
    softSkills: ['Escalation Management', 'Technical Documentation', 'Problem Solving', 'Team Coordination'],
    frameworks: [],
    frameworkNote: null
  },
  {
    id: 3,
    title: 'IT Customer Support',
    company: 'Bellevue College',
    location: 'Bellevue, WA',
    period: 'December 2018 - December 2023',
    summary: 'Led 20+ student technicians providing Tier 1/2 IT support campus-wide. SCCM deployment, Active Directory administration, and escalation resolution.',
    responsibilities: [
      'Managed 20+ student technicians providing Tier 1/2 IT support across campus.',
      'Oversaw three lab environments: hardware setup, software deployment, and device lifecycle.',
      'Deployed and imaged Windows workstations campus-wide via SCCM: OS deployment, software distribution, and patch management.',
      'Managed macOS devices campus-wide using Jamf Pro: device enrollment, configuration profiles, and software deployment.',
      'Administered Active Directory: user provisioning, permissions, group membership, and MFA.',
      'Handled escalations beyond the team\'s scope: domain, hardware, and account issues requiring direct resolution.'
    ],
    technicalSkills: [
      'Active Directory',
      'Microsoft Endpoint Configuration Manager (SCCM)',
      'Jamf Pro',
      'OS Deployment',
      'Windows Endpoint Management',
      'macOS Management',
      'Group Policy',
      'MFA',
      'Patch Management',
      'Hardware Lifecycle Management'
    ],
    softSkills: ['Team Supervision', 'Operational Coordination', 'Knowledge Transfer'],
    frameworks: [],
    frameworkNote: null
  }
]

export const skillCategories = [
  {
    id: 1,
    name: 'Microsoft 365 & Cloud',
    skills: [
      'Microsoft 365 Administration',
      'Entra ID (Azure Active Directory)',
      'Conditional Access',
      'Exchange Online',
      'Microsoft Intune',
      'Microsoft Endpoint Configuration Manager (SCCM)',
      'PowerShell'
    ]
  },
  {
    id: 2,
    name: 'Security Tools',
    skills: [
      'Microsoft Defender for Endpoint',
      'Microsoft Defender for Office 365',
      'Microsoft Purview',
      'Microsoft Sentinel',
      'KQL (Kusto Query Language)',
      'Threat and Vulnerability Management (TVM)'
    ]
  },
  {
    id: 3,
    name: 'Security & Compliance',
    skills: [
      'Data Loss Prevention (DLP)',
      'Sensitivity Labels',
      'Insider Risk Management',
      'Email Authentication (DMARC, DKIM, SPF)',
      'Anti-phishing / Safe Links / Safe Attachments',
      'Attack Surface Reduction (ASR)',
      'CIS Benchmarks',
      'Incident Response',
      'SIEM'
    ]
  },
  {
    id: 4,
    name: 'Compliance Frameworks',
    skills: ['FedRAMP', 'NIST', 'HIPAA', 'PCI-DSS']
  },
  {
    id: 5,
    name: 'Identity & Access Management',
    skills: ['Active Directory', 'Entra ID', 'Conditional Access', 'MFA', 'RBAC', 'NTFS Permissions', 'SSO']
  },
  {
    id: 6,
    name: 'IT Administration',
    skills: [
      'Active Directory',
      'Group Policy',
      'Windows Server',
      'OS Deployment / Imaging',
      'Patch Management',
      'Hardware Lifecycle Management'
    ]
  },
  {
    id: 7,
    name: 'Networking',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'Wireshark', 'VPN', 'Firewall Configuration', 'Network Troubleshooting']
  },
  {
    id: 8,
    name: 'Scripting & Automation',
    skills: ['PowerShell', 'Python', 'Bash', 'Task Automation']
  },
  {
    id: 9,
    name: 'Operating Systems',
    skills: ['Windows Desktop', 'Windows Server', 'macOS', 'Linux']
  }
]

export const projects = [
  {
    id: 3,
    title: 'M365 Automation Module',
    description: 'A PowerShell module for automating Microsoft 365 user lifecycle management using the Microsoft Graph SDK. Covers onboarding, offboarding, license reporting, and inactive account audits.',
    technologies: ['PowerShell', 'Microsoft Graph SDK', 'Microsoft 365', 'Entra ID'],
    github: 'https://github.com/AbderrahmaneLahrichi/M365Automation',
    slug: '/projects/m365-automation'
  },
]

export const kqlQueries = [
  {
    id: 1,
    title: 'Suspicious Process Spawned by Office Application',
    scenario: 'Initial Access',
    tool: 'Microsoft Defender for Endpoint',
    description: 'Detects shell processes like PowerShell or cmd.exe launched by Office applications. A common indicator of malicious macro execution during phishing attacks.',
    query: `DeviceProcessEvents
| where InitiatingProcessFileName in~ ("winword.exe", "excel.exe", "powerpnt.exe", "outlook.exe")
| where FileName in~ ("powershell.exe", "cmd.exe", "wscript.exe", "cscript.exe", "mshta.exe")
| project Timestamp, DeviceName, AccountName, FileName, ProcessCommandLine, InitiatingProcessFileName
| order by Timestamp desc`
  },
  {
    id: 3,
    title: 'IOC Sweep: File Hash Across All Devices',
    scenario: 'Threat Hunting',
    tool: 'Microsoft Defender for Endpoint',
    description: 'Sweeps the entire device population for a known malicious file hash. Used during active incidents to determine blast radius.',
    query: `DeviceFileEvents
| where SHA256 == "PASTE_HASH_HERE"
| project Timestamp, DeviceName, FileName, FolderPath, InitiatingProcessFileName, InitiatingProcessCommandLine
| order by Timestamp desc`
  },
  {
    id: 4,
    title: 'Lateral Movement: Failed Logons Followed by Success',
    scenario: 'Lateral Movement',
    tool: 'Microsoft Defender for Endpoint',
    description: 'Detects brute-force or credential stuffing patterns where multiple failed network logons precede a successful one within the same hour.',
    query: `DeviceLogonEvents
| where LogonType in ("Network", "RemoteInteractive")
| summarize
    FailedAttempts = countif(ActionType == "LogonFailed"),
    SuccessAttempts = countif(ActionType == "LogonSuccess")
    by DeviceName, AccountName, RemoteIP, bin(Timestamp, 1h)
| where FailedAttempts > 5 and SuccessAttempts > 0
| order by FailedAttempts desc`
  },
  {
    id: 5,
    title: 'Inbound Emails with Executable Attachments',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Surfaces inbound emails carrying high-risk attachment types. Used to identify phishing campaigns delivering malicious payloads before detonation.',
    query: `EmailAttachmentInfo
| where FileType in ("exe", "js", "vbs", "bat", "ps1", "lnk", "hta")
| join kind=inner EmailEvents on NetworkMessageId
| where EmailDirection == "Inbound"
| project Timestamp, SenderFromAddress, RecipientEmailAddress, FileName, FileType, ThreatTypes, DeliveryAction
| order by Timestamp desc`
  },
  {
    id: 6,
    title: 'Delivered Phishing Emails with URL Clicks',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Finds emails classified as phish or spam that were delivered and subsequently had links clicked. Used to identify users who may have been compromised.',
    query: `EmailEvents
| where DeliveryAction == "Delivered"
| where ThreatTypes has_any ("Phish", "Spam")
| join kind=inner UrlClickEvents on NetworkMessageId
| project Timestamp, SenderFromAddress, RecipientEmailAddress, Subject, Url, IsClickedThrough
| order by Timestamp desc`
  },
  {
    id: 8,
    title: 'Rare External IP: Single Device Outbound Connection',
    scenario: 'C2 Detection',
    tool: 'Microsoft Defender for Endpoint',
    description: 'Finds outbound connections to public IPs that only one device has reached, with very few total connections. Legitimate services get traffic from many devices — an IP that only one device ever contacted is worth investigating.',
    query: `DeviceNetworkEvents
| where ActionType == "ConnectionSuccess"
| where RemoteIPType == "Public"
| summarize DeviceCount = dcount(DeviceId), ConnectionCount = count() by RemoteIP, RemotePort
| where DeviceCount == 1 and ConnectionCount < 3
| order by ConnectionCount asc`
  },
  {
    id: 14,
    title: 'Email Authentication Failures (DMARC, DKIM, SPF)',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Finds inbound emails failing DMARC, DKIM, SPF, or Microsoft composite authentication. Used to investigate spoofed senders and validate email authentication configuration across tenants.',
    query: `EmailEvents
| where Timestamp > ago(7d)
| where EmailDirection == "Inbound"
| where AuthenticationDetails has "dmarc=fail"
    or AuthenticationDetails has "dkim=fail"
    or AuthenticationDetails has "spf=fail"
| project
    Timestamp,
    SenderFromAddress,
    SenderMailFromAddress,
    SenderFromDomain,
    SenderIPv4,
    RecipientEmailAddress,
    Subject,
    DeliveryAction,
    DeliveryLocation,
    AuthenticationDetails,
    ThreatTypes,
    EmailActionPolicy
| sort by Timestamp desc`
  },
  {
    id: 15,
    title: 'Safe Attachments Malware Detection',
    scenario: 'Malware',
    tool: 'Microsoft Defender for Office 365',
    description: 'Surfaces emails where Safe Attachments detonated an attachment and found malware. Includes file hash, threat name, and final delivery action for forensic investigation.',
    query: `EmailAttachmentInfo
| where Timestamp > ago(7d)
| where ThreatTypes has "Malware"
    or DetectionMethods has "Safe Attachments"
| join kind=inner (
    EmailEvents
    | where Timestamp > ago(7d)
    | project NetworkMessageId, Subject, SenderFromAddress,
              DeliveryAction, DeliveryLocation, EmailActionPolicy, SenderIPv4
) on NetworkMessageId
| project
    Timestamp,
    SenderFromAddress,
    RecipientEmailAddress,
    Subject,
    FileName,
    FileType,
    SHA256,
    ThreatTypes,
    ThreatNames,
    DetectionMethods,
    DeliveryAction,
    DeliveryLocation,
    EmailActionPolicy
| sort by Timestamp desc`
  },
  {
    id: 16,
    title: 'ZAP Post-Delivery Removals',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Shows emails removed from mailboxes after delivery by Zero-hour Auto Purge. Used during incident investigation to confirm scope and verify that malicious emails were successfully remediated.',
    query: `EmailPostDeliveryEvents
| where Timestamp > ago(7d)
| where ActionType in ("Phish ZAP", "Malware ZAP")
| join kind=inner (
    EmailEvents
    | where Timestamp > ago(7d)
    | project NetworkMessageId, Subject, SenderFromAddress,
              SenderFromDomain, SenderIPv4, DeliveryLocation
) on NetworkMessageId
| project
    Timestamp,
    ActionType,
    ActionTrigger,
    ActionResult,
    RecipientEmailAddress,
    Subject,
    SenderFromAddress,
    SenderFromDomain,
    ThreatTypes,
    DetectionMethods,
    DeliveryLocation
| sort by Timestamp desc`
  },
  {
    id: 17,
    title: 'Sender Domain Sweep',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Pulls all emails from a specific sending domain with delivery verdicts, authentication results, and threat classifications. Used during active phishing investigations to scope campaign impact.',
    query: `let TargetDomain = "suspicious-domain.com";
EmailEvents
| where Timestamp > ago(30d)
| where SenderFromDomain =~ TargetDomain
    or SenderMailFromDomain =~ TargetDomain
| project
    Timestamp,
    SenderFromAddress,
    SenderMailFromAddress,
    SenderFromDomain,
    SenderIPv4,
    RecipientEmailAddress,
    Subject,
    DeliveryAction,
    DeliveryLocation,
    ThreatTypes,
    ThreatNames,
    DetectionMethods,
    AuthenticationDetails,
    EmailActionPolicy,
    AttachmentCount,
    UrlCount
| sort by Timestamp desc`
  },
  {
    id: 18,
    title: 'Safe Links Click Tracking',
    scenario: 'Phishing',
    tool: 'Microsoft Defender for Office 365',
    description: 'Tracks URL clicks through Safe Links including clicks allowed through despite a threat verdict. Used to identify users who may have accessed malicious content and need follow-up.',
    query: `UrlClickEvents
| where Timestamp > ago(7d)
| where ActionType == "ClickAllowed"
| where isnotempty(ThreatTypes)
| join kind=leftouter (
    EmailEvents
    | where Timestamp > ago(7d)
    | project NetworkMessageId, Subject, SenderFromAddress,
              SenderFromDomain, DeliveryAction
) on NetworkMessageId
| project
    Timestamp,
    AccountUpn,
    Url,
    ActionType,
    IsClickedThrough,
    ThreatTypes,
    DetectionMethods,
    Subject,
    SenderFromAddress,
    SenderFromDomain,
    IPAddress,
    UrlChain
| sort by Timestamp desc`
  },
  {
    id: 9,
    title: 'DLP Policy Matches by Policy and Workload',
    scenario: 'DLP',
    tool: 'Microsoft Purview',
    description: 'Summarizes DLP rule matches across all workloads over the last 30 days, grouped by policy name, workload, and user. Used to identify high-volume violators or policies generating the most noise.',
    query: `CloudAppEvents
| where Timestamp > ago(30d)
| where ActionType == "DLPRuleMatch"
| extend PolicyName = tostring(parse_json(tostring(RawEventData.PolicyDetails))[0].PolicyName)
| extend Workload = tostring(RawEventData.Workload)
| extend UserId = tostring(RawEventData.UserId)
| summarize EventCount = count() by PolicyName, Workload, UserId
| sort by EventCount desc`
  },
  {
    id: 10,
    title: 'Sensitivity Label Applied, Changed, or Removed',
    scenario: 'Information Protection',
    tool: 'Microsoft Purview',
    description: 'Tracks sensitivity label activity on files and emails. Captures label application, upgrades, downgrades, and removals. Useful for auditing label compliance and investigating unauthorized downgrades.',
    query: `CloudAppEvents
| where Timestamp > ago(30d)
| where ActionType in ("SensitivityLabelApplied", "SensitivityLabelUpdated", "SensitivityLabelRemoved")
| extend UserId = tostring(RawEventData.UserId)
| extend LabelId = tostring(parse_json(tostring(RawEventData.SensitivityLabelEventData)).SensitivityLabelId)
| extend OldLabelId = tostring(parse_json(tostring(RawEventData.SensitivityLabelEventData)).OldSensitivityLabelId)
| extend Workload = tostring(RawEventData.Workload)
| project Timestamp, UserId, ActionType, Workload, LabelId, OldLabelId, ObjectName, IPAddress
| sort by Timestamp desc`
  },
  {
    id: 11,
    title: 'Mailbox Items Purged from Recoverable Items',
    scenario: 'Mailbox Audit',
    tool: 'Microsoft Purview',
    description: 'Identifies hard-delete events where items were permanently purged from Recoverable Items. Critical for forensic investigations and verifying that litigation hold is preserving data correctly.',
    query: `CloudAppEvents
| where Timestamp > ago(30d)
| where Application == "Microsoft Exchange Online"
| where ActionType == "HardDelete"
| extend UserId = tostring(RawEventData.UserId)
| extend MailboxOwner = tostring(RawEventData.MailboxOwnerUPN)
| project Timestamp, UserId, MailboxOwner, ActionType, IPAddress, RawEventData
| sort by Timestamp desc`
  },
  {
    id: 12,
    title: 'Litigation Hold Changes on Mailboxes',
    scenario: 'Retention',
    tool: 'Microsoft Purview',
    description: 'Surfaces Exchange admin operations that modified litigation hold settings on mailboxes. Used to detect unauthorized removal of holds or audit compliance with legal preservation requirements.',
    query: `CloudAppEvents
| where Timestamp > ago(90d)
| where Application == "Microsoft Exchange Online"
| where ActionType == "Set-Mailbox"
| where RawEventData has "LitigationHold"
| extend Actor = AccountDisplayName
| extend Parameters = tostring(RawEventData.Parameters)
| project Timestamp, Actor, ActionType, Parameters, IPAddress, RawEventData
| sort by Timestamp desc`
  },
  {
    id: 13,
    title: 'Inbox Rule Changes',
    scenario: 'Exfiltration Detection',
    tool: 'Microsoft Purview',
    description: 'Detects new or modified inbox rules, a common technique attackers use to silently forward emails to an external address after compromising an account.',
    query: `CloudAppEvents
| where Timestamp > ago(30d)
| where Application == "Microsoft Exchange Online"
| where ActionType in ("UpdateInboxRules", "New-InboxRule", "Set-InboxRule")
| extend UserId = tostring(RawEventData.UserId)
| extend Parameters = tostring(RawEventData.Parameters)
| project Timestamp, AccountDisplayName, UserId, ActionType, Parameters, IPAddress, CountryCode
| sort by Timestamp desc`
  }
]

export const mdeCategories = [
  {
    id: 'device-health',
    label: 'Device Health',
    table: 'DeviceInfo',
    description: 'Query device sensor status, onboarding state, last seen timestamps, and exposure levels. Used during escalations to understand device posture before diving into telemetry.',
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
    table: 'DeviceTvmSecureConfigurationAssessment',
    description: 'Check Defender Antivirus signature versions, engine versions, AV mode, and configuration compliance across device populations. AV version data is stored under specific configuration IDs (scid-2010 for mode, scid-2011 for versions).',
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
    table: 'DeviceTvmSoftwareVulnerabilities',
    description: 'TVM queries for surfacing exploitable CVEs, missing patches, and zero-days. Used during vulnerability assessments, remediation tracking, and stakeholder reporting.',
    queries: [
      {
        id: 'tvm-1',
        title: 'Exploitable CVEs by Device (Critical and High)',
        description: 'Lists Critical and High severity CVEs where public exploit code is available, ranked by CVSS score. First priority list for remediation conversations with stakeholders.',
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
        description: 'Surfaces vulnerabilities tagged as ZeroDay or where no security update exists. Used to identify risk that cannot be remediated through patching alone.',
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
    table: 'DeviceTvmSoftwareInventory',
    description: 'Query installed software across device populations. Used to verify patch deployment, identify end-of-support software, and scope vulnerability impact during active investigations.',
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

export const learningItems = [
  {
    id: 1,
    group: 'microsoft',
    title: 'AZ-900: Microsoft Azure Fundamentals',
    progress: 100,
    status: 'completed',
    completedDate: 'March 2026',
    description: 'Microsoft certified in core Azure concepts: cloud models, pricing, SLAs, and foundational services across compute, networking, storage, and security.',
    badgeUrl: 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg'
  },
  {
    id: 2,
    group: 'microsoft',
    title: 'SC-200: Microsoft Security Operations Analyst',
    progress: 66,
    status: 'in-progress',
    completedDate: null,
    description: 'Over halfway through the SC-200 material. Core focus: Microsoft Sentinel, Defender for Endpoint, Defender for Office 365, KQL threat hunting, and incident response — tools I used daily in production at Microsoft.',
    badgeUrl: 'https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-associate-badge.svg'
  },
  {
    id: 3,
    group: 'comptia',
    title: 'CompTIA Security+ (SY0-701)',
    progress: 75,
    status: 'in-progress',
    completedDate: null,
    description: 'Studying CompTIA\'s vendor-neutral security certification covering threat analysis, cryptography, network security, and compliance frameworks. Complements my Microsoft stack depth with broader industry fundamentals.',
    badgeUrl: 'https://images.credly.com/images/d3cb5ac3-8bd2-471a-a27c-f447bf16da47/blob'
  }
]
