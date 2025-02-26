"use client"
import { Submission } from "@/types";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaGithub, 
    FaCalendarAlt,
    FaCode,
    FaLightbulb,
    FaLink,
    FaEnvelope,
    FaPlay,
    FaImage
  } from "react-icons/fa";

  // Hook to detect element visibility
const useElementOnScreen = (options: IntersectionObserverInit) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
  
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);
      
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
  
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, [containerRef, options]);
  
  
    return [containerRef, isVisible] as const;
  };

  
export const SubmissionCard = ({ submission }: { submission: Submission }) => {
    // Create an array that includes both video and images for unified navigation
    const mediaItems = [
      { type: 'video', url: submission.videoUrl },
      ...submission.screenshots.map(url => ({ type: 'image', url }))
    ];
    
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [cardRef, isVisible] = useElementOnScreen({
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
  
    // Function to convert YouTube URL to embed URL with autoplay and mute
    const getEmbedUrl = (url: string) => {
      const videoId = url.match(/(youtube\.com|youtu\.be)\/(watch\?v=)?([^&]+)/)?.[3];
      return `https://youtube.com/embed/${videoId}?autoplay=${isVisible ? '1' : '0'}&mute=1`;
    };
  
    return (
      <motion.div 
        ref={cardRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-gray-900 to-black/80 border border-purple-500/20 rounded-xl overflow-hidden shadow-lg mb-12"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Unified Media Section */}
          <div className="lg:w-2/5 xl:w-1/2">
            <div className="h-full flex flex-col">
              {/* Main Media Display Area */}
              <div className="relative bg-black aspect-video w-full">
                <AnimatePresence mode="wait">
                  {mediaItems[selectedMediaIndex].type === 'video' ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {isVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                      )}
                      <iframe 
                        src={getEmbedUrl(mediaItems[selectedMediaIndex].url)}
                        className="w-full h-full"
                        title={`${submission.teamName} Demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsVideoLoading(false)}
                      />
                    </motion.div>
                  ) : (
                    <motion.img
                      key={`image-${selectedMediaIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={mediaItems[selectedMediaIndex].url}
                      alt={`${submission.teamName} Screenshot ${selectedMediaIndex}`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </AnimatePresence>
                
              
                
                {/* Media Counter */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white/80 text-xs px-3 py-1.5 rounded-full">
                  {selectedMediaIndex + 1} / {mediaItems.length}
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="p-4 bg-black/40">
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white/70">Project Media</h3>
                </div>
                
                <div 
                  ref={scrollRef} 
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                >
                  {mediaItems.map((item, idx) => (
                    <button
                      id={`thumbnail-${submission.id}-${idx}`}
                      key={idx}
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`relative flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-colors ${
                        idx === selectedMediaIndex 
                          ? 'border-purple-500' 
                          : 'border-transparent hover:border-purple-500/50'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <>
                          {/* Video Thumbnail (placeholder) */}
                          <div className="w-full h-full bg-black/80 flex items-center justify-center">
                            <FaPlay size={16} className="text-white/80" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-purple-600/80 py-0.5 text-xs text-center text-white">
                            Video
                          </div>
                        </>
                      ) : (
                        <>
                          <img 
                            src={item.url} 
                            alt={`Media ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-xs text-center text-white">
                            <FaImage size={8} className="inline mr-1" /> {idx}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content Section */}
          <div className="lg:w-3/5 xl:w-1/2 p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {submission.teamName}
              </h2>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                submission.status === 'pending' 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {submission.status === 'pending' ? 'Under Review' : 'Approved'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={submission.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors text-sm"
              >
                <FaGithub size={14} />
                <span>GitHub Repo</span>
              </a>
              <a
                href={`mailto:${submission.teamLeaderEmail}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors text-sm"
              >
                <FaEnvelope size={14} />
                <span>Contact Team</span>
              </a>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-lg text-sm">
                <FaCalendarAlt size={14} />
                <span>{new Date(submission.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <FaCode size={14} />
                  <h3 className="font-medium">Problem Statement</h3>
                </div>
                <p className="text-white/80">{submission.problemStatement}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-pink-400 mb-2">
                  <FaLightbulb size={14} />
                  <h3 className="font-medium">Our Solution</h3>
                </div>
                <p className="text-white/80">{submission.ideation}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <FaLink size={14} />
                  <h3 className="font-medium">Presentation Link/ Deployed Site</h3>
                </div>
                {submission.problemsFaced ? (
                  <a 
                    href={submission.problemsFaced}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all inline-block max-w-full"
                  >
                    {submission.problemsFaced.length > 60 
                      ? `${submission.problemsFaced.substring(0, 60)}...` 
                      : submission.problemsFaced}
                  </a>
                ) : (
                  <p className="text-white/60">No link provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };