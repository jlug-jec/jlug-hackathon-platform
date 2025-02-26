"use client"

export  default function AnimatedStarryBackground() {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="shooting-stars" />
        <style jsx>{`
          @keyframes shoot {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            95% {
              opacity: 1;
            }
            100% {
              transform: translate(120vw, 120vh) rotate(45deg);
              opacity: 0;
            }
          }
      
          .shooting-stars::before,
          .shooting-stars::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, white, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 50px, white, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, white, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, white, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: shoot 15s linear infinite;
            opacity: 0;
          }
      
          .shooting-stars::after {
            animation-delay: 5s;
            background-position: 100px 100px;
          }
        `}</style>
      </div>
    );
  }