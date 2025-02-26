"use client"

  export default function StarryBackground() {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
        <style jsx>{`
          @keyframes twinkle {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          .stars-small, .stars-medium, .stars-large {
            position: absolute;
            inset: 0;
            background-repeat: repeat;
            animation: twinkle 8s infinite;
          }
          
          .stars-small {
            background-image: radial-gradient(1px 1px at 50% 50%, white, rgba(0,0,0,0));
            background-size: 100px 100px;
            animation-delay: 0s;
          }
          
          .stars-medium {
            background-image: radial-gradient(2px 2px at 50% 50%, white, rgba(0,0,0,0));
            background-size: 200px 200px;
            animation-delay: 2s;
          }
          
          .stars-large {
            background-image: radial-gradient(3px 3px at 50% 50%, white, rgba(0,0,0,0));
            background-size: 300px 300px;
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }