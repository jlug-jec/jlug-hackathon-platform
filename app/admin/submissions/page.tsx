"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllSubmissions } from "../../actions/submission";
import { FaGithub, FaYoutube, FaImages } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Submission {
  id: string;
  teamName: string;
  teamLeaderEmail: string;
  githubLink: string;
  videoUrl: string;
  problemStatement: string;
  ideation: string;
  problemsFaced: string;
  screenshots: string[];
  status: string;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const result = await getAllSubmissions();
        if (result.success) {
          setSubmissions(result.submissions);
        } else {
          toast.error("Failed to fetch submissions");
        }
      } catch (error) {
        toast.error("Error loading submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-black/90 text-white p-8">
      <Toaster position="top-center" richColors />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Hackathon Submissions
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/10 text-left">
                  <th className="p-4 font-semibold">Team</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Links</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr 
                    key={submission.id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="font-medium">{submission.teamName}</div>
                    </td>
                    <td className="p-4">
                      <a 
                        href={`mailto:${submission.teamLeaderEmail}`}
                        className="text-blue-400 hover:underline"
                      >
                        {submission.teamLeaderEmail}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-4">
                        <a
                          href={submission.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white"
                        >
                          <FaGithub size={20} />
                        </a>
                        <a
                          href={submission.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white"
                        >
                          <FaYoutube size={20} />
                        </a>
                    
                      
                        <button
                          onClick={() => {
                            setSelectedImages(submission.screenshots);
                            setCurrentImageIndex(0);
                            setIsModalOpen(true);
                          }}
                          className="text-white/70 hover:text-white"
                        >
                          <FaImages size={20} />
                        </button>
                        
                        {/* Add this Dialog component right after the button */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogContent className="bg-black/95 p-4 rounded-lg max-w-4xl w-[95vw] border border-white/10">
                            <div className="relative aspect-video">
                              {selectedImages.length > 0 && (
                                <img
                                  src={selectedImages[currentImageIndex]}
                                  alt={`Screenshot ${currentImageIndex + 1}`}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              )}
                              {selectedImages.length > 1 && (
                                <>
                                  <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                  >
                                    <FaArrowLeft className="text-white/90" />
                                  </button>
                                  <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                  >
                                    <FaArrowRight className="text-white/90" />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="mt-4 text-center text-white/60">
                              Screenshot {currentImageIndex + 1} of {selectedImages.length}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        submission.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/60">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}