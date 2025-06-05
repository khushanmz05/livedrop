'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 text-gray-800">
      {/* Header */}
      <header className="py-6 shadow bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold">About Us</h1>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        {/* Mission */}
        <section className="mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto">
            We’re building a modern e-commerce experience using the latest tools like <strong>Next.js</strong> and <strong>Firebase</strong>, focused on speed, design, and simplicity.
          </p>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Khushan", role: "Lead Developer" },
            ].map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-xl shadow text-center">
                <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full mb-3" />
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Journey</h2>
          <ul className="space-y-4 border-l-4 border-indigo-500 pl-6">
            <li>
              <span className="font-bold">Week 1</span>: Project inception & planning 🧠
            </li>
            <li>
              <span className="font-bold">Week 2</span>: First prototype release 💻
            </li>
            <li>
              <span className="font-bold">Week 3</span>: Launching the product 🚀
            </li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section className="mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-700 text-lg">
            <span>Next.js</span>
            <span>Firebase</span>
            <span>Tailwind CSS</span>
            <span>Framer Motion</span>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to explore our collection?</h3>
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
          >
            Visit the Shop
          </a>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="py-6 bg-white shadow mt-16">
        <div className="max-w-5xl mx-auto px-4 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} YourStore Inc. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
