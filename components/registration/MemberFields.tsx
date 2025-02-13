import { InputField } from "../ui/InputField";

interface MemberFieldsProps {
  prefix: string[];
  member: any;
  handleChange: (path: string[], value: string) => void;
  errors: any;
  index?: number;
  isLeader?: boolean;
}

export const MemberFields = ({
  prefix,
  member,
  handleChange,
  errors,
  index,
  isLeader
}: MemberFieldsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <InputField
      label="Name"
      type="text"
      value={member.name}
      onChange={(value) => handleChange([...prefix, "name"], value)}
      error={index !== undefined ? errors?.teamMembers?.[index]?.name : errors?.teamLeader?.name}
      disabled={isLeader}
    
    />
    <InputField
      label="Email"
      type="email"
      value={member.email}
      onChange={(value) => handleChange([...prefix, "email"], value)}
      error={index !== undefined ? errors?.teamMembers?.[index]?.email : errors?.teamLeader?.email}
      disabled={isLeader}
    />
    <InputField
      label="Phone Number"
      type="tel"
      value={member.phone}
      onChange={(value) => handleChange([...prefix, "phone"], value)}
      error={index !== undefined ? errors?.teamMembers?.[index]?.phone : errors?.teamLeader?.phone}
    />
    <InputField
      label="Enrollment Number"
      type="text"
      value={member.enrollment}
      onChange={(value) => handleChange([...prefix, "enrollment"], value)}
      error={index !== undefined ? errors?.teamMembers?.[index]?.enrollment : errors?.teamLeader?.enrollment}
    />
  </div>
);