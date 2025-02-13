interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  error, 
  placeholder,
  disabled 
}: InputFieldProps) => (
  <div>
    <label className="block text-white text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required
      className={`w-full px-4 py-2 rounded-lg bg-white/5 border 
        ${error ? 'border-red-500' : 'border-white/10'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        text-white focus:outline-none focus:border-white/30`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);