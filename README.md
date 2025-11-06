# AirDeck 🎤

An all-in-one, browser-based presentation tool combining a minimalist Markdown-based slide editor with AI gesture-control system. Create and deliver beautiful presentations using only a web browser and a webcam.

## Features

- **Markdown-based Editor** - Write slides quickly with familiar Markdown syntax
- **Live Preview** - See your slides in real-time as you type
- **AI Gesture Controls** - Navigate slides hands-free using hand gestures
- **Full-screen Presentation Mode** - Immersive presentation experience
- **Keyboard Fallback** - Arrow keys always work as backup navigation
- **100% Client-side** - All processing happens in your browser
- **No Clickers Needed** - Freedom to move and gesture naturally

## Tech Stack

- **React 19** - Modern React with hooks
- **React Router v7** - File-based routing with SSR
- **TensorFlow.js** - Machine learning in the browser
- **MoveNet Pose Detection** - Real-time gesture recognition
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **TypeScript** - Type-safe development

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A webcam (for gesture controls)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Usage

### Creating Slides

1. Open the editor at `http://localhost:5173`
2. Write your presentation using Markdown syntax
3. Separate slides with `---` (three hyphens on a new line)

Example:

```markdown
# Welcome to My Presentation

Introduction slide content

---

# Second Slide

- Point one
- Point two
- Point three

---

# Thank You!

Questions?
```

### Presenting

1. Click the "Present" button in the top-right corner
2. Grant camera permissions when prompted
3. Wait for the AI model to load
4. Use gestures or keyboard to navigate:
   - **Swipe Right** (right hand) - Next slide
   - **Swipe Left** (left hand) - Previous slide
   - **Arrow Keys** - Keyboard fallback
   - **ESC** - Exit presentation

### Gesture Controls

The app uses TensorFlow.js MoveNet model to detect hand gestures:

- Position yourself so your webcam can see your upper body
- Make clear, deliberate swipe gestures with one hand
- There's a short cooldown between gestures to prevent accidental triggers
- The "AI Active" indicator shows when gesture detection is working

## Project Structure

```
air-deck/
├── app/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── Editor.tsx      # Main editor with split layout
│   │   ├── PresentationView.tsx  # Presentation mode
│   │   ├── SlideRenderer.tsx     # Markdown renderer
│   │   └── GestureFeedback.tsx   # Gesture UI feedback
│   ├── contexts/           # React contexts
│   │   └── PresentationContext.tsx  # Global state
│   ├── hooks/              # Custom React hooks
│   │   ├── useGestureDetection.ts
│   │   └── useKeyboardNavigation.ts
│   ├── lib/                # Utilities
│   │   ├── slideParser.ts
│   │   └── utils.ts
│   ├── routes/             # React Router routes
│   │   ├── home.tsx        # Editor route
│   │   └── present.tsx     # Presentation route
│   ├── services/           # Business logic
│   │   └── gestureDetection.ts
│   └── root.tsx            # Root layout
├── slides/                 # Sample markdown files
│   └── demo.md
├── docs/                   # Documentation
│   ├── PRD.md             # Product requirements
│   └── TRD.md             # Technical requirements
└── public/                # Static assets
```

## Architecture Highlights

### State Management

- **PresentationContext** provides global state for slides and navigation
- Markdown text is split into slides using `\n---\n` delimiter
- Current slide index tracked for both editor preview and presentation mode

### Gesture Detection

- Lazy-loaded only in presentation route to keep editor lightweight
- Uses MoveNet Lightning model (fastest variant)
- Tracks wrist keypoints to detect swipe gestures
- Cooldown mechanism prevents multiple triggers
- Runs in `requestAnimationFrame` loop for real-time detection

### Route Separation

- `/` - Editor route (no AI models loaded)
- `/present` - Presentation route (loads TensorFlow.js + pose detection)

This separation ensures fast editor performance while enabling powerful gesture controls in presentation mode.

## Building for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Browser Support

- Chrome/Edge 90+ (recommended for best TensorFlow.js performance)
- Firefox 88+
- Safari 14+ (may have slower model loading)

## Troubleshooting

### Camera Access Issues

If gesture controls aren't working:
1. Check browser permissions for camera access
2. Make sure no other app is using the webcam
3. Try refreshing the page
4. Use keyboard arrow keys as fallback

### Model Loading Slow

The AI model is ~10-20MB and downloads on first presentation:
- Wait for "AI Active" indicator
- Subsequent presentations will be faster (cached)
- Use keyboard navigation while loading

### Performance Issues

If gesture detection is laggy:
- Close other tabs/applications
- Ensure good lighting for better detection
- Consider using a faster browser (Chrome recommended)

## Future Enhancements

See `docs/PRD.md` for planned features:
- Speaker notes support
- Multiple gesture types
- Theme customization
- Local storage auto-save
- PDF export

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Technical Requirements (TRD)](docs/TRD.md)
- [Claude Code Guide](CLAUDE.md)

## Contributing

This is a demonstration project built according to the PRD and TRD specifications. Feel free to fork and extend it with additional features!

## License

MIT

---

Built with ❤️ using React Router, TensorFlow.js, and Tailwind CSS.
