'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import CardNav from "@/components/navigation/CardNav"
import LogoLoop from "@/components/ui/logo-loop/LogoLoop"
import TextType from "@/components/ui/text-type/TextType"
import ScrollFloat from "@/components/ui/scroll-float/ScrollFloat"
import CountUp from "@/components/ui/count-up/CountUp"
import LiquidEther from "@/components/ui/liquid-ether/LiquidEther"
import { Code2, Database, Briefcase, GraduationCap, Eye, Mail, FileText } from "lucide-react"
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiNodedotjs,
  SiFastapi,
  SiPytorch,
  SiLinkedin,
  SiGithub
} from 'react-icons/si'

export default function Home() {
  const navItems = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Introduction", ariaLabel: "About Introduction", href: "#intro" },
        { label: "Skills", ariaLabel: "About Skills", href: "#skills" }
      ]
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects", href: "#projects" },
        { label: "All Projects", ariaLabel: "All Projects", href: "/notes" }
      ]
    },
    {
      label: "Blog",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Latest Posts", ariaLabel: "Latest Blog Posts", href: "/blog" },
        { label: "Archive", ariaLabel: "Blog Archive", href: "/blog" }
      ]
    }
  ]

  const technologies = [
    { name: "C++", category: "Language" },
    { name: "Java", category: "Language" },
    { name: "Python", category: "Language" },
    { name: "JavaScript", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "SQL", category: "Database" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "FastAPI", category: "Backend" },
    { name: "PyTorch", category: "ML" },
    { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "Docker", category: "DevOps" },
    { name: "Git", category: "Tools" },
    { name: "TailwindCSS", category: "Styling" }
  ]

  const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { node: <SiPython />, title: "Python", href: "https://www.python.org" },
    { node: <SiCplusplus />, title: "C++", href: "https://isocpp.org" },
    { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
    { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
    { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
    { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
    { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
    { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiPytorch />, title: "PyTorch", href: "https://pytorch.org" }
  ]

  return (
    <div className="min-h-screen relative bg-black">
      <div className="fixed inset-0 z-0 bg-black">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <div className="relative z-10">
        <CardNav
          logo="/logo.svg"
          logoAlt="Obscur Logo"
          items={navItems}
          baseColor="rgba(0, 0, 0, 0.95)"
          menuColor="#e0d0f0"
          buttonBgColor="#000"
          buttonTextColor="#fff"
        />

      {/* Hero Section */}
      <section id="intro" className="pt-32 pb-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-amber-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Hi, I'm{' '}
                <TextType
                  as="span"
                  text={["Minh Gia Nguyen", "a Full-Stack Developer", "a CS Student"]}
                  typingSpeed={75}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="|"
                  className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent inline-block"
                />
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-amber-200 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                Junior Comp Sci @ Michigan State University
              </h2>
              <p className="text-lg text-amber-100/80 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                Fullstack developer with experience in backend engineering, machine learning, and cloud computing <br></br>
                Often dabble in algorithms and other interesting topics <br></br>
                Building scalable applications and hoping it deploys <br></br>
              </p>
            </div>

            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {/* Email Icon */}
              <a
                href="mailto:strychn2005@gmail.com"
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Email me"
                title="Email"
              >
                <Mail className="w-6 h-6" />
              </a>

              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/in/minh-gia-nguyen-884792257/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Visit my LinkedIn profile"
                title="LinkedIn"
              >
                <SiLinkedin className="w-6 h-6" />
              </a>

              {/* GitHub Icon */}
              <a
                href="https://github.com/MinhGiaNgy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Visit my GitHub profile"
                title="GitHub"
              >
                <SiGithub className="w-6 h-6" />
              </a>

              {/* Resume/Document Icon */}
              <a
                href="/resume.pdf"
                download
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all hover:scale-110 shadow-lg"
                aria-label="Download my resume"
                title="Resume"
              >
                <FileText className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="container max-w-6xl mx-auto">
          <h3 className="text-center text-sm font-semibold text-amber-300/80 mb-8 uppercase tracking-wider">
            Technologies I Work With
          </h3>
          <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
            <LogoLoop
              logos={techLogos}
              speed={120}
              direction="left"
              logoHeight={48}
              gap={40}
              hoverSpeed={20}
              scaleOnHover
              fadeOut
              ariaLabel="Technology stack"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <ScrollFloat
            containerClassName="mb-12"
            textClassName="text-2xl font-bold text-amber-50"
            animationDuration={1.2}
            ease="back.out(1.7)"
          >
            Experience & Education
          </ScrollFloat>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow bg-purple-900/20 border-purple-800/30">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-amber-50">Backend Engineering Intern</h3>
                <p className="text-sm text-amber-200/60">VPBank • May 2025 – Aug 2025</p>
                <p className="text-amber-100/70">
                  Maintained and optimized RESTful APIs for Omnichannel Banking core services at Vietnam's largest private bank.
                  Improved system reliability and collaborated on backend refactoring for enhanced scalability.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-purple-900/20 border-purple-800/30">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-amber-50">Undergraduate Learning Assistant</h3>
                <p className="text-sm text-amber-200/60">MSU CSE 320 • Jan 2025 – May 2025</p>
                <p className="text-amber-100/70">
                  Assisted students with C and Assembly programming, circuit design, and debugging in UNIX environments.
                  Moderated Ed Discussion forum and mentored on systems-level problem solving.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-purple-900/20 border-purple-800/30">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-amber-50">Full-Stack Development</h3>
                <p className="text-amber-100/70">
                  Experienced in building modern web applications with MERN stack, FastAPI, and Next.js.
                  Created projects ranging from Discord bots to AI-powered flashcard apps.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-purple-900/20 border-purple-800/30">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-amber-50">Machine Learning Research</h3>
                <p className="text-amber-100/70">
                  Contributed to CVPR 2024 SyntaGen Competition, generating 10k+ synthetic image datasets using Stable Diffusion.
                  Evaluated with DeepLabV3 model for computer vision advancement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <ScrollFloat
            containerClassName="mb-8"
            textClassName="text-2xl font-bold text-amber-50"
            animationDuration={1.2}
            ease="back.out(1.7)"
          >
            Technologies & Skills
          </ScrollFloat>
          <p className="text-lg text-amber-100/70 mb-12">
            Include but not limited to
          </p>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-default bg-purple-900/30 text-amber-100 border-purple-700/50"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black/80">
        <div className="container max-w-5xl mx-auto text-center space-y-6">
          <p className="text-lg text-amber-100/80 max-w-2xl mx-auto">
            Open to internships and full time opportunities in software engineering and fullstack or backend development
            Currently maintaining a 3.5+ GPA while actively building new projects 
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="mailto:strychn2005@gmail.com"
              className="px-8 py-4 bg-purple-600 text-amber-50 rounded-lg font-semibold hover:bg-purple-500 transition-colors shadow-lg"
            >
              Email Me
            </a>
            <a
              href="https://github.com/MinhGiaNgy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-purple-400 text-purple-300 rounded-lg font-semibold hover:bg-purple-600 hover:text-amber-50 transition-colors"
            >
              View GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="py-8 px-6 bg-black/60 border-t border-gray-800/30">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-amber-100/80">
            <Eye className="w-5 h-5" />
            <span className="text-lg font-medium">Visitors:</span>
            <CountUp
              from={0}
              to={1247}
              separator=","
              direction="up"
              duration={2}
              className="text-xl font-bold text-purple-400"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black">
        <div className="container max-w-5xl mx-auto text-center text-amber-200/60 text-sm">
          <p>This is only a passion project by an unemployed junior any other animations or assets are from https://reactbits.dev/</p>
        </div>
      </footer>
      </div>
    </div>
  )
}
