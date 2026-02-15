export const personalInfo = {
  name: 'Abderrahmane Lahrichi',
  location: 'Bellevue, WA',
  email: 'a.lahrichi224@gmail.com',
  phone: '(425) 435-9217',
  linkedin: 'https://www.linkedin.com/in/abderrahmane-lahrichi/',
  github: 'https://github.com/AbderrahmaneLahrichi'
}

export const experiences = [
  {
    id: 1,
    title: 'Security and Compliance Engineer',
    company: 'Microsoft (via LTIMindtree)',
    location: 'Bellevue, WA',
    period: 'September 2024 - August 2025',
    summary: 'Supported customer environments by enforcing security policies and compliance controls, driving incident remediation and cross-functional security improvements.',
    responsibilities: [
      'Applied and enforced state, federal, and organizational information security policies by configuring authentication standards and security controls',
      'Conducted root cause analysis on complex incidents during on-call rotations, identifying recurring failures and driving lasting remediation',
      'Collaborated with security specialists and cross-functional teams to assess emerging threats and implement proactive policy updates',
      'Explained complex technical findings to both technical teams and leadership with clear, actionable recommendations'
    ],
    technicalSkills: ['Microsoft Entra ID', 'Azure AD', 'Conditional Access', 'MFA', 'PowerShell', 'ServiceNow', 'Splunk'],
    softSkills: ['Cross-functional Communication', 'Stakeholder Reporting', 'Policy Interpretation', 'Incident Leadership'],
    frameworks: [
      { name: 'FedRAMP', role: 'primary' },
      { name: 'NIST 800-53', role: 'primary' },
      { name: 'HIPAA', role: 'familiar' },
      { name: 'SOC 2', role: 'familiar' }
    ],
    frameworkNote: 'Worked within compliance-driven environments governed by federal and organizational security standards.'
  },
  {
    id: 2,
    title: 'Endpoint Security Engineer',
    company: 'Microsoft (via LTIMindtree)',
    location: 'Bellevue, WA',
    period: 'December 2023 - September 2024',
    summary: 'Managed advanced endpoint escalations for enterprise customers, performing deep telemetry analysis and cross-team coordination.',
    responsibilities: [
      'Managed Tier 2 and Tier 3 escalations across 300+ enterprise deployments while maintaining SLA compliance',
      'Investigated complex endpoint issues through process, registry, network, and file telemetry analysis',
      'Coordinated with network specialists, developers, and security teams to prevent recurring problems',
      'Maintained IT systems across Windows clients and servers ensuring timely service delivery',
      'Developed internal knowledge base documentation for recurring escalation patterns, reducing repeat Tier 2 ticket volume'
    ],
    technicalSkills: ['Microsoft Defender for Endpoint', 'SCCM/MECM', 'Intune', 'Wireshark', 'Windows Event Logs', 'PowerShell'],
    softSkills: ['Escalation Management', 'Technical Documentation', 'Problem Solving', 'Team Coordination'],
    frameworks: [
      { name: 'NIST 800-53', role: 'familiar' },
      { name: 'ITIL', role: 'familiar' }
    ],
    frameworkNote: 'Operated within enterprise security and ITIL service management frameworks.'
  },
  {
    id: 3,
    title: 'Information Technology Customer Support',
    company: 'Bellevue College',
    location: 'Bellevue, WA',
    period: 'December 2018 - December 2023',
    summary: 'Provided comprehensive desktop support and identity management in a domain environment, handling system deployments and hardware lifecycle management.',
    responsibilities: [
      'Provided desktop support by troubleshooting Windows systems, mobile devices, and peripherals in domain environments',
      'Managed user access and authentication in Active Directory including permissions, MFA setup, and recovery',
      'Deployed systems using SCCM for software distribution, patch management, and OS imaging',
      'Collaborated with hardware asset team for end-of-life tracking and inventory management',
      'Documented support procedures and onboarding workflows to streamline team knowledge transfer'
    ],
    technicalSkills: ['Active Directory', 'SCCM', 'Group Policy', 'WSUS', 'Windows Desktop & Server', 'DHCP', 'DNS'],
    softSkills: ['Customer Service', 'Knowledge Sharing', 'Time Management', 'Team Collaboration'],
    frameworks: [
      { name: 'FERPA', role: 'familiar' }
    ],
    frameworkNote: 'Worked within an educational institution subject to FERPA data privacy requirements.'
  }
]

export const skillCategories = [
  {
    id: 1,
    name: 'Security & Compliance',
    skills: [
      'Security Policy Enforcement',
      'Compliance (Federal, State, Org)',
      'Incident Response',
      'Root Cause Analysis'
    ]
  },
  {
    id: 2,
    name: 'Compliance Frameworks',
    skills: ['FedRAMP', 'NIST 800-53', 'HIPAA', 'FERPA', 'SOC 2', 'ISO 27001']
  },
  {
    id: 3,
    name: 'Endpoint & Device Management',
    skills: ['SCCM/MECM', 'Microsoft Intune', 'WSUS', 'Group Policy', 'Device Imaging']
  },
  {
    id: 4,
    name: 'Identity & Access',
    skills: ['Active Directory', 'Entra ID (Azure AD)', 'MFA', 'NTFS Permissions']
  },
  {
    id: 5,
    name: 'Networking',
    skills: ['TCP/IP', 'DNS', 'DHCP', 'Wireshark', 'Remote Troubleshooting']
  },
  {
    id: 6,
    name: 'Scripting & Automation',
    skills: ['PowerShell', 'Python', 'Bash']
  },
  {
    id: 7,
    name: 'Operating Systems',
    skills: ['Windows (Desktop & Server)', 'macOS', 'Linux']
  }
]

export const projects = [
  {
    id: 1,
    title: 'Work-OS Framework',
    description: 'AI-powered productivity and workflow management system that uses intelligent agents to automate task organization, documentation generation, and project tracking.',
    technologies: ['React', 'Vite', 'AI Agents', 'Markdown'],
    github: 'https://github.com/AbderrahmaneLahrichi/work-os'
  },
  {
    id: 2,
    title: 'Blackjack Game',
    description: 'A player vs. computer blackjack game built with a standard 52 card deck. Features card shuffling, hit/stand mechanics, and dealer AI that plays by standard casino rules.',
    technologies: ['Python', 'Pygame'],
    github: 'https://github.com/AbderrahmaneLahrichi/Blackjack_Game'
  },
  {
    id: 3,
    title: 'Tic Tac Toe',
    description: 'A two-player tic tac toe game with a visual interface. Players take turns clicking to place X or O, with win detection and tie announcements.',
    technologies: ['Python', 'Pygame'],
    github: 'https://github.com/AbderrahmaneLahrichi/Tic_Tac_Toe-Game'
  }
]

export const learningItems = [
  {
    id: 1,
    title: 'AZ-900: Azure Fundamentals',
    progress: 70,
    status: 'in-progress',
    completedDate: null,
    description: 'Microsoft Azure cloud fundamentals covering core services, security, privacy, compliance, and pricing.'
  },
  {
    id: 2,
    title: 'CompTIA Security+ (SY0-701)',
    progress: 80,
    status: 'in-progress',
    completedDate: null,
    description: 'Comprehensive security certification covering threats, architecture, operations, and incident response.'
  }
]
