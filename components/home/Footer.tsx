import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">KumbhCode</h2>
            <p className="mt-2">Innovate. Create. Inspire.</p>
          </div>
          <div className="w-full md:w-auto">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-gray-600 transition-colors duration-300">
                  <Facebook size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition-colors duration-300">
                  <Twitter size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition-colors duration-300">
                  <Instagram size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-600 transition-colors duration-300">
                  <Linkedin size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>&copy; {new Date().getFullYear()} KumbhCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

