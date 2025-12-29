import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            The Future of Blogging is Here
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight">
            Share your stories with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">the world.</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Blogify is a modern platform for writers, thinkers, and creators. 
            Join a community of passionate individuals and start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/feed"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold rounded-full hover:opacity-90 transition shadow-lg shadow-indigo-500/25"
            >
              Start Reading
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Modern Editor',
                description: 'Write with distraction-free tools designed for focus and creativity.',
                icon: '✍️',
              },
              {
                title: 'Global Community',
                description: 'Connect with readers and writers from around the globe.',
                icon: '🌍',
              },
              {
                title: 'Dark Mode',
                description: 'Easy on the eyes, perfect for late-night writing sessions.',
                icon: '🌙',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 transition group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
