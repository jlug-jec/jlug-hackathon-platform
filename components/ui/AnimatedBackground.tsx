"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      className="fixed inset-0"
      init={particlesInit}
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "#0B0B2B",
          },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: ["#FFD700", "#FF69B4", "#00FFFF", "#9370DB", "#F8F8FF"],
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.08,
            width: 0.8,
          },
          move: {
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 0.6,
            straight: false,
            trail: {
              enable: true,
              length: 4,
              fillColor: "#0B0B2B",
            },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: {
              enable: true,
              area: 1200,
            },
            value: 120,
          },
          opacity: {
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
              sync: false,
            },
            value: { min: 0.1, max: 0.9 },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 4 },
            animation: {
              enable: true,
              speed: 1.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.08,
              opacity: 1,
              color: {
                value: ["#FFD700", "#F8F8FF"],
              },
            },
          },
          life: {
            duration: {
              sync: false,
              value: 3,
            },
            count: 0,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["bubble", "connect"],
            },
          },
          modes: {
            bubble: {
              distance: 200,
              size: 5,
              duration: 0.4,
              opacity: 0.6,
            },
            connect: {
              distance: 80,
              links: {
                opacity: 0.2,
              },
              radius: 60,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}