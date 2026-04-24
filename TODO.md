# Competition Master Build TODO
## Phase 0: Planning Approved - Awaiting User Confirm
- [ ] User confirms plan

## Phase 1: Front Door Restructure ✓\n- [x] Delete frontend/src/app/welcome/\n- [x] Verify page.tsx has Neural Gateway w/ router.push('/dashboard')

## Phase 2: Sidebar Handshake
- [ ] Confirm layout.tsx sidebar href="/dashboard" for Text Forensics

## Phase 3: Clipping Fix ✓\n- [x] Edit FairnessGauge.tsx/CircularScore.tsx: remove overflow-hidden/truncate, add whitespace-nowrap shrink-0 tabular-nums
- [ ] Edit dashboard/page.tsx: add pt-20 min-h-0 to score containers

## Phase 4: Global Stability\n- [x] Edit globals.css: add font-variant-numeric: tabular-nums to body, ensure @keyframes
- [ ] Edit layout.tsx/dashboard/page.tsx: add min-h-0 to flex/grid cols

## Final Validation
- [ ] cd frontend &amp;&amp; npm run dev
- [ ] Test flow: localhost:3000 → Init → /dashboard (no loop), scores visible, no clip
- [ ] attempt_completion

