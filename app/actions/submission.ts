"use server";

import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { Submission } from "@/types";

interface SubmissionData {
  problemStatement: string;
  ideation: string;
  problemsFaced?: string; 
  videoUrl: string;
  screenshots: File[];
  teamName: string;
  teamLeaderEmail: string;
  githubLink: string;
}

export async function submitProject(data: SubmissionData) {
  try {
    const uploadedUrls = [];
    for (const file of data.screenshots) {
      try {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return {
          success: false,
          message: "Failed to upload images. Please try again with smaller images or different format."
        };
      }
    }

    const submissionsRef = collection(db, "submissions");
    
    const submission = {
      problemStatement: data.problemStatement,
      ideation: data.ideation,
      problemsFaced: data.problemsFaced || "", 
      videoUrl: data.videoUrl,
      teamName: data.teamName,
      teamLeaderEmail: data.teamLeaderEmail,
      githubLink: data.githubLink,
      screenshots: uploadedUrls,
      createdAt: serverTimestamp(),
      status: "submitted",
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(submissionsRef, submission);

    return {
      success: true,
      submissionId: docRef.id,
      message: "Project submitted successfully!"
    };
  } catch (error) {
    console.error("Error submitting project:", error);
    return {
      success: false,
      message: typeof error === 'string' ? error : "Failed to submit project. Please try again."
    };
  }
}

export async function getAllSubmissions() {
  try {
    const submissionsRef = collection(db, "submissions");
    const querySnapshot = await getDocs(submissionsRef);
    
    const submissions: Submission[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        problemStatement: data.problemStatement,
        ideation: data.ideation,
        problemsFaced: data.problemsFaced || "",
        videoUrl: data.videoUrl,
        screenshots: data.screenshots || [],
        teamName: data.teamName,
        teamLeaderEmail: data.teamLeaderEmail,
        githubLink: data.githubLink,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        status: data.status || "submitted",
      };
    });

    return {
      success: true,
      submissions,
      message: "Submissions fetched successfully"
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return {
      success: false,
      submissions: [],
      message: "Failed to fetch submissions"
    };
  }
}