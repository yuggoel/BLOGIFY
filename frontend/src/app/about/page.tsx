export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">B</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Blogify</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your space to write, express, and inspire.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Blogify is a simple and user-friendly platform where anyone can share their 
              thoughts, ideas, and stories. No complicated menus, no messy tools — just a 
              clean and smooth space to write, edit, and publish blogs instantly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who Is This For?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Whether you're a student, developer, writer, or someone who simply loves 
              expressing ideas, Blogify makes blogging feel natural and enjoyable. Create 
              your own account, write what matters to you, explore posts from others, and 
              build your digital voice — all in one place.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <li>User signup & login</li>
              <li>Create, edit & delete blogs</li>
              <li>Clean and responsive UI</li>
              <li>Explore blogs from others</li>
              <li>Personal profile & dashboard</li>
              <li>View other users' profiles</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Python FastAPI</li>
                  <li>• MongoDB + Motor</li>
                  <li>• Pydantic</li>
                  <li>• Uvicorn</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Next.js 14</li>
                  <li>• React 19</li>
                  <li>• Tailwind CSS</li>
                  <li>• TypeScript</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
