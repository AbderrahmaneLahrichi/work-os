from dotenv import load_dotenv
load_dotenv()

import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel, field_validator

from services.company_research import research_company
from services.claude_analysis import analyze_company
from services.siem_guidance import get_siem_guidance, SIEM_META
from services.report_generator import generate_report
from services.compliance_guidance import get_compliance_guidance

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="ThreatMapper API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:4173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    company_name: str

    @field_validator('company_name')
    @classmethod
    def validate_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Company name required')
        if len(v) > 100:
            raise ValueError('Company name too long')
        if not re.match(r"^[a-zA-Z0-9\s\.\,\-\&\']+$", v):
            raise ValueError('Invalid characters in company name')
        return v


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze")
@limiter.limit("10/minute")
async def analyze(request: Request, body: AnalyzeRequest):
    company_profile = await research_company(body.company_name)
    result = await analyze_company(company_profile)
    return result


class SiemRequest(BaseModel):
    technique_id: str
    technique_name: str
    technique_description: str
    siem: str

    @field_validator('technique_id')
    @classmethod
    def validate_technique_id(cls, v):
        v = v.strip()
        if not re.match(r'^T\d{4}(\.\d{3})?$', v):
            raise ValueError('Invalid technique ID format')
        return v

    @field_validator('siem')
    @classmethod
    def validate_siem(cls, v):
        allowed = list(SIEM_META.keys())
        if v not in allowed:
            raise ValueError(f'SIEM must be one of: {allowed}')
        return v


@app.get("/siems")
async def list_siems():
    return {
        k: {
            "name": v["name"],
            "platform": v["platform"],
            "query_language": v["query_language"],
        }
        for k, v in SIEM_META.items()
    }


class ReportRequest(BaseModel):
    company_name: str
    industry: str
    company_summary: str
    relevant_techniques: list

    @field_validator('company_name')
    @classmethod
    def validate_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Company name required')
        if len(v) > 100:
            raise ValueError('Company name too long')
        if not re.match(r"^[a-zA-Z0-9\s\.\,\-\&\']+$", v):
            raise ValueError('Invalid characters in company name')
        return v


@app.post("/report")
@limiter.limit("5/minute")
async def report(request: Request, body: ReportRequest):
    result = await generate_report(
        company_name=body.company_name,
        industry=body.industry,
        company_summary=body.company_summary,
        relevant_techniques=body.relevant_techniques,
    )
    return result


class ComplianceGuidanceRequest(BaseModel):
    framework: str
    control_id: str
    control_name: str
    control_description: str
    company_name: str
    industry: str


@app.post("/compliance-guidance")
@limiter.limit("20/minute")
async def compliance_guidance(request: Request, body: ComplianceGuidanceRequest):
    result = await get_compliance_guidance(
        framework=body.framework,
        control_id=body.control_id,
        control_name=body.control_name,
        control_description=body.control_description,
        company_name=body.company_name,
        industry=body.industry,
    )
    return result


@app.post("/siem-guidance")
@limiter.limit("20/minute")
async def siem_guidance(request: Request, body: SiemRequest):
    result = await get_siem_guidance(
        technique_id=body.technique_id,
        technique_name=body.technique_name,
        technique_description=body.technique_description,
        siem=body.siem,
    )
    return result
