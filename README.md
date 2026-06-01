# Decision Memory: Traceable AI-Assisted Requirements Decisions

Decision Memory is a research prototype for studying how AI agents can preserve historical evidence, recall falsified assumptions, and constrain future requirements decisions.

The core idea is simple:

> No citation, no decision.

The system treats decision memory as organizational infrastructure. Past evidence, previous decisions, falsified hypotheses, and requirement changes are stored as traceable records that can actively influence later decisions.

## Project Information

| Item | Description |
|---|---|
| Status | Research prototype / Competition artifact |
| Repository | https://github.com/MyraWang0406/UserResearchAgent-CF |
| Research Area | Requirements Engineering, Human-AI Collaboration, Decision Traceability, Organizational Memory |
| Main Methods | Evidence citation, decision memory, falsification tracking, conflict recall, scenario walkthrough |
| Intended Use | Research demonstration, not production deployment |

## Research Positioning

In organizational requirements and user research workflows, past decisions are often lost when new evidence appears. Teams may unknowingly reintroduce ideas that were already tested, rejected, or falsified.

This causes requirement regression, inconsistent specifications, repeated argument cycles, and loss of decision integrity.

This prototype explores whether an AI-assisted decision-memory layer can help teams preserve evidence and prevent falsified assumptions from being casually reintroduced as if they were new insights.

## Research Question

How can an AI agent remember historical decision evidence and actively constrain future decisions when new input conflicts with previously falsified assumptions?

## Overarching Research Thread

This project belongs to a broader research thread:

> AI-assisted decision traceability in organizational and user research workflows.

It focuses on what happens after a decision has been made: how evidence, outcomes, and falsified assumptions can be stored, recalled, and used to constrain future decisions.

## System Overview

The system stores different decision-related artifacts as memory cells:

- evidence
- decisions
- requirements
- outcomes
- falsification records
- requirement snapshots

When a new input arrives, the system recalls relevant historical records and checks whether the new proposal conflicts with previous evidence or falsified assumptions.

If a decision lacks proper historical citation, the system can reject it.

## Core Mechanism

```text
new input
→ recall historical decisions
→ identify falsified assumptions
→ compare with current proposal
→ detect conflict
→ cite previous evidence
→ accept, revise, or reject the new decision
```

The key point is that memory is not passive storage. Memory actively constrains future decisions.

## Demo Scenario: Three Rounds

| Round | Type | Description |
|---|---|---|
| Round 1 | Intake | Interview evidence produces initial decision and Requirement v1 |
| Round 2 | Falsification | CVR below 2% falsifies the previous speed-focused hypothesis and produces Requirement v2 |
| Round 3 | Conflict Recall | A new interview reintroduces the speed-focused idea; the system recalls Round 2 falsification and rejects rollback |

The core demonstration is Round 3. The system does not simply store past records. It recalls a falsified decision and uses it to constrain the new decision.

## Proof: Memory Influences Decisions

The demo output provides three pieces of evidence from `demo_outputs/demo.log`.

### 1. Recall hits include falsified decisions

```text
RecallHits Found: 2 cells
- [Hit] ID: decision_1771119630.400876 | Tags: ['FALSIFIED:true'] | Summary: Metrics FALSIFY previous speed hypothesis
- [Hit] ID: decision_1771119630.39957 | Tags: ['type:decision'] | Summary: Initial requirement generation based on interview
```

### 2. Conflict detection references the falsification

```text
Conflict Reason: Detected contradiction with Round 2 Falsification
Decision ID: decision_1771119630.400876
```

### 3. Final decision rejects requirement rollback

```text
Final Decision Rationale:
Conflict Detected — Rejected reverting to speed-focus;
maintained quality-focus due to previous falsification.
```

## Why This Matters

### Traceable decisions

Every decision must cite evidence. A decision is not treated as valid unless it can be traced back to prior records.

### Evolution consistency

Falsified hypotheses are not easily overturned by a new interview or isolated comment. The system recalls previous falsification before accepting rollback.

### Organizational memory

Evidence, decisions, requirements, and outcomes are stored in a unified structure. This supports recall, conflict detection, and decision consistency.

## How to Judge Whether It Is Memory-Driven

A memory-driven system should change its decision behavior based on recalled evidence.

In this demo, Round 3 explicitly references Round 2’s falsified decision ID. Without recall, the system may adopt the new interview and roll back to the earlier speed-focused requirement. With recall, it rejects the rollback and maintains the quality-first decision.

This shows that memory is not only stored. It affects the final decision rationale.

## Relation to Other Prototypes

This project is part of my broader research portfolio on traceable AI-assisted decision-making.

- `MatrixMirix.WhatIf` focuses on deliberation before a decision is finalized.
- `UserResearchAgent-CF` focuses on decision memory after decisions have been made.
- `CrowdRE2026-Beyond-App-Reviews-Archive` shares the evidence-to-requirement principle, where requirement candidates must trace back to inspectable evidence.
- `ADX-Mirix-1.15-cursor` applies a similar evidence-to-decision trace principle to automated advertising workflows.

## Repository Structure

```text
UserResearchAgent-CF/
├── backend/              # FastAPI backend and memory logic
├── frontend/             # Static frontend prototype
├── scripts/              # Demo runner scripts
├── tests/                # Test cases
├── templates/            # Decision and requirement templates
├── demo_outputs/         # Demo logs and generated artifacts
├── submission/           # Competition / submission materials
├── DEPLOYMENT.md         # Deployment notes
├── VERIFICATION.md       # Verification notes
├── requirements.txt      # Python dependencies
└── README.md
```

## Demo Outputs

| File | Description |
|---|---|
| `demo_outputs/demo.log` | Three-round demo execution log |
| `demo_outputs/graph.json` | Trace graph with nodes and edges |
| `demo_outputs/decisions.json` | Decision cells |
| `demo_outputs/snapshots.json` | Requirement snapshots |

## Quick Start

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/run_demo.py
pytest -q
```

### Mac / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/run_demo.py
pytest -q
```

## Local Frontend and Backend

Run backend:

```bash
uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Run static frontend:

```bash
python -m http.server 5173 --directory frontend
```

Open:

```text
http://127.0.0.1:5173/index.html
```

## Deployment Notes

The project can be deployed with:

- backend on Railway
- frontend on Cloudflare Pages
- optional memory service through EverMemOS Cloud

If the frontend shows `Failed to fetch`, set the API address to the Railway public URL. Do not include `:8000` in the production URL.

See `DEPLOYMENT.md` for details.

## GitHub Actions

CI runs:

```bash
pytest -q
```

The workflow can produce `demo_outputs` artifacts, including:

- `demo.log`
- `graph.json`
- `decisions.json`
- `snapshots.json`

## Submission Materials

| File | Description |
|---|---|
| `submission/DEMO_SCRIPT.md` | 90-second / 3-minute voiceover script |
| `submission/ARCHITECTURE.md` | One-page architecture description |
| `submission/demo_outputs/` | Demo output copy |

## Evaluation Status

This project currently uses a three-round scenario walkthrough.

It has not yet been validated with real product managers, requirements engineers, or user research teams.

## Current Limitations

- Tested with simulated scenarios only.
- Falsification detection relies on explicit tagging.
- Implicit contradictions are not yet reliably detected.
- LLM recall summaries may vary across runs.
- No comparison baseline has been established.
- No formal user study has been conducted.

## Research Fit

`human-AI collaboration` · `requirements engineering` · `decision traceability` · `organizational memory` · `HCARE` · `CSCW`

## Status and Scope

This repository is a research prototype. It is intended to demonstrate how decision memory, evidence citation, and falsification recall can constrain AI-assisted requirements decisions.

It is not a production requirements-management system.

## License

This repository is for research and portfolio demonstration purposes.
