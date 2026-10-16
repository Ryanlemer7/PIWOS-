# OWO integration plan

## Scope
Integrate OWO into this repository without replacing existing files or changing the default branch until reviewed.

## Target architecture
- Web client: responsive, mobile-first interface with premium black-and-gold visual identity.
- Supabase: dedicated PostgreSQL project, Auth, Storage, Realtime and Row Level Security (RLS).
- GitHub: versioned source, SQL migrations, automated checks and reviewable pull requests.

## Core domains
1. User profiles and personal workspace.
2. Companies and company memberships.
3. Public company showcases and social feed.
4. Products, categories, carts and orders.
5. Notifications and private messaging.
6. Company back-office, staff and permissions.
7. Internal financial ledger (not a bank or regulated payment service by default).
8. Legal documents and contract workflows.
9. Append-only audit events.
10. Offline mutation queue and conflict-aware synchronization.

## Security requirements
- Every company-owned record must carry a company identifier and be protected by RLS.
- Authorization must be enforced in PostgreSQL, not only in the UI.
- Never expose Supabase service-role keys in browser code or commit secrets.
- Audit records should be append-only for application roles; sensitive actions should be performed server-side.
- Do not describe the internal ledger as a regulated bank account or Pi payment as completed unless the corresponding provider integration is verified.
- Dislikes require a reason of at least 20 characters, validated server-side as well as client-side.
- Invitation links, sessions, and financial/legal actions require expiry, authorization and audit trails.

## Integration sequence
1. Inspect the existing repository and preserve its current files.
2. Confirm the Supabase organization and create a dedicated OWO project.
3. Add versioned SQL migrations for schema, indexes, RLS policies and audit functions.
4. Add environment variable examples containing placeholders only.
5. Connect the client using the Supabase publishable key.
6. Add tests for company isolation and authorization boundaries.
7. Review changes on this branch before merging to the default branch.

## Offline behavior
Cache only data that the signed-in user is authorized to access. Queue writes with idempotency keys and synchronize after reconnecting. Resolve conflicting edits explicitly; never assume that a client-side timestamp grants authority.

## Current status
This document is a planning artifact only. Database creation and application wiring are pending confirmation of the target Supabase organization and inspection of the existing app files.
