// import Link from "next/link"
// import { Terminal } from "lucide-react"

// export function Footer() {
//   return (
//     <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm">
//       <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
//         <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
//               <Terminal className="h-4 w-4 text-primary" />
//             </div>
//             <span className="font-bold text-foreground">
//               CodeKumbh<span className="text-primary">2.0</span>
//             </span>
//           </Link>

//           <div className="flex flex-wrap items-center justify-center gap-5">
//             <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               About
//             </Link>
//             <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Register
//             </Link>
//             <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Submit
//             </Link>
//             <Link
//               href="/submissions"
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               Submissions
//             </Link>
//             <Link
//               href="/admin/attendance"
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               Admin
//             </Link>
//           </div>

//           <p className="text-sm text-muted-foreground">CodeKumbh 2.0. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from "next/link"
import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        
        {/* Top Footer Row */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">
              CodeKumbh<span className="text-primary">2.0</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Register
            </Link>
            <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submit
            </Link>
            <Link href="/submissions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submissions
            </Link>
            <Link href="/admin/attendance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            CodeKumbh 2.0. All rights reserved.
          </p>
        </div>

        {/* Bottom Contact Line */}
        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
          For queries or help, contact: <span className="text-primary ml-1">8225950514, 8303977136</span> . Or Email at
          <span className="text-primary ml-1">
            jlug.jec@gmail.com
          </span>
        </div>

      </div>
    </footer>
  )
}