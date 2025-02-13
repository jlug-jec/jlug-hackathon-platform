import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function downloadBrochure(){
  const link = document.createElement('a');
  link.href = '/brochure.pdf';
  link.download = 'CodeKumbh_Brochure.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};