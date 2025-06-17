'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  const cards = [
    {
      title: 'Team',
      frontContent: 'Meet Our Talented Team',
      backContent: (
        <>
          <p className="mb-2">👩‍💻 <strong>Khushan</strong> — Lead Developer</p>
        </>
      ),
    },
    {
      title: 'Mission',
      frontContent: 'Our Mission Statement',
      backContent: (
        <p>
          To build a lightning-fast, user-friendly e-commerce platform combining
          sleek design with robust technology — using <strong>Next.js</strong> and <strong>Firebase</strong>.
        </p>
      ),
    },
    {
      title: 'Customer Trust',
      frontContent: 'Trusted by Customers',
      backContent: (
        <p>
          Over <strong>1,000+ happy customers</strong> with a <strong>99% satisfaction rate</strong>.
          We value transparency, quality, and your happiness.
        </p>
      ),
    },
  ]

  const coreValues = [
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We constantly push boundaries to create cutting-edge solutions.',
    },
    {
      icon: '🤝',
      title: 'Integrity',
      description: 'Honesty and transparency guide everything we do.',
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description: 'Building products with respect for people and the planet.',
    },
    {
      icon: '🚀',
      title: 'Excellence',
      description: 'Delivering high-quality results with passion and precision.',
    },
  ]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 min-h-screen text-white font-poppins transition-colors duration-300">
        <header className="py-16 text-center px-6">
          <h1 className="text-6xl font-extrabold mb-4 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 drop-shadow-lg">
            About Us
          </h1>
          <p className="text-2xl opacity-95 max-w-xl mx-auto font-semibold drop-shadow-md">
            Driven by a deep passion for innovation and built with meticulous precision, our solutions are designed to exceed expectations. Every detail is thoughtfully crafted to deliver outstanding performance and reliability. At the heart of our work lies a commitment to excellence, ensuring that what we create not only meets your needs but also inspires confidence and lasting value.
          </p>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-20">
          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center gap-20 flex-wrap"
          >
            {cards.map(({ title, frontContent, backContent }, i) => (
              <div
                key={i}
                className="group perspective w-80 h-96 cursor-pointer"
              >
                <div className="relative w-full h-full duration-700 transform-style preserve-3d group-hover:rotate-y-180 rounded-xl shadow-2xl">
                  {/* Front Side */}
                  <div className="backface-hidden bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 rounded-xl flex flex-col justify-center items-center p-10 text-center shadow-lg">
                    <h2 className="text-4xl font-extrabold mb-6 tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      {title}
                    </h2>
                    <p className="text-xl font-semibold text-white drop-shadow-md">
                      {frontContent}
                    </p>
                  </div>

                  {/* Back Side */}
                  <div className="backface-hidden rotate-y-180 bg-black bg-opacity-90 border-4 border-pink-600 rounded-xl shadow-2xl p-8 flex items-center justify-center text-center text-pink-400 font-semibold text-lg leading-relaxed tracking-wide drop-shadow-[0_0_10px_rgba(255,105,180,0.8)]">
                    <div>{backContent}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Core Values Section */}
          <section className="mt-32 max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 drop-shadow-lg">
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {coreValues.map(({ icon, title, description }, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-tr from-pink-600 via-red-600 to-yellow-500 rounded-2xl p-8 shadow-lg text-center cursor-default transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-6xl mb-4">{icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">
                    {title}
                  </h3>
                  <p className="text-white font-semibold leading-relaxed drop-shadow-sm">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="py-6 border-t border-pink-700 text-center text-sm text-pink-300 font-semibold tracking-wide">
          © {new Date().getFullYear()} Livedrop Inc. All rights reserved.
        </footer>

        <style jsx>{`
          .perspective {
            perspective: 1500px;
          }
          .transform-style {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 1rem;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .group:hover .group-hover\\:rotate-y-180 {
            transform: rotateY(180deg);
          }
          /* Poppins font fallback */
          :global(.font-poppins) {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>
      </div>
    </>
  )
}
