# SpurTalk Backend - Quick Reference

## Current Status: **Architecture Complete**

### ✅ What's Done

1. **Architectural Plan**: Complete Node.js/TypeScript backend design
2. **Database Schema**: Full PostgreSQL schema with Prisma
3. **PRD v2.0**: Backend-focused with testing requirements
4. **Testing Strategy**: 200+ tests, 90% coverage target
5. **Context Archival**: Frontend PRD moved to `.context/archive/`

### 📁 Key Files Created

- `REVISED_BACKEND_ARCHITECTURE.md` - Detailed backend plan
- `prd.json` - New backend PRD with testing requirements
- `.context/archive/prd-frontend-...` - Archived frontend PRD
- `.context/archive/TESTING_STRATEGY.md` - Testing guide

---

## Architecture Highlights

### Stack

- **Next.js 14** (App Router) - Frontend + API
- **NextAuth.js v5** - Authentication
- **PostgreSQL** - Primary database (self-hosted)
- **Redis** - Cache + queues (self-hosted)
- **BullMQ** - Background jobs
- **OpenAI** - AI features with local fallback
- **Socket.io** - Real-time features

### Cost: $21/month vs $735 (97% savings)

### Self-Contained

```bash
docker-compose up -d  # Start DB + Redis
npm run dev           # Start Next.js
```

---

## Implementation Roadmap

**Phase 1** (Week 1): Setup

- Next.js 14 + Docker + Prisma + NextAuth

**Phase 2** (Week 2): Core API

- Tasks, Micro-steps, Sessions

**Phase 3** (Week 3): Intelligence

- AI breakdown, Pattern analysis

**Phase 4** (Week 4): Social

- Partners, Sharing, Notifications

**Phase 5** (Week 5): Emergency + Polish

- Emergency mode, Reminders, Monitoring

**Phase 6** (Week 6): Production

- Deployment, Migration tools, Documentation

---

## Testing Strategy

- **200+ tests** across 4 categories
- **90% coverage** requirement
- **Unit**: 70% (140+ tests)
- **Integration**: 20% (40+ tests)
- **E2E**: 10% (20+ tests)
- **Security**: 100% coverage

---

## Card Lifecycle (API + UI)

This repo includes a small, explicit lifecycle state machine for Cards, exposed via a REST surface in the Express backend and mirrored in a simple React component.

### Lifecycle States

- `initial` -> `loading` -> `active` -> `completed`
- `loading` / `active` can also go to `discarded`
- `completed` and `discarded` are terminal

The shared type lives in `shared/src/types.d.ts` as `CardLifecycleState`.

### Backend API

Base path: `POST /api/cards` (mounted in `backend/src/index.ts`). All endpoints require `Authorization: Bearer <access_token>`.

- `POST /api/cards/:id/open`
  - Creates the card record if it does not exist (creates directly in `loading`)
  - Otherwise attempts to transition to `loading`
- `POST /api/cards/:id/ready` transitions to `active`
- `POST /api/cards/:id/finish` transitions to `completed` (sets `completedAt`)
- `POST /api/cards/:id/close` transitions to `discarded` (fails with 400 if already discarded)

Responses are a `CardRecord` JSON payload:

```json
{
  "id": "card-123",
  "userId": "user-abc",
  "state": "active",
  "createdAt": "2026-02-07T12:00:00.000Z",
  "updatedAt": "2026-02-07T12:01:00.000Z",
  "completedAt": null
}
```

Quick test (default backend port is `7101`):

```bash
TOKEN=... # access token
curl -sS -X POST "http://localhost:7101/api/cards/card-123/open" \
  -H "Authorization: Bearer $TOKEN"
```

Note: the current implementation uses an in-memory store (`backend/src/routes/cardRoutes.ts`) keyed by `userId:cardId`.

### Frontend / Component Reference

`src/components/Card.tsx` is a minimal React component that demonstrates the same transition rules. It currently takes no props and exposes helpers you can reuse:

- `initialCardLifecycleState`
- `cardAllowedTransitions`
- `canTransition(from, to)`
- `nextCardState(current, desired)`

---

## Next Steps

1. Run `npm install` to install dependencies
2. Run `docker-compose up -d` to start infrastructure
3. Run `npx prisma migrate dev` to setup database
4. Start implementing Phase 1 features
5. Write tests alongside code (TDD recommended)

---

## Command Quick Reference

```bash
# Infrastructure
docker-compose up -d          # Start PostgreSQL + Redis
docker-compose down           # Stop infrastructure
docker-compose logs -f        # View logs

# Development
npm run dev                   # Start Next.js (port 3000)
npx prisma studio             # Database GUI (port 5555)

# Testing
npm run test:unit            # Unit tests with coverage
npm run test:integration     # Integration tests
npm run test:e2e             # E2E tests
npm run test:all             # Run everything

# Database
npx prisma migrate dev       # Create migration
npx prisma db push           # Sync schema
npx prisma generate           # Generate client

# Production
npm run build                # Build for production
npm start                     # Start production server
```

---

## Important Notes

1. **Frontend is still in localStorage mode** - Backend needs to be built
2. **Migration script needed** - For moving existing user data
3. **All features are planned** - Ready for implementation
4. **Tests are specified** - Ready to write
5. **Cost-effective** - Uses free/low-cost services

---

## Files to Read

- `REVISED_BACKEND_ARCHITECTURE.md` - Complete technical plan
- `prd.json` - Backend user stories & testing requirements
- `.context/archive/TESTING_STRATEGY.md` - Testing guide

**Ready to start implementation!** 🚀
