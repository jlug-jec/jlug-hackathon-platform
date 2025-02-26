export default function Loading() {
  return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
       
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-t-4 border-l-4 border-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-r-4 border-pink-500 rounded-full animate-spin-slow"></div>
          </div>
          <p className="mt-4 text-white/80">Loading amazing projects...</p>
        </div>
      </div>
  );
}