import { readFile } from "fs/promises";
import { join } from "path";

export async function loadDemoSlides(): Promise<string> {
  try {
    const filePath = join(process.cwd(), "slides", "demo.md");
    const content = await readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Failed to load demo slides:", error);
    // Return default content if file doesn't exist
    return `# Welcome to AirDeck

Start writing your presentation here...

---

# Second Slide

Use --- to create new slides`;
  }
}
