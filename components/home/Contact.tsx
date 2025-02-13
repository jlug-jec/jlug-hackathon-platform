import { Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail size={20} className="mr-4" />
                <span>info@kumbhcode.com</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-4" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <MapPin size={20} className="mr-4" />
                <span>123 Hackathon St, Tech City, TC 12345</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Send us a Message</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-2 bg-white text-black rounded" />
              <input type="email" placeholder="Your Email" className="w-full p-2 bg-white text-black rounded" />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-2 bg-white text-black rounded"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-white text-black py-2 rounded transition-colors duration-300 hover:bg-gray-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

