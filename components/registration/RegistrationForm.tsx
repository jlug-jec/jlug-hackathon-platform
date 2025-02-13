"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { useSession } from "next-auth/react";
import { Toaster, toast } from 'sonner';
import { checkAndCreateTeam } from "@/app/actions/team";
import { useRouter } from "next/navigation";
import { TeamFormData } from "@/lib/schemas/team";
import { TeamResponse } from "@/types";


export type Step = {
  id: string;
  label: string;
  component: React.ComponentType<any>;
};

interface RegistrationFormProps {
  steps: Step[];
  initialData: TeamFormData;  
}

export function RegistrationForm({ steps, initialData }: RegistrationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>(steps[0].id);
  const [formData, setFormData] = useState(initialData);
  const [isValid, setIsValid] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { data:session } = useSession();


  useEffect(() => {
    async function checkTeam() {
      if (!session) return; // Wait for session to be available
      
      if (session?.user?.email) {
        const result = await checkAndCreateTeam(session.user.email, null) as TeamResponse;
        if (result.exists && result.team) {
          if (result.team.paymentScreenshot) {
            toast.info("You have already completed registration!");
            router.push('/hackathon');
            return;
          }

          setFormData(prev => ({
            ...prev,
            teamName: result.team.teamName,
            teamLeader: result.team.teamLeader,
            teamMembers: result.team.teamMembers,
            ...result.team
          }));
         
          setCurrentStep(steps[1].id);
          toast.info("Your team data has been loaded!");
        }
      }
      setIsInitialLoading(false);
    }
    checkTeam();
  }, [session, router]);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const CurrentStepComponent = steps[currentStepIndex].component;
  
  const validateForm = async (): Promise<boolean> => {
    if (formRef.current) {
      const form = formRef.current;
      // Trigger the validation in the current step component
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      return isValid;
    }
    return false;
  };


  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (currentStepIndex > 0) {
      // Allow going back to edit team details
      setCurrentStep(steps[currentStepIndex - 1].id);
      setIsValid(true); 
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const isValid = await validateForm();
      if (!isValid) {
        toast.error('Please fill all required fields correctly');
        
        setIsLoading(false);
        return;
      }

      // For the final step, just submit without moving to next step
      if (currentStepIndex === steps.length - 1) {
        const result = await checkAndCreateTeam(session?.user?.email!, {
          ...formData,
          paymentVerified: false
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success('Registration completed successfully!');
        router.push('/hackathon');
        return;
      }

      // For other steps
      if (currentStepIndex === 0) {
        const serializedData = {
          ...formData,
          createdAt: Date.now(),
        };

        const result = await checkAndCreateTeam(session?.user?.email!, serializedData);
        
        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
      }

      // Only move to next step if not on final step
      setCurrentStep(steps[currentStepIndex + 1].id);

    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white/10 p-8 rounded-2xl flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white">Checking registration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
      <Toaster position="top-center" richColors />
      <StepIndicator steps={steps} currentStep={currentStep} />

      <motion.div
        className="w-full max-w-2xl rounded-2xl bg-white/10 p-8 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          CodeKumbh Registration
        </h1>

        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <CurrentStepComponent
              data={formData}
              onChange={(newData: any) => setFormData({ ...formData, ...newData })}
              onValidityChange={setIsValid}
            />
          </form>
        </motion.div>

        <motion.div 
          className="mt-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleBack}
            className={`px-6 py-2 rounded-lg ${
              currentStepIndex === 0
                ? "invisible"
                : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </div>
            ) : (
              currentStepIndex === steps.length - 1 ? "Submit" : "Next"
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}