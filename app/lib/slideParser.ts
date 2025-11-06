/**
 * Parses markdown text into individual slides
 * Slides are separated by the horizontal rule: ---
 */
export function parseSlides(markdownText: string): string[] {
  return markdownText
    .split(/\n---\n/)
    .map((slide) => slide.trim())
    .filter((slide) => slide.length > 0);
}

/**
 * Gets a specific slide by index
 */
export function getSlide(markdownText: string, index: number): string {
  const slides = parseSlides(markdownText);
  if (index < 0 || index >= slides.length) {
    return "";
  }
  return slides[index];
}

/**
 * Gets the total number of slides
 */
export function getSlideCount(markdownText: string): number {
  return parseSlides(markdownText).length;
}
