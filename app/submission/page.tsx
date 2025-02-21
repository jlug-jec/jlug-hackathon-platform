"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/Button";
import { BlurImage } from "../../components/ui/apple-cards-carousel";
import AnimatedStarryBackground from "../../components/ui/AnimatedStarryBackground";
import FloatingPaths from "../../components/ui/FloatingPath";
import { submitProject } from "../actions/submission";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { problemStatements } from "../../lib/problemStatements";
import { Select } from "../../components/ui/select";



export default function SubmissionPage() {
  const router = useRouter();
  
  // Add check for existing submission
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('projectSubmitted');
    if (hasSubmitted) {
      router.push('/hackathon');
    }
  }, [router]);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const problemStatementRef = useRef<HTMLTextAreaElement>(null);
  const ideationRef = useRef<HTMLTextAreaElement>(null);
  const problemsFacedRef = useRef<HTMLTextAreaElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const teamNameRef = useRef<HTMLInputElement>(null);
  const teamLeaderEmailRef = useRef<HTMLInputElement>(null);
  const githubLinkRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      

      // Check file sizes
      const MAX_SIZE = 5 * 1024 * 1024; 
      const oversizedFiles = newFiles.filter(file => file.size > MAX_SIZE);
      
      if (oversizedFiles.length > 0) {
        toast.error(
          `${oversizedFiles.length > 1 ? 'Some images exceed' : 'Image exceeds'} 5MB limit`, 
          {
            description: "Please compress your images or choose smaller ones",
            duration: 5000
          }
        );
        return;
      }

      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  // Update the image display section to use preview URLs
  {imagePreviewUrls.map((previewUrl, index) => (
    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
      <BlurImage
        src={previewUrl}
        alt={`Screenshot ${index + 1}`}
        fill
        className="object-cover"
      />
      <button
        type="button"
        onClick={() => {
          setImages(images.filter((_, i) => i !== index));
          setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
        }}
        className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white
        hover:bg-red-600 transition-all duration-200 z-10
        shadow-lg backdrop-blur-sm"
      >
      </button>
    </div>
  ))}

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const teamName = teamNameRef.current?.value;
      const teamLeaderEmail = teamLeaderEmailRef.current?.value;
      const githubLink = githubLinkRef.current?.value;
      
      if (!teamName) {
        toast.error("Please enter your team name");
        return;
      }

      if (!teamLeaderEmail) {
        toast.error("Please enter team leader's email");
        return;
      }
  
      const submissionData = {
        teamName,
        teamLeaderEmail,
        githubLink,
        problemStatement: problemStatementRef.current?.value || "",
        ideation: ideationRef.current?.value || "",
        problemsFaced: problemsFacedRef.current?.value || "",
        videoUrl: videoUrlRef.current?.value || "",
        screenshots: images,
      };
      
      const result = await submitProject(submissionData);

      if (result.success) {
        toast.success(`Project submitted successfully for team ${teamName}!`);
        // Store submission state and redirect
        localStorage.setItem('projectSubmitted', 'true');
        localStorage.setItem('teamName', teamName);
        setTimeout(() => {
          router.push('/hackathon');
        }, 2000); // Give time for the success message to be seen
      } else {
        toast.error("Failed to submit project");
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black/80 text-white py-20 px-4 md:px-10">
         <Toaster position="top-center" richColors />
        <AnimatedStarryBackground />
      <div className="absolute inset-0 -z-10">
        
      </div>
      <div className="absolute inset-0 -z-5">
        <FloatingPaths position={0.5} opacity={0.3} />
        <FloatingPaths position={-0.5} opacity={0.3} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto space-y-8 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Submit Your Project
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Team Name</label>
            <Input 
              ref={teamNameRef}
              placeholder="Enter your team name..."
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Team Leader's Email</label>
            <Input 
              ref={teamLeaderEmailRef}
              type="email"
              placeholder="Enter team leader's email..."
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">GitHub Repository Link</label>
            <Input 
              ref={githubLinkRef}
              type="url"
              placeholder="Enter your project's GitHub repository link..."
              className="bg-white/5 border-white/10 text-white"
              pattern="https://github.com/.*"
              title="Please enter a valid GitHub repository URL"
              required
            />
          </div>

          

          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Problem Statement</label>
            <select
              ref={problemStatementRef}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            >
              <option value="" disabled selected>Select a problem statement...</option>
              {problemStatements.map((statement,index) => (
                <option key={statement.id} value={statement.id}>
                  Problem Id:{index + 1} {statement.id}
                </option>
              ))}
            </select>
     
          </div>

          
          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Ideation</label>
            <Textarea 
              ref={ideationRef}
              placeholder="Explain your solution and approach..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Problems Faced</label>
            <Textarea 
              ref={problemsFacedRef}
              placeholder="What challenges did you encounter?"
              className="min-h-[100px] bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Video URL</label>
            <Input 
              ref={videoUrlRef}
              type="url"
              placeholder="YouTube unlisted video URL"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-white/70">Screenshots</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {imagePreviewUrls.map((previewUrl, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <BlurImage
                    src={previewUrl || null}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(previewUrl);
                      setImages(prev => prev.filter((_, i) => i !== index));
                      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white
                    hover:bg-red-600 transition-all duration-200 z-10
                    shadow-lg backdrop-blur-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="aspect-video flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                  <span className="text-white/60">+ Add Image</span>
                </label>
              )}
            </div>
            <p className="text-sm text-white/40 mt-1">Upload up to 6 screenshots</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 text-white/90 py-3 px-8 rounded-full 
            hover:from-purple-600 hover:via-blue-600 hover:to-purple-700 
            hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25
            disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
            transition-all duration-300 ease-out backdrop-blur-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full"
                />
                Submitting...
              </span>
            ) : (
              "Submit Project"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}