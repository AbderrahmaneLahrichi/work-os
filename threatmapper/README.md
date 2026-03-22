# ThreatMapper

ThreatMapper takes a company name, researches their public web presence, then uses Claude AI to map their security risk profile to MITRE ATT&CK techniques and relevant compliance frameworks. The output is a visual threat matrix, compliance framework breakdown, and a prioritized implementation checklist.

## What it does

1. Scrapes the company's homepage and about page for context
2. Sends that profile to Claude with the full MITRE ATT&CK Enterprise technique list
3. Claude identifies 15-25 relevant techniques with relevance scores, detection guidance, and tool recommendations
4. The frontend renders a full ATT&CK matrix (color-coded by score), a compliance sidebar, and a checklist grouped by priority

## Tech Stack

- **Backend**: Python, FastAPI, httpx, BeautifulSoup4, Anthropic Python SDK
- **Frontend**: React 18, Vite, Tailwind CSS
- **AI**: Claude claude-sonnet-4-6 via Anthropic API

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- An Anthropic API key

### Backend

```bash
cd threatmapper/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
python scripts/fetch_mitre.py   # Downloads MITRE ATT&CK data (~30 MB, runs once)
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd threatmapper/frontend
npm install
npm run dev
```

Open http://localhost:5173

## Usage

1. Enter a company name in the search box (or click an example chip)
2. Wait 20-60 seconds while the app researches the company and runs analysis
3. Browse the ATT&CK matrix — colored cells indicate flagged techniques
4. Click any technique cell to see why it's relevant, what to detect, and which tools address it
5. Use the right sidebar to review applicable compliance frameworks and the implementation checklist

## Security Notes

- Never commit your `.env` file. It is listed in `.gitignore`.
- The scraper includes SSRF protection: it blocks requests to private IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16).
- API endpoints are rate-limited to 10 requests per minute per IP.
- Input is validated to alphanumeric + basic punctuation, max 100 characters.
