import Image from "next/image"
import { FaInstagram, FaLinkedin } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-6 md:mb-0 flex items-center gap-4">
            <Image 
              src="https://jlug.club/assets/JLUG-b26f7b6c.jpg"
              alt="JLUG Logo"
              width={50}
              height={50}
              className="rounded-full border border-white/20"
            />
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-300">
                CodeKumbh
              </h2>
              <p className="mt-2 text-white/70">Innovate. Create. Inspire.</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <ul className="flex space-x-6">
              <li>
                <a href="https://instagram.com/jlug_jec" className="text-white/70 hover:text-purple-400 transition-colors duration-300">
                  <FaInstagram size={24} />
                </a>
              </li>
              <li>
                <a href="https://in.linkedin.com/company/jlug-jec" className="text-white/70 hover:text-purple-400 transition-colors duration-300">
                  <FaLinkedin size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60">
            &copy; {new Date().getFullYear()} CodeKumbh. Powered by{' '}
            <a 
              href="https://jlug.club" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white  transition-colors"
            >
              JLUG
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

