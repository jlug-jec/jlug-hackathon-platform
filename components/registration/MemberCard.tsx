import { MemberFields } from "./MemberFields";

interface MemberCardProps {
  member: any;
  index: number;
  onRemove: (index: number) => void;
  errors: any;
  handleChange: (path: string[], value: string) => void;
}

export const MemberCard = ({ 
  member, 
  index, 
  onRemove, 
  errors, 
  handleChange 
}: MemberCardProps) => (
  <div className="bg-white/5 p-6 rounded-lg relative border border-white/10">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-white font-medium">Team Member {index + 1}</h4>
      {index > 0 && (
        <button
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition-colors"
          aria-label="Remove member"
        >
          ×
        </button>
      )}
    </div>
    <MemberFields
      prefix={["teamMembers", index.toString()]}
      member={member}
      handleChange={handleChange}
      errors={errors}
      index={index}
    />
  </div>
);