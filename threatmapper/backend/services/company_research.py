import re
import socket
import ipaddress
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup

PRIVATE_NETWORKS = [
    ipaddress.ip_network('127.0.0.0/8'),
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('169.254.0.0/16'),
    ipaddress.ip_network('::1/128'),
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}


def is_safe_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ('http', 'https'):
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)
        for network in PRIVATE_NETWORKS:
            try:
                if ip in network:
                    return False
            except TypeError:
                continue
        return True
    except Exception:
        return False


async def fetch_text(url: str, client: httpx.AsyncClient) -> str:
    if not is_safe_url(url):
        return ""
    try:
        resp = await client.get(url, headers=HEADERS, timeout=10, follow_redirects=True)
        if resp.status_code >= 400:
            return ""
        soup = BeautifulSoup(resp.text, 'lxml')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()
        text = ' '.join(soup.get_text(separator=' ', strip=True).split())
        return text[:5000]
    except Exception:
        return ""


async def find_website(name: str, client: httpx.AsyncClient) -> str:
    slug = re.sub(r'[^a-z0-9]', '', name.lower())
    for url in [f"https://www.{slug}.com", f"https://{slug}.com", f"https://www.{slug}.io"]:
        try:
            if not is_safe_url(url):
                continue
            resp = await client.head(url, timeout=5, follow_redirects=True)
            if resp.status_code < 400:
                return str(resp.url)
        except Exception:
            continue
    try:
        ddg = f"https://html.duckduckgo.com/html/?q={name}+official+website"
        resp = await client.get(ddg, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(resp.text, 'lxml')
        link = soup.find('a', class_='result__url')
        if link:
            href = link.get('href', '')
            if href and is_safe_url(href):
                return href
    except Exception:
        pass
    return ""


async def research_company(company_name: str) -> dict:
    async with httpx.AsyncClient() as client:
        website = await find_website(company_name, client)
        homepage = ""
        about = ""
        if website:
            homepage = await fetch_text(website, client)
            base = website.rstrip('/')
            for path in ['/about', '/about-us', '/company', '/who-we-are']:
                about = await fetch_text(base + path, client)
                if len(about) > 300:
                    break
        return {
            "company_name": company_name,
            "website": website,
            "homepage_content": homepage,
            "about_content": about,
        }
