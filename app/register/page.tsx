"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { initialData, registrationSteps } from "@/lib/constants";

export const dynamic = 'force-dynamic'
export default function Home() {

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />
      <RegistrationForm
        steps={registrationSteps}
        initialData={initialData}
      />
    </div>
  );
}
