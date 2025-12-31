import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';

interface PresentationContextType {
  markdownText: string;
  setMarkdownText: (text: string) => void;
  slides: string[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  totalSlides: number;
  canNext: boolean;
  canPrev: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(
  undefined
);

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error(
      'usePresentationContext must be used within a PresentationProvider'
    );
  }
  return context;
}

const STORAGE_KEY = 'airdeck-markdown';

interface PresentationProviderProps {
  children: ReactNode;
  initialMarkdown?: string;
}

export function PresentationProvider({
  children,
  initialMarkdown = '',
}: PresentationProviderProps) {
  const [markdownText, setMarkdownText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || initialMarkdown;
    }
    return initialMarkdown;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, markdownText);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }, [markdownText, isLoaded]);

  const slides = useMemo(
    () =>
      markdownText
        .split(/\r?\n---\r?\n/)
        .map((slide) => slide.trim())
        .filter((slide) => slide.length > 0),
    [markdownText]
  );

  const totalSlides = slides.length;

  const safeCurrentSlide =
    totalSlides > 0 ? Math.min(currentSlide, totalSlides - 1) : 0;

  const canNext = safeCurrentSlide < totalSlides - 1;
  const canPrev = safeCurrentSlide > 0;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index);
      }
    },
    [totalSlides]
  );

  const value = useMemo(
    () => ({
      markdownText,
      setMarkdownText,
      slides,
      currentSlide: safeCurrentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
      totalSlides,
      canNext,
      canPrev,
    }),
    [
      markdownText,
      slides,
      safeCurrentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
      totalSlides,
      canNext,
      canPrev,
    ]
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}
