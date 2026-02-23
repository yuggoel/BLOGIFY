import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">Blogify</span>
            </div>
            <p className="text-slate-300 max-w-md">
              Everyone needs a little space where they can learn, practice, and produce
              something. Blogify is a community that gives the students a chance to do all of
              that.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-300 hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-300 hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-slate-300">
          <p>Blogify &copy; {new Date().getFullYear()} | Built with Next.js &amp; MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
