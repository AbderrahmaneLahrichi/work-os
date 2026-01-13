# work-os for IT Systems Administrators

Managing infrastructure, security incidents, Active Directory, scripting projects, and device deployments with AI assistance.

## Why work-os for IT/Sysadmins?

As an IT systems administrator, you're juggling:
- **Security incidents** — alerts, investigations, remediation, post-mortems
- **Active Directory** — GPOs, user management, trusts, permissions
- **Scripting & automation** — PowerShell, Bash, scheduled tasks
- **Device management** — deployments, compliance, lifecycle
- **Infrastructure projects** — server builds, migrations, upgrades
- **Certifications & learning** — Security+, AD deep dives, new technologies

work-os helps you track it all without losing context between tickets, projects, and learning goals.

---

## Setup for IT/Sysadmins (10 minutes)

### 1. Define Your Goals

Open `GOALS.md` and add your IT objectives:

```markdown
# Goals

## This Quarter
1. Pass Security+ certification
2. Complete AD security hardening project
3. Automate [X] manual tasks with PowerShell
4. Maintain 95%+ device compliance rate
5. Reduce incident response time by 20%

## Key Metrics
- Compliance rate: [current] → [target]
- Scripts deployed: [count]
- MTTR (incidents): [current] → [target]
- Certification progress: [status]

## Focus Areas
- Endpoint security and compliance
- Active Directory administration
- PowerShell automation
- Security incident response
- Professional development
```

### 2. Tell Claude About Your Work

Just describe what you do. Claude will create your folder structure automatically.

```
You: "I'm an IT sysadmin. I handle security incidents, AD administration,
     PowerShell scripting, device deployments, and I'm studying for Security+."

Claude: "I'll set up your workspace for IT operations..."
```

Claude creates a structure tailored to YOUR work:
```
Active/
├── incidents/        # Security alerts, investigations, remediation
├── active-directory/ # GPOs, user management, permissions projects
├── scripting/        # PowerShell, Bash, automation projects
├── deployments/      # Device rollouts, imaging, provisioning
├── infrastructure/   # Server projects, migrations, maintenance
├── compliance/       # Policies, audits, remediation
└── learning/         # Certifications, training, documentation
```

**No manual setup required.** The structure adapts to what you actually manage.

---

## Daily IT Workflow

### Morning
```
You: "What should I work on today?"

AI: Here's your IT focus for today:

Urgent:
- Investigate failed login alerts (15 attempts, same user)
- Patch critical vulnerability on web servers (CVE-2026-XXXX)

Important:
- Continue AD GPO cleanup project
- Review device compliance report (dropped to 91%)
- Test PowerShell deployment script in staging

Learning:
- Security+ Chapter 12: Incident Response (30 min)

2 security alerts need attention first.
```

### During Work

Brain dump as issues arise:
```
"Add to backlog: User locked out again, third time this week — investigate"
"Add to backlog: Need to script bulk user creation for new department"
"Add to backlog: Server-DC02 showing high CPU, check services"
"Add to backlog: Good article on Kerberos delegation — save for later"
```

### End of Day
```
You: "Process my backlog"

AI: Created 4 items:

Security:
- Investigate repeat lockouts for [user] (urgent — potential compromise)
  → Active/incidents/

Scripting:
- Bulk user creation script for new department (important)
  → Active/scripting/

Infrastructure:
- Investigate Server-DC02 high CPU (important)
  → Active/infrastructure/

Learning:
- Kerberos delegation article (on your radar)
  → Learning/identity-concepts/
```

---

## IT-Specific Workflows

### Security Incident Response

Track security events from detection to resolution.

**Example conversation:**
```
You: "Security incident: Multiple failed RDP attempts from external IP on
      Server-WEB01, started 30 minutes ago"

AI: Created incident: Brute Force Attempt on Server-WEB01

Severity: High (external attack, production server)
Started: 30 minutes ago
Status: Active
Attack vector: RDP brute force
Source IP: [to be documented]

Immediate actions:
- [ ] Block source IP at firewall
- [ ] Check if any logins succeeded
- [ ] Review Server-WEB01 event logs
- [ ] Check other servers for same source IP
- [ ] Document timeline

Notification checklist:
- [ ] Security team/manager
- [ ] Document in ticketing system

What's the source IP? I'll help you track the investigation.
```

**Incident updates:**
```
You: "Blocked the IP, no successful logins, same IP tried 3 other servers"

AI: Updated incident: Brute Force Attempt

Status: Contained
Actions completed:
- Source IP blocked at firewall
- No successful authentication (confirmed)
- Scope expanded: 4 servers targeted

Updated severity: High (coordinated attack attempt)

Next steps:
- [ ] Add IP to permanent block list
- [ ] Review all 4 servers for indicators of compromise
- [ ] Check if IP is on threat intel lists
- [ ] Consider geo-blocking for RDP if not needed externally
- [ ] Write incident report

Post-incident tasks:
- [ ] Review RDP exposure — should it be internet-facing?
- [ ] Implement account lockout policy if not present
- [ ] Consider MFA for external access

Want me to draft the incident report?
```

**Incident history:**
```
You: "Show me security incidents this month"

AI: January 2026 Security Incidents:

High (2):
- Brute force attempt on RDP (Jan 15) — Contained
  4 servers targeted, no breach, IP blocked
- Phishing email with malicious attachment (Jan 8) — Resolved
  1 user clicked, endpoint isolated, no lateral movement

Medium (3):
- Failed MFA bypass attempts (Jan 5) — Resolved
- Unauthorized software installation (Jan 10) — Resolved
- Expired service account causing alerts (Jan 12) — Resolved

Patterns:
- 2 external attack attempts
- All incidents contained without breach
- Average response time: 45 minutes

Recommendations:
- Review RDP exposure (2nd brute force this quarter)
- Schedule phishing awareness training
- Audit service account expiration dates
```

### Active Directory Administration

Track AD projects, GPOs, and user management.

**Example conversation:**
```
You: "Starting project to clean up and document all GPOs — we have 150+
      and nobody knows what half of them do"

AI: Created project: GPO Cleanup and Documentation

Scope: 150+ GPOs requiring review
Goal: Document, consolidate, remove unused GPOs

Phases:
1. Inventory (Week 1-2)
   - Export all GPO names and links
   - Identify unlinked GPOs
   - Categorize by function (security, software, preferences)

2. Analysis (Week 2-3)
   - Review each GPO's settings
   - Identify duplicates and conflicts
   - Flag candidates for removal

3. Documentation (Week 3-4)
   - Document purpose of each active GPO
   - Create naming convention
   - Build GPO reference guide

4. Cleanup (Week 4-5)
   - Remove unlinked GPOs (after backup)
   - Consolidate duplicates
   - Rename to convention

5. Maintenance (Ongoing)
   - Establish GPO change process
   - Quarterly review schedule

First step: Run Get-GPO -All | Export-Csv to get inventory.
Want me to create the PowerShell command?
```

**AD troubleshooting:**
```
You: "User can't access shared folder, getting access denied, they're in
      the right security group"

AI: AD Access Troubleshooting Checklist:

Quick checks:
- [ ] Has user logged out/in since group membership change?
      (Kerberos ticket caches group membership)
- [ ] Check group membership is direct, not nested incorrectly
- [ ] Verify group has permissions on folder (not just share)

Commands to run:
1. Check user's current token groups:
   whoami /groups (run as user)

2. Check effective permissions:
   Right-click folder → Security → Advanced → Effective Access

3. Verify group membership:
   Get-ADGroupMember "GroupName" | Where {$_.Name -eq "Username"}

Common causes:
- Token not refreshed (log off/on or klist purge)
- NTFS vs Share permissions mismatch
- Nested group not processed correctly
- SID history issues after migration

What have you checked so far?
```

**AD security project:**
```
You: "Need to implement tiered admin model for AD security"

AI: Created project: AD Tiered Administration Model

Goal: Implement Microsoft's tiered admin model to protect privileged accounts

Tier Structure:
- Tier 0: Domain Controllers, AD admin accounts
- Tier 1: Member servers, server admins
- Tier 2: Workstations, helpdesk accounts

Implementation phases:

Phase 1: Assessment (2 weeks)
- [ ] Inventory all privileged accounts
- [ ] Map current admin practices
- [ ] Identify Tier 0 assets
- [ ] Document current attack surface

Phase 2: Design (2 weeks)
- [ ] Define tier boundaries
- [ ] Design OU structure for tiered accounts
- [ ] Plan PAW (Privileged Access Workstation) deployment
- [ ] Create GPOs for tier isolation

Phase 3: Implementation (4 weeks)
- [ ] Create tiered admin accounts
- [ ] Deploy authentication policies
- [ ] Configure logon restrictions
- [ ] Implement PAWs for Tier 0

Phase 4: Enforcement (2 weeks)
- [ ] Enable GPO restrictions
- [ ] Disable legacy admin accounts
- [ ] Train IT team on new model

This is a significant security improvement. Want to start with the assessment?
```

### Scripting & Automation

Track your PowerShell and Bash projects.

**Example conversation:**
```
You: "Need to write a script to automate new user onboarding — create AD
      account, add to groups, create home folder, send welcome email"

AI: Created script project: User Onboarding Automation

Goal: Automate new hire account provisioning

Components needed:
1. AD account creation
   - Standard attributes from HR data
   - Password generation
   - Correct OU placement

2. Group membership
   - Department-based groups
   - Standard user groups
   - License groups (M365, etc.)

3. Home folder
   - Create folder from template
   - Set NTFS permissions
   - Map in user profile

4. Email notification
   - Welcome email to user
   - Credentials to manager (secure method)
   - IT notification

Tasks:
- [ ] Define input format (CSV from HR?)
- [ ] Create New-ADUser parameter set
- [ ] Build group assignment logic
- [ ] Add home folder creation
- [ ] Integrate email sending
- [ ] Add error handling and logging
- [ ] Test in lab environment
- [ ] Document for team

Want to start with the basic AD user creation function?
```

**Script tracking:**
```
You: "Show me my scripting projects"

AI: Active Scripting Projects:

In Progress:
1. User Onboarding Automation (60%)
   - AD creation: Done
   - Group assignment: Done
   - Home folder: In progress
   - Email: Not started
   Next: Finish home folder function

2. Stale Computer Cleanup (40%)
   - Query: Done
   - Report generation: Done
   - Automated disable: Not started
   Next: Add safety checks before disable

3. Log Rotation Script (80%)
   - Archive: Done
   - Compression: Done
   - Cleanup: Done
   - Testing: In progress
   Next: Production deployment

Completed This Quarter:
- Bulk password reset tool
- Server health check report
- AD group membership audit

Scripts saved to: Active/scripting/
```

**Script documentation:**
```
You: "I finished the user onboarding script, document it"

AI: User Onboarding Script Documentation:

Script: New-UserOnboarding.ps1
Location: Active/scripting/user-onboarding/
Version: 1.0
Author: [You]
Created: January 2026

Purpose:
Automates new hire account provisioning from HR CSV input.

Functions:
- Creates AD user account with standard attributes
- Assigns department-based security groups
- Creates home folder with proper permissions
- Sends welcome email to user and credentials to manager

Parameters:
-CSVPath      : Path to HR new hire CSV
-WhatIf       : Preview mode, no changes made
-Verbose      : Detailed logging

Usage:
.\New-UserOnboarding.ps1 -CSVPath "C:\HR\newhires.csv"

Dependencies:
- ActiveDirectory module
- Send-MailMessage access
- Write access to home folder share

Logged to: C:\Logs\UserOnboarding\

Added to accomplishments:
"Built PowerShell automation for user onboarding — reduces
provisioning time from 30 minutes to 2 minutes per user"
```

### Device Deployments & Compliance

Track rollouts, imaging, and compliance.

**Example conversation:**
```
You: "Starting deployment of 50 new laptops for the sales team,
      need to track the whole process"

AI: Created project: Sales Team Laptop Deployment

Scope: 50 laptops
Department: Sales
Target completion: [date needed]

Phases:
1. Preparation
   - [ ] Receive hardware (ETA?)
   - [ ] Verify asset tags and serials
   - [ ] Update inventory system
   - [ ] Prepare deployment image

2. Configuration
   - [ ] Apply standard image
   - [ ] Install sales-specific software
   - [ ] Configure VPN and security tools
   - [ ] Join to domain / Intune enrollment

3. Deployment
   - [ ] Schedule with sales team
   - [ ] Assign devices to users
   - [ ] Distribute hardware
   - [ ] Collect old devices if refresh

4. Validation
   - [ ] Verify compliance status
   - [ ] Confirm all apps working
   - [ ] Check security baseline applied
   - [ ] Close deployment tickets

Tracking:
- Deployed: 0/50
- Compliant: 0/50
- Issues: None yet

What's the hardware arrival date?
```

**Compliance tracking:**
```
You: "Compliance dropped to 88%, need to fix it"

AI: Device Compliance Analysis:

Current: 88% (target: 95%)
Non-compliant devices: 47 of 392

Breakdown by issue:
- Missing patches: 23 devices
- Encryption not enabled: 12 devices
- Antivirus definitions outdated: 8 devices
- Policy not applied: 4 devices

Top offenders by department:
- Sales: 18 devices (field laptops)
- Engineering: 12 devices (lab machines)
- Finance: 8 devices
- Other: 9 devices

Remediation plan:
1. Urgent (today):
   - [ ] Push patch deployment to 23 devices
   - [ ] Force AV definition update on 8 devices

2. This week:
   - [ ] Investigate 12 encryption failures
   - [ ] Check 4 devices not receiving policy
   - [ ] Contact Sales about field laptop check-ins

3. Ongoing:
   - [ ] Set up compliance alerts at 93%
   - [ ] Weekly compliance review meeting

Want me to generate the non-compliant device list for remediation?
```

### Certification & Learning Tracking

Track your professional development.

**Example conversation:**
```
You: "I'm studying for Security+, help me track my progress"

AI: Created learning project: CompTIA Security+ (SY0-701)

Exam Details:
- Code: SY0-701
- Questions: 90 max
- Duration: 90 minutes
- Passing: 750/900
- Target date: [when do you want to take it?]

Domain breakdown:
1. General Security Concepts (12%)
2. Threats, Vulnerabilities & Mitigations (22%)
3. Security Architecture (18%)
4. Security Operations (28%)
5. Security Program Management (20%)

Study tracking:
- [ ] Domain 1: General Security Concepts
- [ ] Domain 2: Threats & Vulnerabilities
- [ ] Domain 3: Security Architecture
- [ ] Domain 4: Security Operations
- [ ] Domain 5: Program Management
- [ ] Practice exams (aim for 85%+)

Resources:
- Primary study guide: [which one?]
- Practice tests: [which platform?]
- Lab environment: [home lab?]

Daily goal: 30-60 minutes study time

When are you planning to take the exam?
```

**Learning updates:**
```
You: "Finished Security+ domain 2, scored 78% on practice test"

AI: Updated Security+ progress:

Completed:
- [x] Domain 1: General Security Concepts
- [x] Domain 2: Threats, Vulnerabilities & Mitigations (22%)

In progress:
- [ ] Domain 3: Security Architecture (18%)

Practice test scores:
- Domain 1: 82%
- Domain 2: 78%
- Average: 80%

Analysis:
Domain 2 score (78%) is passing but has room for improvement.
Key areas in Domain 2:
- Malware types and indicators
- Social engineering attacks
- Vulnerability types
- Mitigation techniques

Recommendation:
- Review weak areas in Domain 2 before moving on
- Target 85%+ on practice tests for exam confidence

Progress: 34% of domains complete
On track for [target date]?

What topics in Domain 2 felt weakest?
```

**Learning time tracking:**
```
You: "What's my study progress this month?"

AI: January 2026 Learning Summary:

Security+ Progress:
- Domains completed: 2 of 5 (40%)
- Study sessions: 15
- Total time: 12 hours
- Practice test average: 80%

This week:
- Mon: Domain 2 chapter 5 (45 min)
- Tue: Practice questions (30 min)
- Wed: Domain 2 chapter 6 (45 min)
- Thu: Domain 2 review (30 min)
- Fri: Practice test (60 min)

Other learning:
- PowerShell article on error handling (20 min)
- AD delegation deep dive (30 min)
- Kerberos video series (1 hour)

At current pace:
- Domain 3-5: ~3 more weeks
- Ready for exam: Early February

Ahead/behind schedule: On track

Want to adjust your daily study goal?
```

---

## What Counts as Urgent for IT

- **Active security incident** — breach, attack, compromise
- **System down** — production outage, critical service failure
- **Critical vulnerability** — actively exploited CVE
- **Compliance deadline** — audit due, policy enforcement date
- **User blocked** — executive or VIP can't work

## What Counts as Important for IT

- **Security hardening** — patching, configuration, policies
- **Infrastructure projects** — AD, servers, networking
- **Automation** — scripts that save time
- **Compliance maintenance** — keeping devices healthy
- **Documentation** — runbooks, procedures, diagrams
- **Learning** — certifications, skill development

---

## IT Communication Workflows

### Incident Reports
```
You: "Help me write the incident report for the brute force attack"

AI: Security Incident Report

Incident ID: SEC-2026-003
Date: January 15, 2026
Severity: High
Status: Resolved

Summary:
Brute force RDP attack targeting 4 production servers from external IP.
No successful authentication. Contained within 45 minutes.

Timeline:
- 14:30 - Alert triggered: 15 failed RDP attempts on Server-WEB01
- 14:35 - Investigation started
- 14:45 - Source IP identified, found attempts on 3 additional servers
- 14:50 - IP blocked at perimeter firewall
- 15:00 - Confirmed no successful logins across all 4 servers
- 15:15 - Incident contained, monitoring continues

Root Cause:
RDP exposed to internet on legacy servers. Attacker attempted
credential stuffing from [country] IP address.

Impact:
- No data breach
- No unauthorized access
- 4 servers targeted
- No business disruption

Remediation:
1. Source IP permanently blocked
2. RDP exposure under review for all servers
3. Geo-blocking implementation planned

Recommendations:
1. Remove internet-facing RDP where possible
2. Implement VPN requirement for remote RDP
3. Deploy MFA for all remote access
4. Review firewall rules quarterly

Prepared by: [Your name]
Date: January 15, 2026
```

### Your IT Communication Style

AI learns how you write technical documentation, emails, and reports.

**Example conversation:**
```
You: "Here are some of my incident reports and technical docs — learn my style"

AI: Analyzed your IT communication style:

Technical writing:
- You lead with impact/summary
- Step-by-step with specific times and details
- Commands and code in monospace blocks
- You document what you tried, not just what worked

Report structure:
- Executive summary at top
- Timeline in chronological order
- Root cause clearly stated
- Recommendations numbered and actionable

Email style:
- Short subject lines with ticket numbers
- Context in first sentence
- Action items bolded or bulleted
- You sign off with ETA when applicable

Tone:
- Direct, no filler words
- Technical with non-technical summaries for managers
- You quantify impact (users affected, downtime duration)

I'll match this style for all technical communications.
```

**Status updates:**
```
You: "Draft a status update on the GPO cleanup project for my manager"

AI: Here's a status update in your style:

Subject: GPO Cleanup Project — Week 2 Update

Current status: On track

Progress:
- Inventory complete: 156 GPOs documented
- Unlinked GPOs identified: 34 (candidates for removal)
- Duplicate GPOs found: 12 pairs
- Documentation: 40% complete

This week completed:
- Exported all GPO settings to spreadsheet
- Categorized by function (security: 45, software: 38, prefs: 73)
- Identified 8 conflicting GPOs causing issues

Next week:
- Complete documentation on security GPOs
- Begin consolidation of duplicates
- Test removal of 5 unlinked GPOs in lab

Blockers: None

ETA for completion: February 15

Let me know if you want more detail on any area.

[Your name]
```

---

## Tips for IT Professionals

1. **Document as you troubleshoot** — Your future self needs the notes
2. **Track all incidents** — Patterns reveal systemic issues
3. **Version your scripts** — Comment what changed and why
4. **Log your learning** — Certification prep counts as work
5. **Automate the repetitive** — If you do it twice, script it
6. **Test in lab first** — Production is not a test environment

---

## Getting Started Checklist

- [ ] Create `GOALS.md` with your IT objectives and certifications
- [ ] Set up `Active/` with incidents, AD, scripting, deployments, compliance
- [ ] Brain dump current projects and issues
- [ ] Document any open incidents
- [ ] List scripts in progress
- [ ] Add certification goals to learning tracking
- [ ] Ask "What should I work on today?"

---

## Related Resources

- [Project Tracking](../use-cases/project-tracking/) — For infrastructure projects
- [Meeting Notes](../use-cases/meeting-notes/) — For change advisory boards, team syncs
- [Professional Development](../use-cases/professional-development/) — For certifications
- [Career Portfolio](../use-cases/career-portfolio/) — For documenting your IT wins
