import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/portrait-warm.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nguyen Van Hau — Full Stack Developer Portfolio" },
      { name: "description", content: "Full Stack Developer Intern crafting modern, animated web experiences with React, TypeScript, Node.js & Go." },
      { property: "og:title", content: "Nguyen Van Hau — Full Stack Developer" },
      { property: "og:description", content: "React · TypeScript · Node.js · Go · Microservices" },
    ],
  }),
  component: Index,
});

const SKILLS = [
  { cat: "Frontend", items: ["React", "TypeScript", "Tailwind", "Vite"], color: "coral" },
  { cat: "Backend", items: ["Node.js", "Express"], color: "violet" },
  { cat: "Database", items: ["MongoDB", "MySQL", "PostgreSQL"], color: "azure" },
  { cat: "DevOps", items: ["Linux", "Docker", "GitHub", "Postman"], color: "amber" },
];

const PROJECTS = [
  {
    name: "GreenCart",
    sub: "E-commerce Platform",
    role: "Solo project",
    date: "06/2025 — 12/2025",
    href: "https://github.com/hauvip123/GREENCART",
    blurb:
      "Built a full-stack e-commerce platform end-to-end with Buyer & Seller flows, role-based auth, a seller dashboard with charts and cloud-backed image management.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Cloudinary", "Recharts"],
    color: "coral",
    grad: "from-[oklch(0.74_0.19_30)] to-[oklch(0.82_0.16_75)]",
  },
  {
    name: "CityVoice",
    sub: "Urban Issue Reporting SPA",
    role: "Team of 4 · Frontend developer",
    date: "12/2025 — 04/2026",
    href: "https://github.com/finnzxje/city-voice",
    blurb:
      "Single-Page App with interactive Leaflet maps — markers, polygons, heatmaps. RBAC for Citizen/Staff/Manager/Admin, strict TypeScript and a polished animated UI.",
    stack: ["React", "TypeScript", "Leaflet", "Framer Motion", "Tailwind", "Axios"],
    color: "violet",
    grad: "from-[oklch(0.55_0.22_290)] to-[oklch(0.7_0.15_230)]",
  },
  {
    name: "E-Shop",
    sub: "E-commerce Web App",
    role: "Team of 4 · Frontend developer",
    date: "08/2025 — 12/2025",
    href: "https://github.com/finnzxje/e-shop",
    blurb:
      "Client-side e-commerce features: catalog, cart, wishlist, checkout. JWT auth, protected routes, global state with Context API + custom hooks.",
    stack: ["React", "TypeScript", "Vite", "React Router", "Context API", "Tailwind"],
    color: "azure",
    grad: "from-[oklch(0.7_0.15_230)] to-[oklch(0.55_0.22_290)]",
  },
];

/* --- Animated number counter --- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const controls = animate(0, to, {
          duration: 1.6,
          ease: "easeOut",
          onUpdate: (v) => setVal(v),
        });
        obs.disconnect();
        return () => controls.stop();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {Number.isInteger(to) ? Math.round(val) : val.toFixed(1)}
      {suffix}
    </span>
  );
}

/* --- Magnetic button --- */
function Magnetic({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* --- Word reveal --- */
function Reveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* --- Cursor blob --- */
function CursorBlob() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 80, damping: 18, mass: 0.6 });
  useEffect(() => {
    const m = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[5] hidden md:block"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-aurora opacity-20 blur-3xl" />
    </motion.div>
  );
}

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [0, -8]);

  const { scrollYProgress: pageScroll } = useScroll();
  const progressX = useTransform(pageScroll, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <CursorBlob />

      {/* scroll progress */}
      <motion.div
        style={{ scaleX: pageScroll }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-aurora origin-left z-[60]"
      />

      {/* NAV */}
      <header className="fixed top-3 inset-x-0 z-50 px-4">
        <div className="max-w-6xl mx-auto glass rounded-full px-5 py-3 flex items-center justify-between shadow-soft">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            hau<span className="text-coral">.</span>dev
          </a>
          <nav className="hidden md:flex gap-7 text-sm font-medium text-muted-foreground">
            {["Work", "Skills", "About", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="relative group">
                {l}
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-aurora scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>
          <Magnetic href="#contact" className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-full inline-block">
            Say hi ✦
          </Magnetic>
        </div>
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
        {/* aurora blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="blob bg-coral w-[500px] h-[500px] -top-32 -left-32" />
          <div className="blob bg-violet w-[460px] h-[460px] top-40 right-0" style={{ animationDelay: "-6s" }} />
          <div className="blob bg-azure w-[420px] h-[420px] bottom-0 left-1/3" style={{ animationDelay: "-12s" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center relative">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-coral" />
              </span>
              Open to internships · Thu Duc, HCM City
            </motion.div>

            <h1 className="font-display font-black tracking-[-0.04em] text-[14vw] lg:text-[8.5vw] leading-[0.92]">
              <Reveal text="Building" />
              <br />
              <Reveal text="delightful" delay={0.15} className="italic font-light text-aurora gradient-shift" />
              <br />
              <Reveal text="web things." delay={0.3} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              I'm <span className="text-foreground font-semibold">Nguyen Van Hau</span> —
              a Full-Stack Developer Intern who turns coffee, Tailwind and a bit of
              chaos into <span className="text-coral font-semibold">user-friendly products</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Magnetic href="#work" className="group bg-foreground text-background rounded-full px-7 py-3.5 font-semibold inline-flex items-center gap-2 shadow-soft">
                See my work
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
              </Magnetic>
              <Magnetic href="https://github.com/hauvip123" className="glass rounded-full px-7 py-3.5 font-semibold">
                GitHub ↗
              </Magnetic>
            </motion.div>
          </div>

          <motion.div style={{ rotate: portraitRotate }} className="lg:col-span-5 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -z-10"
            >
              <div className="absolute inset-8 rounded-full bg-aurora gradient-shift opacity-80 blur-2xl" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img src={portrait} alt="Nguyen Van Hau" width={1024} height={1024} className="relative w-full max-w-md mx-auto" />
            </motion.div>

            {/* floating chips */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-4 glass rounded-2xl px-4 py-2 text-sm font-semibold shadow-soft"
            >
              <span className="text-coral">⚛</span> React
            </motion.div>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-16 -right-2 glass rounded-2xl px-4 py-2 text-sm font-semibold shadow-soft"
            >
              <span className="text-azure">TS</span> TypeScript
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-2 left-12 glass rounded-2xl px-4 py-2 text-sm font-semibold shadow-soft"
            >
              <span className="text-green-500">Nodejs</span> Express
            </motion.div>
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex flex-col items-center gap-2"
        >
          Scroll
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-base"
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border bg-foreground text-background py-5 overflow-hidden -rotate-1 -mx-2 my-6 shadow-soft">
        <div className="marquee flex gap-10 whitespace-nowrap text-3xl md:text-5xl font-display font-black italic">
          {Array.from({ length: 3 }).flatMap((_, k) =>
            ["Frontend", "Full Stack", "React", "TypeScript", "Node.js", "Microservices", "Available 2026"].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10">
                {t} <span className="text-coral">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* STATS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: 3.2, s: "", label: "Current GPA" },
            { v: 3, s: "", label: "Shipped projects" },
            { v: 5, s: "+", label: "Technologies" },
            { v: 2027, s: "", label: "Graduating" },
          ].map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-t border-border pt-6"
            >
              <div className="font-display font-black text-6xl text-aurora gradient-shift">
                <Counter to={m.v} suffix={m.s} />
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex items-end justify-between gap-6 flex-wrap"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-coral mb-3">— Selected work</div>
              <h2 className="font-display font-black text-5xl md:text-7xl tracking-tight">
                Things I've <span className="italic text-aurora gradient-shift">shipped</span>.
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground">{PROJECTS.length} projects · 2025 — 2026</div>
          </motion.div>

          <div className="space-y-8">
            {PROJECTS.map((p, i) => {
              const accentText =
                p.color === "coral" ? "text-coral" : p.color === "violet" ? "text-violet" : "text-azure";
              const accentBorder =
                p.color === "coral" ? "border-coral/40" : p.color === "violet" ? "border-violet/40" : "border-azure/40";
              const accentBg =
                p.color === "coral" ? "bg-coral/10" : p.color === "violet" ? "bg-violet/10" : "bg-azure/10";

              return (
                <motion.article
                  key={p.name}
                  initial={{ opacity: 0, y: 55, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.75, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -10, scale: 1.01 }}
                  className="group relative bg-card rounded-3xl p-6 md:p-10 shadow-soft overflow-hidden border border-border"
                >
                  <div className={`absolute -inset-px rounded-3xl bg-linear-to-br ${p.grad} opacity-0 group-hover:opacity-100 transition duration-500 -z-10`} />
                  <motion.div
                    aria-hidden
                    animate={{ rotate: [0, 18, -8, 0], scale: [1, 1.08, 0.98, 1] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                    className={`absolute -top-32 -right-32 w-72 h-72 rounded-full bg-linear-to-br ${p.grad} opacity-20 blur-3xl group-hover:opacity-45 transition duration-700`}
                  />
                  <motion.div
                    aria-hidden
                    animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    className={`absolute -bottom-28 left-16 h-52 w-52 rounded-full bg-linear-to-br ${p.grad} opacity-0 blur-3xl transition duration-700 group-hover:opacity-25`}
                  />

                  <div className="grid md:grid-cols-12 gap-6 items-start relative">
                    <div className="md:col-span-1">
                      <motion.div
                        whileHover={{ rotate: -8, scale: 1.08 }}
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accentBorder} ${accentBg} font-mono text-sm font-bold ${accentText}`}
                      >
                        0{i + 1}
                      </motion.div>
                    </div>
                    <div className="md:col-span-7">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {[p.date, p.sub, p.role].map((item) => (
                          <motion.span
                            key={item}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -2 }}
                            className={`rounded-full border ${accentBorder} ${accentBg} px-3 py-1 text-[11px] font-mono font-semibold uppercase text-foreground/70`}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                      <h3 className="font-display font-black text-4xl md:text-6xl tracking-tight">
                        <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">
                          {p.name}
                          <span className={accentText}>.</span>
                        </span>
                      </h3>
                      <p className="mt-4 text-foreground/75 leading-relaxed max-w-2xl">{p.blurb}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {p.stack.map((s, stackIndex) => (
                          <motion.span
                            key={s}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: stackIndex * 0.03 }}
                            whileHover={{ y: -3, scale: 1.04 }}
                            className="text-xs font-medium bg-background border border-border rounded-full px-3 py-1 text-muted-foreground transition-colors group-hover:border-foreground/20"
                          >
                            {s}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-4 flex md:justify-end">
                      <motion.a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 text-sm font-semibold border border-border rounded-full px-5 py-2.5 hover:bg-foreground hover:text-background hover:border-foreground transition"
                      >
                        View code
                        <motion.span
                          animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        >
                          ↗
                        </motion.span>
                      </motion.a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="blob bg-amber w-[400px] h-[400px] top-20 left-10 opacity-30" />
          <div className="blob bg-violet w-[400px] h-[400px] bottom-10 right-10 opacity-30" />
        </div>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-coral mb-3">— Toolkit</div>
            <h2 className="font-display font-black text-5xl md:text-7xl tracking-tight">
              My <span className="italic text-aurora gradient-shift">superpowers</span>.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKILLS.map((s, i) => (
              <motion.div
                key={s.cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.03, rotate: -1 }}
                className="glass rounded-2xl p-6 shadow-soft"
              >
                <div className={`text-xs font-mono uppercase tracking-widest mb-4 text-${s.color}`}>// {s.cat}</div>
                <ul className="space-y-2">
                  {s.items.map((it, j) => (
                    <motion.li
                      key={it}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + j * 0.05 }}
                      className="font-medium flex items-center gap-2"
                    >
                      <span className={`text-${s.color}`}>◆</span> {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-coral mb-3">— About</div>
            <h2 className="font-display font-black text-5xl md:text-6xl tracking-tight">
              The <span className="italic text-aurora gradient-shift">human</span> behind the code.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 space-y-6 text-lg leading-relaxed text-foreground/80"
          >
            <p>
              I'm a Software Engineering student at{" "}
              <span className="font-display italic text-foreground">Posts and Telecommunications Institute of Technology</span>{" "}
              (2022 — 2027), currently chasing the perfect balance between
              <span className="text-coral font-semibold"> beautiful UIs</span> and
              <span className="text-violet font-semibold"> solid backends</span>.
            </p>
            <p>
              I've shipped full-stack apps with React, Node.js, MongoDB, and started
              going deeper with <span className="font-semibold">microservices</span>.
              I love clean DX, smooth animations, and writing code my future self can read.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                ["📚", "Currently learning", "Micoservice"],
                ["🧑‍💻", "Working style", "Curious · iterative · ships fast"],
                ["🎯", "Looking for", "Internship Full-stack"],
                ["☕", "Powered by", "Tea"],
              ].map(([e, k, v]) => (
                <div key={k} className="border border-border rounded-2xl p-4 bg-card hover:border-coral transition">
                  <div className="text-2xl">{e}</div>
                  <div className="text-xs text-muted-foreground mt-2 font-mono uppercase tracking-wider">{k}</div>
                  <div className="font-semibold mt-1">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-6 relative overflow-hidden bg-[oklch(0.16_0.04_280)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,oklch(0.74_0.19_30_/_0.42),transparent_30%),radial-gradient(circle_at_80%_10%,oklch(0.7_0.15_230_/_0.34),transparent_28%),radial-gradient(circle_at_50%_100%,oklch(0.55_0.22_290_/_0.38),transparent_34%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-aurora" />
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-coral/30 blur-3xl" />
        <div className="max-w-5xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] mb-4 text-amber">— Get in touch</div>
            <h2 className="font-display font-black text-6xl md:text-9xl tracking-tight leading-[0.9] drop-shadow-[0_18px_55px_oklch(0_0_0_/_0.45)]">
              Let's make
              <br />
              <span className="italic font-light text-aurora gradient-shift">something cool</span>.
            </h2>
            <motion.a
              href="mailto:nguyenhaubatri2020@gmail.com"
              whileHover={{ scale: 1.04 }}
              className="inline-flex mt-12 max-w-full items-center justify-center rounded-full border border-white/25 bg-white px-6 py-4 text-lg font-bold text-[oklch(0.18_0.02_280)] shadow-[0_24px_80px_oklch(0.74_0.19_30_/_0.35)] transition hover:border-amber hover:bg-amber md:px-9 md:py-5 md:text-3xl"
            >
              <span className="break-all">nguyenhaubatri2020@gmail.com</span>
            </motion.a>
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-medium">
              <a href="tel:0886406126" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-white backdrop-blur-xl transition hover:scale-105 hover:border-coral hover:bg-white/18">
                ☎ 0886 406 126
              </a>
              <a href="https://github.com/hauvip123" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-white backdrop-blur-xl transition hover:scale-105 hover:border-azure hover:bg-white/18">
                ◐ github.com/hauvip123
              </a>
              <span className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-white backdrop-blur-xl">
                ⚲ Thu Duc, HCM City
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm text-background/70">
          <div>© 2026 Nguyen Van Hau · Designed & coded with care.</div>
          <div className="flex items-center gap-2">
            Made with <span className="text-coral">♥</span> + React + Framer Motion
          </div>
        </div>
      </footer>

      <motion.div style={{ width: progressX }} className="fixed bottom-0 left-0 h-1 bg-aurora z-[60] opacity-60" />
    </div>
  );
}
