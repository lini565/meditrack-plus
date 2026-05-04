import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">💊 MediTrack+</h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/add-medicine"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Add Medicine
            </Link>
            <Link
              href="/pharmacy"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Find Pharmacies
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
          💊 Smart Medicine Reminders & <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Pharmacy Locator</span>
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
          Never miss a dose again! Manage your daily medicines, get instant reminders, and find nearby pharmacies all in one place.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition transform border-t-4 border-blue-600">
            <div className="text-5xl mb-4">💊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Manage Medicines
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Add your daily medicines with dosages and times. Keep track of everything in one place.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition transform border-t-4 border-indigo-600">
            <div className="text-5xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Get Reminders
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Smart in-app reminders notify you when it's time to take your medicine.
            </p>
          </div>

          {/* Card 3 */}
          <Link href="/pharmacy">
            <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition transform border-t-4 border-purple-600 cursor-pointer">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Find Pharmacies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Locate nearby pharmacies using your current location on Google Maps.
              </p>
            </div>
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/add-medicine"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-linear-to-r from-gray-800 to-gray-900 text-white text-center py-8 mt-24">
        <p className="font-semibold">
          💊 MediTrack+ © 2026 | Built with ❤️ using Next.js, Supabase & Tailwind CSS
        </p>
        <p className="text-gray-400 mt-2 text-sm">
          Your Personal Medicine Management Solution
        </p>
      </footer>
    </div>
  );
}
