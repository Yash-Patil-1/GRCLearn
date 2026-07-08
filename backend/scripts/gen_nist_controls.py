#!/usr/bin/env python3
"""
NIST 800-53 Rev 5 Control Generator
Downloads the OSCAL JSON catalog and transforms controls into the project schema.
Outputs: GRCLearn/backend/data/frameworks/nist_800_53_rev5.json
"""

import json
import os
import re
import urllib.request

# ── Source ──
OSCAL_URL = (
    "https://raw.githubusercontent.com/usnistgov/oscal-content/master/"
    "nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json"
)

# ── Output ──
# Resolve from scripts/ -> ../.. -> data/frameworks/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "data", "frameworks"))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "nist_800_53.json")

# ── Priority mapping by family ──
HIGH_PRIORITY_FAMILIES = {"ac", "at", "au", "cm", "cp", "ia", "ir", "sc", "si", "ra"}
MEDIUM_PRIORITY_FAMILIES = {"ca", "pe", "pl", "pm", "ps", "sa", "sr"}

# ── ISO 27001 mappings for common controls (will auto-generate where possible) ──
# These are manually curated for the most important controls
ISO_MAPPINGS = {
    "ac": {"1": ["A.5.1"], "2": ["A.5.15","A.5.16","A.5.18"], "3": ["A.5.15","A.8.3"],
           "6": ["A.5.15","A.8.2"], "17": ["A.6.7","A.8.1"]},
    "at": {"1": ["A.6.3"], "2": ["A.6.3"], "3": ["A.6.3"]},
    "au": {"2": ["A.8.15"], "3": ["A.8.15"], "6": ["A.8.15","A.8.16"]},
    "cm": {"2": ["A.8.9"], "3": ["A.8.32"], "6": ["A.8.9"], "8": ["A.5.9"]},
    "cp": {"1": ["A.5.29"], "2": ["A.5.29","A.5.30"], "9": ["A.8.13"]},
    "ia": {"2": ["A.5.16","A.8.5"], "5": ["A.5.17","A.8.5"], "8": ["A.8.5"]},
    "ir": {"1": ["A.5.24","A.5.25","A.5.26"], "4": ["A.5.24","A.5.25"], "8": ["A.5.24"]},
    "ra": {"3": ["A.5.7","A.8.8"], "5": ["A.8.8"]},
    "sc": {"7": ["A.8.20","A.8.21"], "8": ["A.8.23"], "12": ["A.5.33","A.8.11"]},
    "si": {"2": ["A.8.8"], "3": ["A.8.7"], "4": ["A.8.16"], "7": ["A.8.20"]},
    "pe": {"1": ["A.7.1"], "2": ["A.7.1","A.7.2"], "3": ["A.7.3"]},
    "ps": {"1": ["A.5.5","A.5.6"], "3": ["A.5.5","A.5.6"]},
    "ca": {"2": ["A.8.1","A.5.7"], "7": ["A.5.7"]},
    "pl": {"1": ["A.5.1"]},
    "sa": {"9": ["A.5.19","A.5.21","A.5.22"], "10": ["A.5.19"]},
    "sr": {"1": ["A.5.5","A.5.19"]},
}

# ── CIS v8 mappings ──
CIS_MAPPINGS = {
    "ac": {"1": ["3.3"], "2": ["5.1","5.2","5.3"], "3": ["3.3","6.8"],
           "6": ["5.4","6.8"], "17": ["3.10","6.3"]},
    "at": {"1": ["14.1","14.2"], "2": ["14.3"]},
    "au": {"2": ["8.2","8.5"], "3": ["8.1"], "6": ["8.11","8.12"]},
    "cm": {"2": ["4.1","4.2"], "3": ["4.1"], "6": ["4.1","4.2"], "8": ["2.1","2.2","2.3"]},
    "cp": {"9": ["11.1","11.2"], "10": ["11.3"]},
    "ia": {"2": ["5.2","6.3","6.4"], "5": ["5.1","5.2"]},
    "ir": {"1": ["17.1","17.2"], "4": ["17.3","17.4","17.5"], "8": ["17.6"]},
    "ra": {"3": ["7.1","7.5"], "5": ["7.1","7.2","7.3","7.4"]},
    "sc": {"7": ["4.4","13.1"], "8": ["13.2"], "12": ["12.1","12.2","12.3"]},
    "si": {"2": ["7.1","7.2","7.3"], "3": ["10.5","10.6","10.7"], "4": ["8.11","8.12"]},
    "ca": {"2": ["18.1","18.2"], "7": ["18.3"]},
    "sa": {"9": ["15.1","15.2"], "10": ["15.2"]},
    "pe": {"1": ["3.11","3.12"]},
    "ps": {"1": ["14.7"], "3": ["14.6"]},
    "pl": {"1": ["18.5"]},
}


def extract_prose(parts, part_name="statement"):
    """Extract prose text from a part by name, handling sub-parts."""
    for part in parts:
        if part.get("name") == part_name:
            prose = part.get("prose", "")
            # Check for sub-parts (items)
            subparts = part.get("parts", [])
            if subparts:
                items = []
                for sp in subparts:
                    sp_prose = sp.get("prose", "")
                    if sp_prose:
                        items.append(sp_prose.strip())
                if items:
                    return " ".join(items)
            return prose.strip() if prose else ""
        # Also check sub-parts recursively
        subparts = part.get("parts", [])
        if subparts:
            result = extract_prose(subparts, part_name)
            if result:
                return result
    return ""


def extract_guidance_bullets(parts):
    """Extract guidance text and split into implementation bullet points."""
    guidance = extract_prose(parts, "guidance")
    if not guidance:
        return ["Follow organization-defined procedures for this control."]
    
    # Clean and split into bullet points
    guidance = re.sub(r'\s+', ' ', guidance).strip()
    
    # Split on periods or numbered items
    sentences = re.split(r'(?<=\.)\s+', guidance)
    bullets = [s.strip() for s in sentences if len(s.strip()) > 15]
    
    # Limit to 5 bullets max, take the most substantive
    if len(bullets) > 5:
        bullets = bullets[:5]
    
    if not bullets:
        bullets = [guidance[:120]]
    
    return bullets


def extract_related(parts):
    """Extract related controls from parts."""
    related = []
    for part in parts:
        if part.get("name") == "statement":
            prose = part.get("prose", "")
            # Look for references like (AC-2, AC-3, IA-2)
            matches = re.findall(r'([A-Z]{2,3}-\d+(?:\(\d+\))?)', prose)
            related.extend(matches[:5])
    return related


def determine_priority(family_id, control_id):
    """Determine control priority based on family and control number."""
    num = int(re.search(r'\d+', control_id).group()) if re.search(r'\d+', control_id) else 99
    if num <= 5:
        return "high"
    if family_id in HIGH_PRIORITY_FAMILIES:
        return "high" if num <= 15 else "medium"
    if family_id in MEDIUM_PRIORITY_FAMILIES:
        return "medium"
    return "low"


def get_control_number(control_id):
    """Extract just the number from a control ID like 'ac-1' → '1'."""
    m = re.search(r'(\d+)', control_id)
    return m.group(1) if m else ""


def build_mappings(family_id, control_num):
    """Build cross-framework mappings from curated dictionaries."""
    fw_id = family_id.lower()
    mappings = {}
    
    if fw_id in ISO_MAPPINGS and control_num in ISO_MAPPINGS[fw_id]:
        mappings["iso_27001"] = ISO_MAPPINGS[fw_id][control_num]
    
    if fw_id in CIS_MAPPINGS and control_num in CIS_MAPPINGS[fw_id]:
        mappings["cis_v8"] = CIS_MAPPINGS[fw_id][control_num]
    
    return mappings


def format_control_id(control_id):
    """Convert 'ac-1' to 'AC-1'."""
    parts = control_id.split("-", 1)
    if len(parts) == 2:
        return f"{parts[0].upper()}-{parts[1]}"
    return control_id.upper()


def family_id_from_control(control_id):
    """Extract family prefix from 'ac-1' → 'AC'."""
    parts = control_id.split("-", 1)
    return parts[0].upper() if parts else ""


def enhance_description(control_id, title, statement):
    """Create a good description combining statement and context."""
    if not statement:
        return f"Implement {title} controls for the organization."
    # Clean up
    desc = re.sub(r'\s+', ' ', statement).strip()
    if len(desc) > 400:
        desc = desc[:397] + "..."
    return desc


def main():
    print("Downloading NIST 800-53 Rev 5 OSCAL catalog...")
    with urllib.request.urlopen(OSCAL_URL) as f:
        data = json.load(f)
    
    groups = data["catalog"]["groups"]
    
    controls_out = []
    total_controls = 0
    
    for group in groups:
        family_id = group["id"].upper()
        family_name = group["title"]
        
        for control in group.get("controls", []):
            cid = control["id"]  # e.g., "ac-1"
            title = control["title"]
            parts = control.get("parts", [])
            
            # Extract statement/description
            statement = extract_prose(parts, "statement")
            description = enhance_description(cid, title, statement)
            
            # Extract guidance for implementation bullets
            guidance = extract_guidance_bullets(parts)
            
            # Extract related controls
            related = extract_related(parts)
            
            # Build ID
            formatted_cid = format_control_id(cid)
            control_num = get_control_number(cid)
            full_id = f"nist-{cid}"
            
            # Priority
            priority = determine_priority(family_id.lower(), cid)
            
            # Mappings
            mappings = build_mappings(family_id.lower(), control_num)
            
            # Audit evidence (generic per family)
            audit_evidence_templates = {
                "AC": ["Access control configuration", "User access reviews", "Account provisioning records"],
                "AU": ["Audit log configuration", "Sample audit logs", "Log retention records"],
                "AT": ["Training records", "Completion certificates", "Training materials"],
                "CM": ["Baseline configurations", "Change request records", "Configuration audit reports"],
                "CP": ["Continuity plan", "Test/exercise results", "Maintenance records"],
                "IA": ["Authentication configuration", "MFA enrollment records", "Credential management policy"],
                "IR": ["Incident response plan", "Incident reports", "Tabletop exercise results"],
                "RA": ["Risk assessment reports", "Vulnerability scan results", "Risk register"],
                "SC": ["Network diagrams", "Firewall rule sets", "Encryption configuration"],
                "SI": ["Patch management records", "Integrity monitoring logs", "Flaw remediation records"],
                "PE": ["Visitor logs", "Physical access records", "Equipment inventory"],
                "PS": ["Background check records", "Personnel files", "NDA agreements"],
                "CA": ["Assessment reports", "Plan of action and milestones", "Authorization documents"],
                "PL": ["Security plans", "Privacy plans", "Plan update records"],
                "PM": ["Program management documentation", "Governance records"],
                "SA": ["Vendor assessment records", "Contracts with security clauses", "Supply chain risk docs"],
                "SR": ["Supply chain risk assessment", "Vendor inventory", "Supplier agreements"],
            }
            audit_evidence = audit_evidence_templates.get(family_id, ["Policy documentation", "Implementation records", "Compliance reports"])
            
            # Risk addressed (generic by family)
            risk_addressed_templates = {
                "AC": ["Unauthorized access", "Privilege misuse"],
                "AU": ["Undetected activity", "Lack of forensic evidence"],
                "AT": ["Human error", "Social engineering"],
                "CM": ["Configuration drift", "Unauthorized changes"],
                "CP": ["Business disruption", "Data loss"],
                "IA": ["Unauthorized access", "Credential compromise"],
                "IR": ["Delayed incident response", "Uncoordinated response"],
                "RA": ["Unidentified risks", "Unmanaged vulnerabilities"],
                "SC": ["Network intrusion", "Data interception"],
                "SI": ["Malware infections", "Unpatched vulnerabilities"],
                "PE": ["Unauthorized physical access", "Asset loss"],
                "PS": ["Insider threat", "Unqualified personnel"],
                "CA": ["Undetected control failures", "Compliance gaps"],
                "PL": ["Uncoordinated security", "Missing oversight"],
                "PM": ["Governance gaps", "Resource constraints"],
                "SA": ["Vendor compromise", "Supply chain disruption"],
                "SR": ["Supply chain compromise", "Counterfeit components"],
            }
            risks = risk_addressed_templates.get(family_id, ["Security control gaps", "Compliance risks"])
            
            control_entry = {
                "id": full_id,                  "framework": "NIST 800-53",
                "family": family_name,
                "family_id": family_id,
                "control_id": formatted_cid,
                "name": title,
                "description": description,
                "implementation_guidance": guidance,
                "audit_evidence": audit_evidence,
                "risk_addressed": risks,
                "priority": priority,
                "mappings": mappings,
                "related_controls": related,
                "references": ["https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"],
            }
            
            controls_out.append(control_entry)
            total_controls += 1
    
    # Build framework output
    output = {
        "id": "nist-800-53",
        "name": "NIST 800-53",
        "description": "Security and Privacy Controls for Information Systems and Organizations (Complete catalog)",
        "control_count": total_controls,
        "controls": controls_out,
    }
    
    # Write output
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Generated {total_controls} controls across {len(groups)} families")
    print(f"📁 Output: {OUTPUT_FILE}")
    print(f"⚡ Run with: cd GRCLearn/backend && python ../scripts/gen_nist_controls.py")
    print(f"   (or just: python3 /tmp/gen_nist_controls.py)")


if __name__ == "__main__":
    main()
