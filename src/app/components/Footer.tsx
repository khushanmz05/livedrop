export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">LiveDrop</span>. All rights reserved.
          </p>
  
          {/* Optional Links */}
          {/* <div className="mt-2 space-x-4 text-sm">
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </div> */}
        </div>
      </footer>
    )
  }
  