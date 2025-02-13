"use client";

import { motion } from "framer-motion";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav className="mb-8 flex w-full max-w-2xl justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            animate={{
              backgroundColor: currentStep === step.id ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.1)",
              color: currentStep === step.id ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}
          </motion.div>
          <motion.span
            className="ml-2"
            animate={{
              color: currentStep === step.id ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.5)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step.label}
          </motion.span>
          {index < steps.length - 1 && (
            <motion.div 
              className="mx-4 h-[2px] w-16"
              animate={{
                backgroundColor: currentStep === step.id ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.2)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </div>
      ))}
    </nav>
  );
}