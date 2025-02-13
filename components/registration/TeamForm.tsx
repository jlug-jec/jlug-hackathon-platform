"use client";

import { useEffect, useState } from "react";
import { TeamFormSchema, TeamFormData } from "@/lib/schemas/team";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { InputField } from "../ui/InputField";
import { MemberFields } from "./MemberFields";
import { MemberCard } from "./MemberCard";

type FieldErrors = {
  [K in keyof TeamFormData]?: any;
} & {
  teamMembers?: any[];
};

interface TeamFormProps {
  data: TeamFormData;
  onChange: (data: TeamFormData) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function TeamForm({ data, onChange, onValidityChange }: TeamFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
      onChange({
        ...data,
        teamLeader: {
          ...data.teamLeader,
          name: session.user.name,
          email: session.user.email
        }
      });
    }
  }, [session]);

  const validateForm = () => {
    setTouched(true);
    try {
      TeamFormSchema.parse(data);
      setErrors({});
      onValidityChange?.(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FieldErrors = {};
        error.errors.forEach((err) => {
          const path = err.path;
          if (path[0] === 'teamMembers') {
            if (!fieldErrors.teamMembers) fieldErrors.teamMembers = [];
            const index = parseInt(path[1] as string);
            if (!fieldErrors.teamMembers[index]) fieldErrors.teamMembers[index] = {};
            fieldErrors.teamMembers[index][path[2] as string] = err.message;
          } else if (path.length > 1) {
            if (!fieldErrors[path[0] as keyof TeamFormData]) {
              fieldErrors[path[0] as keyof TeamFormData] = {};
            }
            fieldErrors[path[0] as keyof TeamFormData][path[1]] = err.message;
          } else {
            fieldErrors[path[0] as keyof TeamFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        onValidityChange?.(false);
      }
      return false;
    }
  };

  const handleChange = (path: string[], value: string) => {
    let newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    onChange(newData);
  };

  const handleAddMember = () => {
    if (data.teamMembers.length >= 4) return;
    onChange({
      ...data,
      teamMembers: [
        ...data.teamMembers,
        { name: "", email: "", phone: "", enrollment: "" }
      ]
    });
  };

  const handleRemoveMember = (index: number) => {
    if (data.teamMembers.length <= 3) return;
    onChange({
      ...data,
      teamMembers: data.teamMembers.filter((_, i) => i !== index)
    });
  };

  useEffect(() => {
    const form = document.querySelector('form');
    if (form) {
      const handleSubmit = (e: Event) => {
        e.preventDefault();
        validateForm();
      };
      form.addEventListener('submit', handleSubmit);
      return () => form.removeEventListener('submit', handleSubmit);
    }
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="bg-white/5 p-4 sm:p-6 rounded-lg border border-white/10">
        <h3 className="text-white text-lg font-medium mb-4">Team Information</h3>
        <InputField
          label="Team Name"
          type="text"
          value={data.teamName}
          onChange={(value) => handleChange(["teamName"], value)}
          error={touched ? errors.teamName as string : undefined}
        />
      </div>

      <div className="bg-white/5 p-4 sm:p-6 rounded-lg border border-white/10">
        <h3 className="text-white text-lg font-medium mb-4">Team Leader</h3>
        <MemberFields
          prefix={["teamLeader"]}
          member={data.teamLeader}
          handleChange={handleChange}
          errors={touched ? errors : {}}
          isLeader={true}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-white text-lg font-medium">
            Team Members ({data.teamMembers.length}/4)
          </h3>
          {data.teamMembers.length < 4 && (
            <button
              onClick={handleAddMember}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Add Member
            </button>
          )}
        </div>
        {data.teamMembers.length < 3 && touched && (
          <p className="text-yellow-500 text-sm">Minimum 3 team members required</p>
        )}
        <div className="grid grid-cols-1 md:block gap-4">
          {data.teamMembers.map((member, index) => (
            <MemberCard
              key={index}
              member={member}
              index={index}
              onRemove={handleRemoveMember}
              errors={touched ? errors : {}}
              handleChange={handleChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
