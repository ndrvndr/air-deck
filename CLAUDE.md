# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AirDeck** is a browser-based presentation tool that combines a Markdown-based slide editor with AI gesture-control for hands-free navigation. Users can create presentations using Markdown syntax and control slides during presentation using hand gestures detected via webcam and TensorFlow.js pose detection.

**Key Features:**
- Markdown-to-slide conversion with live preview
- Full-screen presentation mode
- AI-powered gesture navigation (swipe left/right with hands)
- Keyboard fallback controls (arrow keys)
- 100% client-side processing

## Commands

### Development
```bash
npm run dev                # Start development server at http://localhost:5173
npm run build              # Build for production
npm run start              # Start production server
npm run typecheck          # Run TypeScript type checking
```

### Type Generation
React Router automatically generates types. Run `npm run typecheck` to generate route types and check for errors.

## Architecture

### Tech Stack
- **Framework:** React 19 with React Router v7
- **Styling:** Tailwind CSS v4 + Shadcn/ui components
- **AI/ML:** TensorFlow.js + @tensorflow-models/pose-detection (MoveNet model)
- **Markdown:** react-markdown + remark-gfm
- **Camera:** react-webcam

### Route Structure
The application uses React Router v7's file-based routing configured in `app/routes.ts`:

- `/` - Main editor route (currently renders Welcome component)
- `/present` - Planned: Full-screen presentation mode with gesture detection

Routes are defined using the new React Router v7 API. See `app/routes.ts` for configuration.

### Directory Structure
```
app/
  ├── routes/           # Route components (home.tsx, etc.)
  ├── components/       # Reusable components
  │   └── ui/          # Shadcn/ui components
  ├── lib/             # Utility functions (utils.ts)
  ├── welcome/         # Welcome screen component
  ├── root.tsx         # Root layout with error boundary
  └── app.css          # Global styles (Tailwind)

public/               # Static assets
docs/                 # PRD.md and TRD.md documentation
```

### Path Aliases
TypeScript is configured with `~/*` aliasing to `./app/*`:
```typescript
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
```

### State Management Architecture (Planned)
The TRD specifies using React Context for sharing presentation state:

- **PresentationContext** will wrap the app to provide:
  - `markdownText`: Full Markdown string
  - `slides`: Array derived from splitting by `---`
  - `currentSlide`: Current slide index
  - `nextSlide()` / `prevSlide()`: Navigation functions

This allows the editor route to update content while the presentation route controls playback.

### Markdown-to-Slide Conversion
Slides are separated by `---` (horizontal rule):
```markdown
# Slide 1
Content here

---

# Slide 2
More content
```

The app splits on `\n---\n` and renders each segment using `react-markdown` with custom component styling via Tailwind classes.

### Gesture Detection Implementation (Planned)
Only loaded on `/present` route to keep editor lightweight:

1. **Model:** MoveNet Lightning (fastest variant) from `@tensorflow-models/pose-detection`
2. **Detection Loop:** `requestAnimationFrame` loop calling `model.estimatePoses(video)`
3. **Gesture Logic:**
   - Track `left_wrist` (keypoint 9) and `right_wrist` (keypoint 10)
   - Calculate velocity (deltaX) between frames
   - Swipe right with right hand → next slide
   - Swipe left with left hand → previous slide
   - Cooldown period (500ms) prevents multiple triggers
4. **Fallback:** Arrow keys always work regardless of camera/AI status

### Shadcn/ui Configuration
Component configuration in `components.json`:
- Style: "new-york"
- Base color: "stone"
- CSS variables: enabled
- Import aliases map to `~/components`, `~/lib`, etc.

Add new components with:
```bash
npx shadcn@latest add <component-name>
```

## Important Implementation Details

### React Router v7 Patterns
- Use `Route.MetaArgs`, `Route.LoaderArgs`, etc. from `./+types/<route>` for type safety
- Export `meta`, `loader`, `action` functions from route files
- Use `<Outlet />` in layouts to render child routes

### TensorFlow.js Considerations
- Models are large (~10-20MB). Only load in presentation route.
- Use `useEffect` with cleanup to prevent memory leaks
- Show loading states while model downloads
- Handle camera permission denials gracefully with fallback UI

### Error Handling Requirements
Per TRD section 6:
- Display alerts if camera permission denied
- Show error message if model fails to load
- Always provide keyboard fallback (arrow keys)
- Use Shadcn `<Alert>` component for user-facing errors

## Documentation
- `docs/PRD.md` - Product requirements and feature specifications
- `docs/TRD.md` - Technical architecture and implementation details
- `README.md` - Standard React Router template documentation

Refer to PRD/TRD when implementing new features to ensure alignment with original specifications.
