"use client";

import { motion } from "framer-motion";
import FloatingPaths from "../../components/ui/FloatingPath";
import AnimatedStarryBackground from "../../components/ui/AnimatedStarryBackground";
import { problemStatements } from "../../lib/problemStatements";
import { Carousel, Card } from "../../components/ui/apple-cards-carousel";

export default function ProblemsPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <FloatingPaths position={0.5} opacity={0.3} />
      <FloatingPaths position={-0.5} opacity={0.3} />
      <AnimatedStarryBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto p-8 pt-32 space-y-16"
      >
        <div className="space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-medium text-purple-400"
          >
                <p className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-slate-300 dark:text-neutral-800 font-sans">
                Problem Statements
      </p>
          
          </motion.h2>
      
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text"
          >
         
            Theme: Travel & Transportation
          </motion.h1>
        </div>

        {/* <div className="space-y-12">
          {problemStatements.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/20"
            >              
              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Problem  {index+1}</h3>
                  <p>{problem.problem}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
                  <p>{problem.solution}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Impact</h3>
                  <p>{problem.impact}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Optional Features</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {problem.optionalFeatures.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div> */}
        <AppleCardsCarouselDemo/>
      </motion.div>
    </div>
  );
}


 function AppleCardsCarouselDemo() {
  const cards = problemStatements.map((problem, index) => ({
    category: `Problem ${index + 1}`,
    title: problem.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    src: `Problem ${index + 1}`,
    content: (
      <div className="bg-white/5 dark:bg-neutral-800/50 p-8 md:p-14 rounded-3xl mb-4 backdrop-blur-lg">
        <div className="space-y-6 text-white/80">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Problem</h3>
            <p>{problem.problem}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
            <p>{problem.solution}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Impact</h3>
            <p>{problem.impact}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Optional Features</h3>
            <ul className="list-disc list-inside space-y-2">
              {problem.optionalFeatures.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full h-full py-20">
      <Carousel items={cards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))} />
    </div>
  );
}

// Remove the DummyContent and data constants as they're no longer needed
const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
          
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
