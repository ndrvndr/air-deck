import { useEffect, useState } from "react";
import { Hand, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { GestureType } from "~/services/gestureDetection";

interface GestureFeedbackProps {
  isActive: boolean;
  lastGesture: GestureType;
}

export function GestureFeedback({ isActive, lastGesture }: GestureFeedbackProps) {
  const [showGesture, setShowGesture] = useState(false);

  useEffect(() => {
    if (lastGesture) {
      setShowGesture(true);
      const timeout = setTimeout(() => setShowGesture(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [lastGesture]);

  return (
    <>
      {/* AI Active Indicator */}
      <div className="fixed bottom-6 left-6 z-50">
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-all",
            isActive
              ? "border-green-500 text-green-500"
              : "border-muted-foreground/30 text-muted-foreground"
          )}
        >
          <Hand
            className={cn(
              "w-5 h-5",
              isActive && "animate-pulse"
            )}
          />
          <span className="text-sm font-medium">
            {isActive ? "AI Active" : "AI Inactive"}
          </span>
        </div>
      </div>

      {/* Gesture Feedback */}
      {showGesture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border-2 border-primary rounded-2xl px-12 py-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
              {lastGesture === "swipe-right" ? (
                <>
                  <ChevronRight className="w-12 h-12 text-primary" />
                  <span className="text-3xl font-bold">Next</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="w-12 h-12 text-primary" />
                  <span className="text-3xl font-bold">Back</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
