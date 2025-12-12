import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} NexoraHub. All rights reserved.
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="hover:text-blue-200">About</Link>
            <Link href="/contact" className="hover:text-blue-200">Contact</Link>
            <Link href="/privacy" className="hover:text-blue-200">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-200">Terms</Link>
          </nav>

          <div className="flex items-center gap-3 text-sm text-blue-300">
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-200">Twitter</Link>
            <Link href="https://github.com" target="_blank" className="hover:text-blue-200">GitHub</Link>
          </div>

        </div>
      </div>

      <div className="h-0.5 bg-linear-to-r from-blue-500 to-blue-300" />
    </footer>
  );
}
