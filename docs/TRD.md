### **Technical Requirement Document (TRD): AirDeck**

**Version:** 1.0
**Date:** 5 November 2025
**Related PRD:** 1.0

### \#\# 1. Introduction

This document defines the technical architecture, technology stack, and implementation details for **AirDeck**, a browser-based application for creating and delivering presentations. The app will feature a Markdown-based slide editor and a gesture-controlled presentation mode. All processing will be 100% client-side.

### \#\# 2. System Architecture

The application will be a client-side Single Page Application (SPA) built with React. The architecture will be divided into two main routes, managed by React Router, to separate the lightweight editing experience from the resource-intensive presentation mode.

- **`/` (Editor Route):** A split-panel view for editing Markdown and seeing a live preview. This route will not load any AI models.
- **`/present` (Presentation Route):** A full-screen view that loads the webcam, TensorFlow.js, and the pose detection model to enable gesture controls.

### \#\# 3. Technology Stack

| Category            | Technology           | Package Name                        | Purpose                                          |
| :------------------ | :------------------- | :---------------------------------- | :----------------------------------------------- |
| **Core Framework**  | React                | `react`                             | Building the user interface.                     |
| **Routing**         | React Router         | `react-router-dom`                  | Managing the `/` and `/present` routes.          |
| **Styling**         | Tailwind CSS         | `tailwindcss`                       | Utility-first CSS framework.                     |
| **UI Components**   | Shadcn/ui            | `shadcn-ui`                         | Pre-built components (Button, Textarea, etc.).   |
| **Markdown**        | React Markdown       | `react-markdown`                    | Rendering Markdown as React components.          |
| **Markdown Extras** | Remark GFM           | `remark-gfm`                        | Adding support for tables, strikethrough, etc.   |
| **AI Core**         | TensorFlow.js Core   | `@tensorflow/tfjs`                  | The base ML library for the browser.             |
| **AI Model**        | Pose Detection       | `@tensorflow-models/pose-detection` | To load the MoveNet model for gesture detection. |
| **Camera Access**   | React Webcam         | `react-webcam`                      | To access the webcam feed easily.                |
| **Utilities**       | clsx, tailwind-merge | `clsx`, `tailwind-merge`            | Required by Shadcn/ui for class name management. |

---

### \#\# 4. Key Technical Components & Specifications

#### \#\#\# 4.1. Markdown-to-Slide Rendering

This is the core of the content creation flow.

- **Slide Splitting:** The main Markdown text (stored in state) will be split into an array of strings using `\n---\n` (newline, triple-hyphen, newline) as the delimiter.
- **Rendering:** The app will map over this array. Each string in the array will be passed as a prop to a `<Slide>` component.
- **Slide Component:** This component will use `react-markdown` to render the Markdown string.
- **Styling:** We will use the `components` prop of `react-markdown` to override default HTML elements (e.g., `h1`, `ul`) with custom React components styled with Tailwind classes.
  ```jsx
  // Example styling override
  <ReactMarkdown
    components={{
      h1: ({ node, ...props }) => (
        <h1 className="text-4xl font-bold mb-4" {...props} />
      ),
      li: ({ node, ...props }) => (
        <li className="text-xl mb-2" {...props} />
      ),
    }}
    remarkPlugins={[remarkGfm]}
  >
    {slideMarkdown}
  </ReactMarkdown>
  ```

#### \#\#\# 4.2. UI & Routing

- **`/` (Editor Route):**
  - This route will render the main editor interface.
  - The UI will use Shadcn's `<Resizable>` component to create a two-panel layout (editor on the left, preview on the right).
  - The left panel will contain a Shadcn `<Textarea>` component.
  - The right panel will render the _current_ slide (`slides[currentSlideIndex]`).
- **`/present` (Presentation Route):**
  - This route will be triggered by a "Present" button from the editor.
  - On load, it will request Fullscreen API access: `document.documentElement.requestFullscreen()`.
  - It will render the `<PresentationView />` component, which contains the gesture detection logic.

#### \#\#\# 4.3. Gesture Detection

This logic will be encapsulated within the `<PresentationView />` component and will only be active on the `/present` route.

- **Model Loading:**
  - The component will use a `useEffect` hook to load the `pose-detection` model.
  - We will use the **MoveNet (Lightning)** model (`modelType: 'movenet', modelUrl: 'lightning'`) as it is the fastest, which is essential for real-time feedback.
  - A loading state (`isLoadingModel`) will be shown to the user while the model downloads.
- **Video Loop:**
  - A `<react-webcam>` component will be rendered (but can be hidden off-screen or at 1px opacity).
  - A `requestAnimationFrame` loop (or a throttled `setInterval`) will be used to run the detection.
  - Inside the loop: `const poses = await model.estimatePoses(video);`
- **Swipe Logic:**
  1.  We only need to track the `left_wrist` (index 9) and `right_wrist` (index 10) from `poses[0].keypoints`.
  2.  The app will store the `x` position of the wrists from the previous frame.
  3.  A **swipe** is detected by calculating the velocity (`deltaX`) of the wrist in a single frame.
  4.  **State Management:** A `cooldown` state is crucial to prevent one long swipe from turning 10 pages.
  <!-- end list -->
  - **Swipe Right (Next Slide):**
    - `IF` `right_wrist.score > 0.3` (it's visible)
    - `AND` `(currentWristX - prevWristX) > SWIPE_THRESHOLD` (e.g., 20 pixels)
    - `AND` `!isOnCooldown`
    - `THEN` call `nextSlide()`, set `isOnCooldown` to `true`, and `setTimeout(() => setIsOnCooldown(false), 500)`.
  - **Swipe Left (Previous Slide):**
    - `IF` `left_wrist.score > 0.3` (it's visible)
    - `AND` `(currentWristX - prevWristX) < -SWIPE_THRESHOLD`
    - `AND` `!isOnCooldown`
    - `THEN` call `prevSlide()`, set cooldown.
- **Feedback UI:** A small, floating icon (e.g., a "hand") will show that the AI is active. When a swipe is detected, a "Next" or "Back" message will briefly fade in and out.

---

### \#\# 5. State Management & Data Flow

To share the presentation state between the editor and the presentation mode, we will use a **React Context**.

- **`PresentationContext`:** A context provider will wrap the entire application.
- **Context Value:**
  - `markdownText`: The full string of Markdown.
  - `setMarkdownText`: Function to update the text from the editor.
  - `slides`: The derived array of slide strings (`markdownText.split('---')`).
  - `currentSlide`: The index of the current slide.
  - `nextSlide()`: Function to increment `currentSlide`.
  - `prevSlide()`: Function to decrement `currentSlide`.

This allows the `/` route to update the `markdownText` and the `/present` route to read the `slides` and call `nextSlide()` / `prevSlide()`.

---

### \#\# 6. Error Handling & Fallbacks

- **Camera Permission Denied:** The `/present` route will check for camera permissions. If denied, it will display a Shadcn `<Alert>` component instructing the user to grant access. The gesture features will be disabled.
- **Model Load Failure:** If the TensorFlow model fails to load, an error message will be shown.
- **Primary Fallback:** The `<PresentationView />` component will have an `onKeyDown` event listener to handle `ArrowRight` and `ArrowLeft` key presses. This ensures the presentation is always controllable, even if the AI or camera fails.
