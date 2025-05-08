import { useState, useEffect, useRef } from "react"
import { ArrowRight, Linkedin, Github, Mail } from "lucide-react"

const AboutUs = () => {
  // Refs for scroll animations
  const sectionRefs = {
    hero: useRef(null),
    whoWeAre: useRef(null),
    ourStory: useRef(null),
    team: useRef(null),
    cta: useRef(null),
  }

  // State to track which sections are visible
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    whoWeAre: false,
    ourStory: false,
    team: false,
    cta: false,
  })

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  }

  // Team members data
  const teamMembers = [
    {
      name: "Ansh Hathi",
      role: "Full Stack Developer",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "alex@famfolio.com",
    },
    {
      name: "Gaurang Agrawal",
      role: "Full Stack Developer",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "sarah@famfolio.com",
    },
    {
      name: "Ishaan Joshi",
      role: "Full Stack Developer",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "michael@famfolio.com",
    },
    {
      name: "Yash Gokulgandhi",
      role: "Full Stack Developer",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "priya@famfolio.com",
    },
  ]

  // Intersection Observer setup for scroll animations
  useEffect(() => {
    const observers = []
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (!ref.current) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [key]: true }))
          }
        })
      }, observerOptions)

      observer.observe(ref.current)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section
        ref={sectionRefs.hero}
        className={`py-16 px-6 transition-all duration-1000 ease-out ${
          visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Making Family Finances{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Smarter, Together.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mx-auto leading-relaxed max-w-4xl">
            FamFolio is built to help families track, control, and plan their spending — with ease, transparency, and
            discipline.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-blue-100 opacity-30 blur-3xl -z-10"></div>
        <div className="absolute top-60 right-0 w-80 h-80 rounded-full bg-blue-200 opacity-20 blur-3xl -z-10"></div>
      </section>

      {/* Who We Are Section */}
      <section
        ref={sectionRefs.whoWeAre}
        className={`py-12 px-6 transition-all duration-1000 ease-out ${
          visibleSections.whoWeAre ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </span>
              Who We Are
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  In today's digital world, parents face a growing challenge: how to monitor and guide their children's
                  spending habits while teaching financial responsibility. Traditional banking apps aren't designed with
                  family dynamics in mind.
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  FamFolio bridges this gap by creating a unified platform where parents can oversee, allocate, and
                  control family finances while children learn valuable money management skills in a safe, guided
                  environment. We believe financial literacy starts at home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        ref={sectionRefs.ourStory}
        className={`py-12 px-6 transition-all duration-1000 ease-out ${
          visibleSections.ourStory ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </span>
              How It All Started
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">The Observation</h3>
                  <p className="text-gray-700">
                    We observed how difficult it is for parents to track children's spending while teaching them
                    financial responsibility. Most banking apps are designed for individuals, not families.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">The Solution</h3>
                  <p className="text-gray-700">
                    That's why we built FamFolio. We wanted to create a
                    platform that brings transparency to family finances while empowering children to learn about money.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600">🌟</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">The Vision</h3>
                  <p className="text-gray-700">
                    Today, we're expanding FamFolio to become the go-to platform for family financial management,
                    combining parental controls with educational tools that grow with your children.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section
        ref={sectionRefs.team}
        className={`py-12 px-6 transition-all duration-1000 ease-out ${
          visibleSections.team ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">3</span>
            </span>
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white font-bold text-xl transform translate-y-8">
                    {getInitials(member.name)}
                  </div>
                </div>
                <div className="pt-10 p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3 text-sm">{member.role}</p>
                  <div className="flex justify-center space-x-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin size={14} />
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Github size={14} />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs