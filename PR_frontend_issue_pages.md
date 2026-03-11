# feat(frontend): Implement Issue Pages and Redux Wiring

## Summary

This PR implements the core frontend issue pages, UI components with Lucide icons, and the full Redux wiring for issues. It also fixes a CORS mismatch blocking the Vite dev server.

## Changes

- **Pages**: Added `IssueList`, `CreateIssue`, and `IssueDetails` views.
- **Components**: Added a fully styled `IssueCard` featuring badges and SLA timers.
- **Icons**: Replaced emojis with polished `lucide-react` icons.
- **State Management**: Added Redux `issueSlice`, `issueAPI`, and `issueTypes`. Registered reducer in the store.
- **Routing**: Added protected routes for `/issues`, `/issues/create`, and `/issues/:id`.
- **Auth**: Added cross-navigation links between the `Login` and `Signup` pages.
- **Backend Fix**: Allowed `localhost:5173` in CORS configuration.
- **Tracking**: Created a master `TODO.md` file for project tracking.

## Related Issues

Tracks #5
