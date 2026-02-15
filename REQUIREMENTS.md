# FantasyF1 - Product Requirements Document

## Project Status
**Status:** ACTIVE PRODUCTION BUILD  
**Priority:** P0 - THE REAL DEAL  
**Deployment Target:** Vercel (serverless)  
**Kickoff Date:** 2026-02-14  
**Cito Handoff:** Archie

## Executive Summary
FantasyF1 is a production-grade fantasy sports application dedicated to Formula 1 racing. Unlike the reference implementation (Docker-based FastAPI), this build targets Vercel's serverless platform with a Next.js frontend and separate API layer.

## Reference Application
- **URL:** https://github.com/famgala/FantasyF1_BE
- **Tech Stack:** FastAPI, PostgreSQL, Redis, MQTT, Celery
- **Study:** Draft system, league management, real-time F1 data integration

## Core Requirements

### Authentication & Authorization
- Full user registration and authentication system
- **CRITICAL:** Email validation MUST occur BEFORE user can complete registration
- Secure password handling
- JWT-based session management

### League System
- League size: 2-10 members
- Each member drafts exactly 2 drivers
- League creation and invitation system
- Private/public league options

### Season/Data Management
- **Data Source:** Jolpica API for Formula 1 data
- Real-time race data syncing
- Driver standings and statistics
- Season configuration and management

### Admin Functionality
- **FULL admin frontend absolutely required**
- Securely separated from user frontend
- Admin authentication with elevated privileges
- User management, league oversight, system configuration

### Frontend Architecture
- Next.js application (Vercel deployment)
- Responsive design
- Real-time updates for race data
- Mobile-first approach

### Compliance Requirement
Include all features present in the reference application (FantasyF1_BE) plus additional production-grade requirements specified here.

## Technical Decisions (To Be Defined by Archie)
- Database solution for Vercel (PlanetScale, Neon, Supabase)
- Authentication provider (Auth0, Clerk, NextAuth)
- Caching strategy (Redis via Upstash)
- Real-time updates (Server-Sent Events, WebSockets via Pusher)
- Email service (Resend, SendGrid)

## Architecture Notes
- Serverless-first design (Vercel Functions)
- Stateless API layer
- External database required (no local PostgreSQL)
- External caching required (no local Redis)
- External job scheduling required (no local Celery)

## Approval Authority
- Archie makes decisions when paths are clear
- Archie escalates to Cito for guidance when needed
- Cito escalates to Aja (@johngra) when required

## Communication Protocol
All handoffs tracked with:
- Out: Sender, recipient, timestamp, task summary
- In: Receiver, sender, timestamp, acceptance status
- Acknowledgment via Redis outbound:messages and file markers

## Reference Links
- Formula 1 Data API: https://github.com/famgala/FantasyF1_BE (clone and study)
- Jolpica F1 API: To be researched

---
**Created by:** Cito  
**Date:** 2026-02-14  
**Next Action:** Archie creates comprehensive PRD and architecture
