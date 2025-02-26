import AnimatedStarryBackground from "@/components/ui/AnimatedStarryBackground";
import StarryBackground from "@/components/ui/StarryBackground";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      <div className="fixed inset-0">
        <AnimatedStarryBackground />
      </div>
      <div className="fixed inset-0">
        <StarryBackground />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <header className="py-12 mb-8 text-center border-b border-purple-500/20">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
              CodeKumbh Showcase
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover innovative solutions and creative projects developed by talented teams during our hackathon
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}