### **Product Requirement Document (PRD): AirDeck 🎤**

**Version:** 1.0
**Date:** 5 November 2025
**Author:** @dannycahyo

### 1\. Introduction & Vision

**AirDeck** is an all-in-one, browser-based tool for creating and delivering presentations. It's designed for the modern public speaker who values simplicity and freedom of movement.

**The Vision:** To free speakers from the constraints of physical clickers and bloated presentation software. AirDeck combines a minimalist, Markdown-based slide editor with an AI gesture-control system, allowing anyone to create and present a beautiful slideshow using only a web browser and a webcam.

### 2\. Target Audience

- **Public Speakers & Lecturers:** Professionals, academics, and students who frequently give presentations and want to move around the stage without being tied to a laptop or holding a small, losable clicker.
- **Developers & Tech Evangelists:** Presenters who are already comfortable with Markdown and want a fast, code-driven way to build and present slides.
- **Minimalists:** Anyone who finds traditional presentation software like PowerPoint or Google Slides to be too complex for their needs.

### 3\. User Goals & Problems

| User Goal                                                       | Problem Solved                                                                                                                   |
| :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| "I want to write my slides quickly, like a document."           | **Problem:** Traditional slide software requires clicking, dragging, and formatting individual text boxes, which is slow.        |
| "I want to present without holding a clicker."                  | **Problem:** Clickers can be lost, run out of batteries, or make a speaker feel "tethered" by holding an object.                 |
| "I need an all-in-one tool for creating and showing my talk."   | **Problem:** The typical workflow involves one app for writing (e.g., VS Code) and another for presenting (e.g., Google Slides). |
| "I want to engage my audience with my hands and body language." | **Problem:** Using one hand to hold a clicker limits a speaker's ability to gesture naturally.                                   |

---

### 4\. Features & Scope (Minimum Viable Product - MVP)

The MVP is focused on the core loop: **Create with Markdown, Present with Gestures.**

| Feature ID | Feature Name                      | Description                                                                                                                                                                                                                                 |
| :--------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **FE-01**  | **Markdown Slide Editor**         | A simple text editor where users can write their presentation in Markdown. Slides are separated by a standard Markdown horizontal rule (`---`).                                                                                             |
| **FE-02**  | **Live Preview Renderer**         | A split-screen view that shows the editor on one side and a real-time, rendered preview of the _current_ slide on the other.                                                                                                                |
| **FE-03**  | **Basic Markdown Styling**        | The app must support and style the most common Markdown tags: <br> `<h1>`, `<h2>` (Headings) <br> `<ul>` (Bulleted lists) <br> `**bold**` and `*italic*` <br> `<img>` (Images, from a URL)                                                  |
| **FE-04**  | **Full-Screen Presentation Mode** | A button that transitions the rendered slides into a full-screen, "presenter" view, hiding the editor and all other UI.                                                                                                                     |
| **FE-05**  | **AI Gesture Navigation**         | While in Presentation Mode, the app will use the webcam and **MoveNet/BlazePose** to detect hand gestures. <br> • **Swipe Right (Right Hand):** Advances to the next slide. <br> • **Swipe Left (Left Hand):** Goes to the previous slide.  |
| **FE-06**  | **Gesture Feedback UI**           | A subtle, on-screen visual indicator to show the user that the AI is active and has detected their hand (e.g., a small "hand" icon that lights up). When a swipe is recognized, a brief "Next" or "Back" visual confirmation should appear. |
| **FE-07**  | **Keyboard Fallback**             | While in Presentation Mode, the user **must** also be able to use the left and right arrow keys to navigate, as a reliable fallback.                                                                                                        |

---

### 5\. User Flow

1.  **Open App:** The user navigates to the web application.
2.  **Create Slides:** The user is immediately presented with the split-screen editor/preview. They start typing their presentation in the Markdown panel. They use `---` to create a new slide.
3.  **Start Presentation:** Once finished, the user clicks the "Present" button.
4.  **Grant Permission:** The browser prompts for webcam access (if not already granted).
5.  **Present:** The app enters full-screen mode, showing the first slide. A small "AI Active" icon appears in a corner.
6.  **Navigate (Gesture):** The speaker stands back from their laptop. They swipe their right hand to the right; the app detects the gesture and advances to slide 2.
7.  **Navigate (Fallback):** The speaker wants to go back. They swipe their left hand, but the lighting is bad. They simply press the `Left Arrow` key on their keyboard, and the app moves to slide 1.
8.  **Exit:** The speaker finishes their talk and presses the `Esc` key to exit full-screen mode and return to the editor.

---

### 6\. Future Scope (Post-MVP)

- **FE-08: More Gestures:** Add a "Raise Hand" gesture to show/hide speaker notes or a "Fist" gesture to blank the screen (a common presenter feature).
- **FE-09: Speaker Notes:** Allow a special Markdown syntax (e.g., `:::notes ... :::`) for speaker notes that are not rendered on the slide.
- **FE-10: Basic Themes:** Add a simple dropdown to select different visual themes (e.g., "Dark," "Light," "Blue").
- **FE-11: Save to Local Storage:** Automatically save the user's Markdown text in the browser's local storage so their work isn't lost on refresh.
- **FE-12: Export to PDF:** A function to "print to PDF" for sharing the slides.
