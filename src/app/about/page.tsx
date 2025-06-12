'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '1,000+', label: 'Happy Customers' },
  { value: '50+', label: 'Products Shipped' },
  { value: '99%', label: 'Satisfaction Rate' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 text-gray-800">
      {/* Header */}
      <header className="py-6 shadow bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold tracking-tight">About Us</h1>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 py-12 space-y-20"
      >
        {/* Vision */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <blockquote className="italic text-lg max-w-2xl mx-auto text-gray-600">
            “To redefine online shopping by merging aesthetics with performance — one product at a time.”
          </blockquote>
        </section>

        {/* Mission */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto">
            We’re building a modern e-commerce experience using cutting-edge tools like <strong>Next.js</strong> and <strong>Firebase</strong>, with a focus on speed, design, and simplicity.
          </p>
        </section>

        {/* Team Section */}
        <section>
  <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[
      { name: 'Khushan', role: 'Lead Developer', image: '../kk.jpeg' },
    ].map((member) => (
      <div
        key={member.name}
        className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition"
      >
        {/* Replace colored circle with image */}
        <img
          src={member.image}
          alt={`${member.name}'s photo`}
          className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
        />
        <h4 className="font-semibold text-lg">{member.name}</h4>
        <p className="text-sm text-gray-600">{member.role}</p>
      </div>
    ))}
  </div>
</section>

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Journey</h2>
          <ul className="space-y-4 border-l-4 border-indigo-500 pl-6 text-gray-700">
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

        {/* Stats */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-6">By the Numbers</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {stats.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.2, duration: 0.5 }}
                className="text-indigo-600 font-semibold text-xl"
              >
                <p>{item.value}</p>
                <p className="text-sm text-gray-500 font-normal">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="text-center">
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
