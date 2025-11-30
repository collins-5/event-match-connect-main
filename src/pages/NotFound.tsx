import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackgroundImage from "@/components/background-image";
import { Button } from "@/components/ui/button"; // optional, if you have shadcn/ui

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Generate random positions and animation delays for floating 404s
  const floating404s = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 20}s`,
    size: 6 + Math.random() * 8, // text-6xl to text-9xl
  }));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted">
      <BackgroundImage />

      {/* Floating semi-transparent 404s in background */}
      {floating404s.map((item) => (
        <div
          key={item.id}
          className="pointer-events-none absolute animate-float select-none"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          <h1
            className={`font-black tracking-tighter text-destructive/20 rotate-12 opacity-20 blur-sm`}
            style={{ fontSize: `${item.size}rem` }}
          >
            404
          </h1>
        </div>
      ))}

      {/* Main centered content */}
      <div className="relative z-10 text-center">
        <h1 className="mb-6 text-9xl font-black tracking-tighter drop-shadow-2xl">
          <span className="text-destructive">4</span>
          <span className="text-foreground">0</span>
          <span className="text-destructive">4</span>
        </h1>

        <p className="mb-8 text-2xl font-medium text-muted-foreground">
          Oops! This page couldnt be found.
        </p>

        <a href="/">
          <Button size="lg" className="rounded-full px-8 shadow-lg">
            Back to Home
          </Button>
        </a>
      </div>

      <div className="pointer-events-none absolute -top-10 -left-10 -rotate-12 text-9xl font-black text-destructive/10">
        404
      </div>
      <div className="pointer-events-none absolute -top-10 -right-10 rotate-12 text-9xl font-black text-destructive/10">
        404
      </div>
      <div className="pointer-events-none absolute -bottom-10 -left-10 rotate-12 text-9xl font-black text-destructive/10">
        404
      </div>
      <div className="pointer-events-none absolute -bottom-10 -right-10 -rotate-12 text-9xl font-black text-destructive/10">
        404
      </div>
    </div>
  );
};

export default NotFound;
