import { getAllSubmissions } from "../actions/submission";
import { SubmissionCard } from "@/components/projects/Submission";

export default async function HackathonDashboard() {
  const result = await getAllSubmissions();
  const submissions = result.success ? result.submissions : [];

  return (
    <div className="relative min-h-screen">
      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">

          {/* Rest of the content */}
          <div className="relative">
            {submissions.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-medium text-white/70">No submissions yet</h2>
                <p className="mt-2 text-white/50">Check back later for hackathon projects</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-white/90">
                    Showing {submissions.length} project submissions
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {submissions.map((submission) => (
                    <SubmissionCard
                      key={submission.id} 
                      submission={submission}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}