import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current && circleRefs.current.length > 0) {
      // Animate circles
      circleRefs.current.forEach((circle, index) => {
        if (circle) {
          gsap.to(circle, {
            scale: 1.2,
            opacity: 0.6,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            delay: index * 0.2,
            ease: "power2.inOut",
          });
        }
      });

      // Animate text
      gsap.from(".loading-text", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
      });

      // Pulse animation for the main logo
      gsap.to(".loading-logo", {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Logo and Spinner */}
        <div className="relative mb-8">
          <div className="loading-logo w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          {/* Animated Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                ref={(el) => (circleRefs.current[i] = el)}
                className="absolute w-32 h-32 border-4 border-blue-500 rounded-full opacity-20"
                style={{
                  transform: `scale(${1 + i * 0.3})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Task Manager Pro
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Initializing system monitoring...
          </p>

          {/* Loading Bar */}
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full loading-bar"
              style={{
                animation: "loadingBar 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-8 space-y-2 text-sm text-gray-500">
          <p
            className="status-message"
            style={{ animation: "fadeInOut 2s ease-in-out 0s infinite" }}
          >
            ✓ Connecting to backend...
          </p>
          <p
            className="status-message"
            style={{ animation: "fadeInOut 2s ease-in-out 0.5s infinite" }}
          >
            ✓ Fetching system statistics...
          </p>
          <p
            className="status-message"
            style={{ animation: "fadeInOut 2s ease-in-out 1s infinite" }}
          >
            ✓ Loading process information...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
