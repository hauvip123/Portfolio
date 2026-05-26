import {
  BriefcaseBusiness,
  Code2,
  Database,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Server,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import portrait from "@/assets/hau.png"

const PAGES = ["Home", "Work", "Stack", "About", "Contact"] as const;
type Page = (typeof PAGES)[number];

const readSceneSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(1, Math.round(rect.width || element.clientWidth || window.innerWidth)),
    height: Math.max(1, Math.round(rect.height || element.clientHeight || window.innerHeight)),
  };
};

const BACKGROUND_THEMES = {
  Home: {
    core: "#ff775d", ring: "#66d9ff", particle: "#d8f6ff",
    haze: "rgba(255,119,93,0.2)", wash: "rgba(102,217,255,0.18)",
    rigX: 1.2, rigY: -0.15, cameraZ: 8.6, spin: 0.09, scale: 1,
  },
  Work: {
    core: "#ffd36e", ring: "#ff775d", particle: "#fff0bd",
    haze: "rgba(255,211,110,0.22)", wash: "rgba(255,119,93,0.2)",
    rigX: -1.25, rigY: 0.1, cameraZ: 7.7, spin: 0.14, scale: 1.08,
  },
  Stack: {
    core: "#66d9ff", ring: "#5de2a5", particle: "#c9fff0",
    haze: "rgba(102,217,255,0.24)", wash: "rgba(93,226,165,0.18)",
    rigX: 0.35, rigY: 0, cameraZ: 8.2, spin: 0.12, scale: 0.96,
  },
  About: {
    core: "#b989ff", ring: "#66d9ff", particle: "#ead9ff",
    haze: "rgba(185,137,255,0.22)", wash: "rgba(102,217,255,0.16)",
    rigX: 1.65, rigY: 0.2, cameraZ: 8.9, spin: 0.07, scale: 0.9,
  },
  Contact: {
    core: "#5de2a5", ring: "#ffd36e", particle: "#e8ffe9",
    haze: "rgba(93,226,165,0.2)", wash: "rgba(255,211,110,0.18)",
    rigX: -0.55, rigY: -0.08, cameraZ: 7.4, spin: 0.16, scale: 1.14,
  },
} satisfies Record<Page, { core: string; ring: string; particle: string; haze: string; wash: string; rigX: number; rigY: number; cameraZ: number; spin: number; scale: number }>;

const PROJECTS = [
  {
    name: "GreenCart",
    type: "Full-stack commerce",
    href: "https://github.com/hauvip123/GREENCART",
    period: "06/2025 – 12/2025",
    role: "Solo project",
    summary: "Built buyer and seller commerce flows with auth, product management, cloud image handling, charts, and dashboard screens.",
    proof: ["Role-based auth", "Seller dashboard", "Cloudinary uploads", "Order and catalog flows"],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Recharts"],
    color: "#ff775d",
    accent2: "#ffd36e",
    tag: "Full-Stack",
  },
  {
    name: "CityVoice",
    type: "Urban reporting SPA",
    href: "https://github.com/finnzxje/city-voice",
    period: "12/2025 – 04/2026",
    role: "Frontend developer",
    summary: "Created a map-heavy reporting interface with Leaflet markers, polygons, heatmaps, RBAC screens, and strict TypeScript.",
    proof: ["Interactive maps", "RBAC screens", "Typed API layer", "Animated UI states"],
    stack: ["React", "TypeScript", "Leaflet", "Tailwind", "Axios", "Motion"],
    color: "#66d9ff",
    accent2: "#5de2a5",
    tag: "Frontend",
  },
  {
    name: "E-Shop",
    type: "Frontend commerce app",
    href: "https://github.com/finnzxje/e-shop",
    period: "08/2025 – 12/2025",
    role: "Frontend developer",
    summary: "Delivered catalog, protected routes, wishlist, cart, checkout state, and responsive UI for a team commerce project.",
    proof: ["Protected routes", "Cart and wishlist", "Context state", "Responsive layout"],
    stack: ["React", "TypeScript", "Vite", "React Router", "Context API", "Tailwind"],
    color: "#ffd36e",
    accent2: "#ff775d",
    tag: "Commerce",
  },
];

const CAPABILITIES = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    text: "React, TypeScript, Vite, Tailwind, animation systems, responsive UI, and clean component structure.",
    chips: ["React", "TypeScript", "Tailwind", "Motion"],
    color: "#66d9ff",
    number: "01",
  },
  {
    icon: Server,
    title: "Backend Foundations",
    text: "Node.js, Express, JWT auth, REST API design, validation, and production-minded route organization.",
    chips: ["Node.js", "Express", "JWT", "REST"],
    color: "#ff775d",
    number: "02",
  },
  {
    icon: Database,
    title: "Data & Tooling",
    text: "MongoDB, MySQL, PostgreSQL basics, Git workflows, Linux, Docker, Postman, and debugging discipline.",
    chips: ["MongoDB", "PostgreSQL", "Docker", "Linux"],
    color: "#5de2a5",
    number: "03",
  },
];

const METRICS = [
  { value: "3.2", label: "Current GPA", color: "#ffd36e" },
  { value: "3", label: "Shipped projects", color: "#ff775d" },
  { value: "2027", label: "Graduating", color: "#66d9ff" },
  { value: "5+", label: "Core tech areas", color: "#5de2a5" },
];

// ── Magnetic cursor ──────────────────────────────────────────────────────────
function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 120, damping: 18 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 18 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsPointer(el.matches("a,button,[role='button']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[200] h-8 w-8 rounded-full border border-white/40 mix-blend-difference"
        style={{ x: springX, y: springY, scale: isPointer ? 1.7 : 1 }}
        transition={{ scale: { duration: 0.2 } }}
      />
      <motion.div
        className="pointer-events-none fixed z-[200] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      />
    </>
  );
}

// ── Noise grain overlay ───────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.032]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}

// ── Animated text reveal ──────────────────────────────────────────────────────
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.025, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: char === " " ? "inline" : "inline-block", transformOrigin: "bottom center" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ── Marquee ticker ────────────────────────────────────────────────────────────
function Marquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/8 py-3">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -33.33 + "%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.28em] text-white/30">
            <span className="h-1 w-1 rounded-full bg-[#ff775d]" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Number counter ────────────────────────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += to / 40;
      if (start < to) { setVal(Math.floor(start)); requestAnimationFrame(step); }
      else setVal(to);
    };
    const timeout = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(timeout);
  }, [to]);
  return <>{val}{suffix}</>;
}

// ── Hover 3D card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    rotX.set(-y * 14);
    rotY.set(x * 14);
  }, []);

  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── HoverScene (unchanged logic, same 3-D mini-scene) ────────────────────────
function HoverScene({ color = "#66d9ff", variant = "project" }: { color?: string; variant?: "project" | "stack" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const accent = new THREE.Color(color);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.25, 4.8);

    const rig = new THREE.Group();
    scene.add(rig);

    const geometry = variant === "project"
      ? new THREE.DodecahedronGeometry(0.86, 2)
      : new THREE.TorusKnotGeometry(0.65, 0.18, 130, 20, 2, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: accent, roughness: 0.24, metalness: 0.24, clearcoat: 0.8,
      iridescence: 0.8, emissive: accent, emissiveIntensity: 0.16,
    });
    const core = new THREE.Mesh(geometry, material);
    core.position.set(0.55, 0.08, 0);
    rig.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    const rings = [1.18, 1.62].map((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.01, 10, 140), ringMaterial.clone());
      ring.rotation.set(1.05 + index * 0.34, -0.3 + index * 0.38, 0.2);
      rig.add(ring);
      return ring;
    });

    const nodes = Array.from({ length: variant === "project" ? 5 : 7 }, (_, index) => {
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.055 + (index % 2) * 0.015, 1),
        new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? accent : 0xffffff }),
      );
      node.userData = { base: (index / (variant === "project" ? 5 : 7)) * Math.PI * 2, radius: 1.2 + index * 0.08, speed: 0.6 + index * 0.08 };
      rig.add(node);
      return node;
    });

    const particles = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.012, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false }),
      110,
    );
    const dummy = new THREE.Object3D();
    const particleData = Array.from({ length: 110 }, () => ({
      angle: Math.random() * Math.PI * 2, radius: 1.7 + Math.random() * 2.3,
      y: (Math.random() - 0.5) * 2.6, speed: 0.2 + Math.random() * 0.45, scale: 0.55 + Math.random(),
    }));
    scene.add(particles);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1236, 1.6));
    const key = new THREE.PointLight(accent, 28, 6);
    key.position.set(-1.5, 1.7, 2.5);
    scene.add(key);

    const resize = () => {
      const { width, height } = readSceneSize(wrap);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      rig.rotation.y = t * 0.22;
      rig.rotation.x = Math.sin(t * 0.7) * 0.09;
      core.rotation.x += 0.008; core.rotation.y += 0.011;
      rings.forEach((ring, index) => { ring.rotation.z += (index % 2 === 0 ? 1 : -1) * (0.007 + index * 0.002); });
      nodes.forEach((node, index) => {
        const { base, radius, speed } = node.userData;
        const angle = base + t * speed;
        node.position.set(Math.cos(angle) * radius + 0.55, Math.sin(angle * 1.5 + index) * 0.42, Math.sin(angle) * 0.7);
      });
      particleData.forEach((p, index) => {
        const angle = p.angle + t * p.speed * 0.3;
        dummy.position.set(Math.cos(angle) * p.radius, p.y, Math.sin(angle) * p.radius - 1.4);
        dummy.scale.setScalar(p.scale); dummy.updateMatrix();
        particles.setMatrixAt(index, dummy.matrix);
      });
      particles.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      geometry.dispose(); material.dispose();
      rings.forEach((r) => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
      nodes.forEach((n) => { n.geometry.dispose(); (n.material as THREE.Material).dispose(); });
      particles.geometry.dispose(); (particles.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [color, variant]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0 opacity-0 transition duration-500 group-hover:opacity-80">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,transparent_0%,rgba(13,16,26,0.08)_34%,rgba(13,16,26,0.56)_80%)]" />
    </div>
  );
}

// ── Warp transition ───────────────────────────────────────────────────────────
function WarpTransition({ token }: { token: number }) {
  if (token === 0) return null;
  return (
    <motion.div
      key={token}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden bg-[#07080f]"
    >
      <motion.div
        initial={{ scale: 0.15, opacity: 0.2, rotate: 0 }}
        animate={{ scale: [0.15, 1.2, 2.8], opacity: [0.25, 1, 0], rotate: 28 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#66d9ff]/35 shadow-[0_0_100px_rgba(102,217,255,0.4),inset_0_0_90px_rgba(255,119,93,0.22)]"
      />
      {Array.from({ length: 28 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ scaleX: 0.05, opacity: 0, x: 0 }}
          animate={{ scaleX: [0.05, 1, 2.1], opacity: [0, 0.85, 0], x: 760 }}
          transition={{ duration: 0.78, delay: index * 0.006, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-px w-72 origin-left bg-gradient-to-r from-white via-[#66d9ff] to-transparent"
          style={{ transform: `rotate(${(index / 28) * 360}deg)` }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1, 1.25] }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.9)_0%,rgba(102,217,255,0.34)_8%,rgba(255,119,93,0.18)_20%,transparent_48%)]"
      />
    </motion.div>
  );
}

// ── Background 3-D scene ──────────────────────────────────────────────────────
function DeckScene({ activePage }: { activePage: Page }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const initialThemeRef = useRef(BACKGROUND_THEMES[activePage]);
  const targetThemeRef = useRef(BACKGROUND_THEMES[activePage]);

  useEffect(() => { targetThemeRef.current = BACKGROUND_THEMES[activePage]; }, [activePage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07080f, 8, 22);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1, 8.6);

    const rig = new THREE.Group();
    rig.position.set(1.2, -0.15, 0);
    scene.add(rig);
    const initialTheme = initialThemeRef.current;

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: initialTheme.core, roughness: 0.24, metalness: 0.28, clearcoat: 0.85,
      iridescence: 0.8, emissive: initialTheme.core, emissiveIntensity: 0.2,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 5), coreMaterial);
    rig.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: initialTheme.ring, transparent: true, opacity: 0.44,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const rings = [2.05, 2.72, 3.35].map((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012 + index * 0.003, 12, 200), ringMaterial.clone());
      ring.rotation.set(1.05 + index * 0.2, -0.35 + index * 0.18, 0.42 - index * 0.12);
      rig.add(ring);
      return ring;
    });

    const nodes = [0xff775d, 0x66d9ff, 0xffd36e, 0x5de2a5, 0xffffff].map((color, index) => {
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12 + (index % 2) * 0.03, 2),
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, emissive: color, emissiveIntensity: 0.16 }),
      );
      node.userData = { base: (index / 5) * Math.PI * 2, radius: 2.35 + index * 0.18, speed: 0.45 + index * 0.07 };
      rig.add(node);
      return node;
    });

    const particles = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.016, 8, 8),
      new THREE.MeshBasicMaterial({ color: initialTheme.particle, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending, depthWrite: false }),
      540,
    );
    const particleMaterial = particles.material as THREE.MeshBasicMaterial;
    const dummy = new THREE.Object3D();
    const particleData = Array.from({ length: 540 }, () => ({
      radius: 4.5 + Math.random() * 8, angle: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 6, speed: 0.12 + Math.random() * 0.34, scale: 0.45 + Math.random(),
    }));
    scene.add(particles);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x21113c, 1.7));
    const key = new THREE.PointLight(0xff775d, 55, 10);
    key.position.set(-3.5, 2.8, 3.2);
    scene.add(key);
    const rim = new THREE.PointLight(0x66d9ff, 44, 10);
    rim.position.set(3.4, -1.3, 3.2);
    scene.add(rim);

    const coreTarget = new THREE.Color();
    const ringTarget = new THREE.Color();
    const particleTarget = new THREE.Color();
    const fogTarget = new THREE.Color();
    const currentRig = { x: initialTheme.rigX, y: initialTheme.rigY, z: initialTheme.cameraZ, spin: initialTheme.spin, scale: initialTheme.scale };

    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const { width, height } = readSceneSize(wrap);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    window.addEventListener("resize", resize);
    window.addEventListener("visibilitychange", resize);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      pointer.lerp(target, 0.055);
      const theme = targetThemeRef.current;
      const mobileOffset = wrap.clientWidth < 900 ? -0.65 : 0;
      const mobileScale = wrap.clientWidth < 640 ? 0.72 : 1;

      currentRig.x += (theme.rigX + mobileOffset - currentRig.x) * 0.035;
      currentRig.y += (theme.rigY - currentRig.y) * 0.035;
      currentRig.z += (theme.cameraZ - currentRig.z) * 0.035;
      currentRig.spin += (theme.spin - currentRig.spin) * 0.035;
      currentRig.scale += (theme.scale * mobileScale - currentRig.scale) * 0.035;

      coreMaterial.color.lerp(coreTarget.set(theme.core), 0.045);
      coreMaterial.emissive.lerp(coreTarget, 0.04);
      rings.forEach((ring) => { (ring.material as THREE.MeshBasicMaterial).color.lerp(ringTarget.set(theme.ring), 0.045); });
      particleMaterial.color.lerp(particleTarget.set(theme.particle), 0.04);
      key.color.lerp(coreTarget, 0.04);
      rim.color.lerp(ringTarget, 0.04);
      if (scene.fog) scene.fog.color.lerp(fogTarget.set(theme.core).multiplyScalar(0.12), 0.025);

      camera.position.z = currentRig.z;
      rig.position.set(currentRig.x, currentRig.y, 0);
      rig.scale.setScalar(currentRig.scale);
      rig.rotation.y = t * currentRig.spin + pointer.x * 0.22;
      rig.rotation.x = Math.sin(t * 0.5) * 0.06 - pointer.y * 0.14;
      core.rotation.x += 0.003 + currentRig.spin * 0.014;
      core.rotation.y += 0.004 + currentRig.spin * 0.018;
      rings.forEach((ring, index) => { ring.rotation.z += (index % 2 === 0 ? 1 : -1) * (0.003 + index * 0.0007); });
      nodes.forEach((node, index) => {
        const { base, radius, speed } = node.userData;
        const angle = base + t * speed;
        node.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.6 + index) * 0.8, Math.sin(angle) * 1.35);
        node.rotation.x += 0.012; node.rotation.y += 0.014;
      });
      particleData.forEach((p, index) => {
        const angle = p.angle + t * p.speed * 0.08;
        dummy.position.set(Math.cos(angle) * p.radius + pointer.x * 0.35, p.y + Math.sin(t * p.speed + index) * 0.07, Math.sin(angle) * p.radius - 3.8);
        dummy.scale.setScalar(p.scale); dummy.updateMatrix();
        particles.setMatrixAt(index, dummy.matrix);
      });
      particles.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("visibilitychange", resize);
      core.geometry.dispose(); (core.material as THREE.Material).dispose();
      rings.forEach((ring) => { ring.geometry.dispose(); (ring.material as THREE.Material).dispose(); });
      nodes.forEach((node) => { node.geometry.dispose(); (node.material as THREE.Material).dispose(); });
      particles.geometry.dispose(); (particles.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 70% 35%, ${BACKGROUND_THEMES[activePage].haze} 0%, transparent 38%), radial-gradient(circle at 25% 68%, ${BACKGROUND_THEMES[activePage].wash} 0%, transparent 34%), #07080f` }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full transition-opacity duration-300" />
      <motion.div
        key={`${activePage}-haze`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(circle at 72% 38%, ${BACKGROUND_THEMES[activePage].haze} 0%, transparent 34%), radial-gradient(circle at 24% 68%, ${BACKGROUND_THEMES[activePage].wash} 0%, transparent 30%)` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#07080f_0%,rgba(7,8,15,0.92)_32%,rgba(7,8,15,0.34)_68%,#07080f_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,15,0.08)_0%,rgba(7,8,15,0.2)_70%,#07080f_100%)]" />
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────
function PageShell({ children, pageKey }: { children: React.ReactNode; pageKey: Page }) {
  return (
    <motion.section
      key={pageKey}
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.88, rotateX: -10, filter: "blur(16px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex h-full min-h-0 items-center px-5 pb-6 pt-28"
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </motion.section>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -20, scale: 1.02 }}
      className="group relative isolate flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d101a]/90 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-white/24 hover:bg-[#121727]/95"
      style={{ transformStyle: "preserve-3d", perspective: "1200px", boxShadow: hovered ? `0 40px 100px ${project.color}22, 0 0 0 1px ${project.color}18` : "none" }}
    >
      {/* 3-D hover scene */}
      <HoverScene color={project.color} variant="project" />

      {/* Top gradient fog */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(13,16,26,0.88)_0%,rgba(13,16,26,0.44)_44%,rgba(13,16,26,0.92)_100%)] opacity-70 transition duration-300 group-hover:opacity-[0.85]" />

      {/* Colored glow blob */}
      <motion.div
        className="pointer-events-none absolute -right-20 -top-20 z-0 h-56 w-56 rounded-full blur-3xl"
        animate={{ opacity: hovered ? 0.5 : 0, scale: hovered ? 1.1 : 0.8 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: project.color }}
      />

      {/* Top indicator bar */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20 h-[2px] origin-left rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accent2})` }}
      />

      {/* Header row */}
      <div className="relative z-20 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{ borderColor: project.color + "60", color: project.color, background: project.color + "12" }}
          >
            {project.tag}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">0{index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/10 bg-[#07080f]/50 px-2.5 py-1 text-[11px] font-semibold text-white/50">
            {project.period}
          </span>
          <motion.a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.15, rotate: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/[0.06] text-white/50 transition hover:border-white/28 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </motion.a>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-20 mt-8"
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3
          className="font-display text-[3.2rem] font-black leading-none tracking-tight text-white"
          style={{ textShadow: hovered ? `0 0 60px ${project.color}44` : "none" }}
        >
          {project.name}
        </h3>
        <p className="mt-2.5 text-sm font-semibold" style={{ color: project.color + "cc" }}>
          {project.type} · {project.role}
        </p>
        <p className="mt-5 text-[15px] leading-[1.7] text-white/75">{project.summary}</p>
      </motion.div>

      {/* Proof bullets */}
      <div className="relative z-20 mt-6 grid gap-1.5">
        {project.proof.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.09 + i * 0.04 + 0.3 }}
            whileHover={{ x: 10 }}
            className="flex items-center gap-2.5 text-[13px] font-semibold text-white/70"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              animate={{ scale: hovered ? [1, 1.4, 1] : 1 }}
              transition={{ delay: i * 0.08, repeat: hovered ? Infinity : 0, repeatDelay: 1 }}
              style={{ backgroundColor: project.color }}
            />
            {item}
          </motion.div>
        ))}
      </div>

      {/* Stack chips */}
      <div className="relative z-20 mt-auto flex flex-wrap gap-1.5 pt-5 border-t border-white/[0.07] mt-6">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-md border border-white/10 bg-[#07080f]/70 px-2.5 py-1 text-[11px] font-bold text-white/60 backdrop-blur-sm"
          >
            {item}
          </span>
        ))}
      </div>

      {/* CTA hover overlay */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-6"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
          style={{ background: project.color, color: "#07080f" }}
        >
          View on GitHub <ArrowUpRight className="h-4 w-4" />
        </span>
      </motion.div>
    </motion.article>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Tailwind", "Motion", "Docker", "PostgreSQL", "Leaflet", "JWT", "Vite"];

function HomePage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <PageShell pageKey="Home">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 text-sm text-white/68 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5de2a5] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5de2a5]" />
            </span>
            Open to Internship · Thu Duc, HCM City
          </motion.div>

          {/* Name */}
          <h1 className="font-display text-6xl font-black leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
            <SplitText text="Nguyen" delay={0.15} />
            <br />
            <SplitText text="Van Hau" delay={0.35} />
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
              className="ml-2 text-[#ff775d]"
            >.</motion.span>
          </h1>

          {/* Descriptor line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-2 font-mono text-xs uppercase tracking-[0.32em] text-[#66d9ff]/70"
          >
            Full-Stack Developer · React · Node.js
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-7 max-w-2xl text-lg leading-[1.75] text-white/62 md:text-xl"
          >
            I build React and Node.js products with clear user flows, typed frontends, reliable APIs, and visual craft that makes the portfolio feel alive.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <motion.button
              type="button"
              onClick={() => setPage("Work")}
              whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(255,119,93,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-[#ff775d] px-6 text-base font-bold text-[#170d0b] shadow-[0_14px_40px_rgba(255,119,93,0.25)] transition-colors hover:bg-[#ffd36e]"
            >
              View selected work
              <ChevronRight className="h-4.5 w-4.5" />
            </motion.button>
            <motion.a
              href="https://github.com/hauvip123"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04, borderColor: "#66d9ff" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center gap-2.5 rounded-xl border border-white/16 bg-white/[0.05] px-6 text-base font-bold text-white backdrop-blur-xl transition"
            >
              <Github className="h-4.5 w-4.5" />
              GitHub
            </motion.a>
          </motion.div>
        </div>

        {/* Portrait side */}
        <div className="relative ml-auto hidden w-full max-w-[420px] lg:block">
          <TiltCard className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow behind portrait */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30 scale-90" style={{ background: "radial-gradient(circle, #ff775d 0%, #66d9ff 60%, transparent 80%)" }} />
              <img
                src={portrait}
                alt="Nguyen Van Hau"
                width={1024} height={1024}
                className="relative z-10 w-full drop-shadow-[0_40px_90px_rgba(0,0,0,0.5)] rounded-2xl"
              />
            </motion.div>
          </TiltCard>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-10 -left-8 z-20 rounded-2xl border border-white/12 bg-[#07080f]/80 p-4 backdrop-blur-xl shadow-xl"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffd36e]">Recruiter snapshot</div>
            <div className="mt-1.5 text-sm font-semibold text-white/80">React · TypeScript · Node.js</div>
            <div className="mt-1 text-xs text-white/45">3.2 GPA · 2027 graduate</div>
          </motion.div>

          {/* Second floating badge */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-12 -right-6 z-20 rounded-2xl border border-white/10 bg-[#07080f]/70 p-3.5 backdrop-blur-xl"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5de2a5]">Available</div>
            <div className="mt-1 text-sm font-bold text-white">Internship 2026</div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-12"
      >
        <Marquee items={TICKER_ITEMS} />
      </motion.div>
    </PageShell>
  );
}

function WorkPage() {
  return (
    <PageShell pageKey="Work">
      <div className="grid gap-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#66d9ff]"
            >
              <span className="h-px w-8 bg-[#66d9ff]" />
              Selected work
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl font-display text-4xl font-black leading-none tracking-tight text-white md:text-6xl"
            >
              Hover cards.
              <br />
              <span className="text-white/45">The content stands up.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-white/35"
          >
            3 projects · Solo + team
          </motion.div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function StackPage() {
  return (
    <PageShell pageKey="Stack">
      <div className="grid gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#66d9ff]"
          >
            <span className="h-px w-8 bg-[#66d9ff]" />
            Stack
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl font-display text-4xl font-black leading-none tracking-tight text-white md:text-6xl"
          >
            Practical tools,
            <br />
            <span className="text-white/45">presented like a product surface.</span>
          </motion.h2>
        </div>

        {/* Capability cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {CAPABILITIES.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <TiltCard key={capability.title}>
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative isolate h-full overflow-hidden rounded-2xl border border-white/10 bg-[#111522]/90 p-7 transition hover:border-[#66d9ff]/40 hover:bg-[#151a2a]/95"
                >
                  <HoverScene color={capability.color} variant="stack" />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(17,21,34,0.85)_0%,rgba(17,21,34,0.44)_52%,rgba(17,21,34,0.92)_100%)] opacity-[0.65] transition duration-300 group-hover:opacity-[0.85]" />
                  <motion.div
                    className="pointer-events-none absolute -right-14 -top-14 z-0 h-44 w-44 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-40"
                    style={{ backgroundColor: capability.color }}
                  />

                  {/* Number badge */}
                  <div className="relative z-20 mb-7 flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:-translate-y-1"
                      style={{ background: capability.color + "18", border: `1px solid ${capability.color}35` }}
                    >
                      <Icon className="h-5.5 w-5.5" style={{ color: capability.color }} />
                    </div>
                    <span className="font-mono text-4xl font-black text-white/8">{capability.number}</span>
                  </div>

                  <h3 className="relative z-20 text-xl font-black text-white">{capability.title}</h3>
                  <p className="relative z-20 mt-3.5 text-[15px] leading-[1.7] text-white/70">{capability.text}</p>

                  <div className="relative z-20 mt-6 flex flex-wrap gap-1.5">
                    {capability.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-md border border-white/10 bg-[#07080f]/80 px-2.5 py-1 text-[11px] font-bold text-white/65"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICS.map(({ value, label, color }, i) => {
            const numericVal = parseFloat(value.replace("+", ""));
            const hasPlus = value.includes("+");
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.4 }}
                whileHover={{ scale: 1.04, borderColor: color + "60" }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <div className="font-display text-4xl font-black" style={{ color }}>
                  {Number.isInteger(numericVal) ? <CountUp to={numericVal} suffix={hasPlus ? "+" : ""} /> : value}
                </div>
                <div className="mt-1.5 text-sm font-medium text-white/45">{label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell pageKey="About">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#66d9ff]"
          >
            <span className="h-px w-8 bg-[#66d9ff]" />
            About
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black leading-none tracking-tight text-white md:text-6xl"
          >
            Student engineer
            <br />
            <span className="text-white/45">with a shipping mindset.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-[1.75] text-white/58"
          >
            I like interfaces that feel alive, APIs that are easy to reason about, and teams that care about turning ambiguity into something usable.
          </motion.p>

          {/* Tech constellation dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {["React", "TypeScript", "Node.js", "Go (learning)", "MongoDB"].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-white/65 backdrop-blur-sm"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="space-y-3.5">
          {[
            [GraduationCap, "Education", "Software Engineering, Posts and Telecommunications Institute of Technology, 2022 – 2027.", "#b989ff"],
            [BriefcaseBusiness, "Target role", "Full-stack Developer Intern, strongest contribution on React, TypeScript, and Node.js features.", "#ffd36e"],
            [MapPin, "Location", "Thu Duc, Ho Chi Minh City. Ready for internship interviews and collaborative product teams.", "#5de2a5"],
          ].map(([Icon, label, value, color], i) => {
            const ItemIcon = Icon as typeof GraduationCap;
            return (
              <motion.div
                key={label as string}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 8, borderColor: (color as string) + "44" }}
                className="rounded-2xl border border-white/10 bg-[#0d101a]/80 p-6 backdrop-blur-sm"
              >
                <div className="flex gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: (color as string) + "14", border: `1px solid ${color as string}30`, color: color as string }}
                  >
                    <ItemIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/36">{label}</div>
                    <p className="mt-2 text-[15px] leading-[1.7] text-white/65">{value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function ContactPage() {
  return (
    <PageShell pageKey="Contact">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#ff775d]"
        >
          <span className="h-px w-8 bg-[#ff775d]" />
          Contact
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-3 font-display text-5xl font-black leading-none tracking-tight text-white md:text-7xl"
        >
          Let's talk internship.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 max-w-lg text-base leading-[1.75] text-white/50"
        >
          Ready to join a team, build product features, and learn from senior engineers from day one.
        </motion.p>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.97] shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
        >
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ff775d, #ffd36e, #5de2a5, #66d9ff)" }} />
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff775d]">Nguyen Van Hau</div>
              <p className="mt-3 max-w-sm text-[15px] leading-[1.75] text-[#334155]">
                Looking to contribute from day one — building features, growing fast, and shipping products that matter.
              </p>
              {/* Availability indicator */}
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#5de2a5]/30 bg-[#5de2a5]/10 px-4 py-2 text-sm font-semibold text-[#1a6647]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5de2a5] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5de2a5]" />
                </span>
                Available from June 2026
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Mail, label: "nguyenhaubatri2020@gmail.com", href: "mailto:nguyenhaubatri2020@gmail.com", primary: true },
                { icon: Phone, label: "0886 406 126", href: "tel:0886406126", primary: false },
                { icon: Github, label: "github.com/hauvip123", href: "https://github.com/hauvip123", primary: false },
              ].map(({ icon: Icon, label, href, primary }) => (
                <motion.a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-3.5 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${primary
                    ? "bg-[#07080f] text-white hover:bg-[#ff775d]"
                    : "border border-[#d9dee8] text-[#07080f] hover:border-[#07080f] hover:bg-[#f8fafc]"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span className="break-all">{label}</span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function PortfolioDeck() {
  const [page, setPage] = useState<Page>("Home");
  const [warpToken, setWarpToken] = useState(0);

  useEffect(() => {
    const readHash = () => {
      const next = PAGES.find((item) => item.toLowerCase() === window.location.hash.replace("#", "").toLowerCase());
      if (next) setPage(next);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const goTo = (next: Page) => {
    if (next === page) return;
    setWarpToken((t) => t + 1);
    setPage(next);
    window.history.replaceState(null, "", `#${next.toLowerCase()}`);
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[#07080f] text-white" style={{ cursor: "none" }}>
      <MagneticCursor />
      <GrainOverlay />
      <DeckScene activePage={page} />

      <AnimatePresence>
        <WarpTransition token={warpToken} />
      </AnimatePresence>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#07080f]/70 px-5 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo("Home")}
            className="font-display text-lg font-black tracking-tight text-white transition hover:text-[#ff775d]"
          >
            Hau<span className="text-[#ff775d]">.</span>dev
          </button>

          {/* Nav */}
          <nav className="hidden items-center gap-1 text-sm font-medium text-white/55 md:flex">
            {PAGES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                className={`relative rounded-xl px-4 py-2 transition-all ${page === item ? "bg-white text-[#07080f] font-bold" : "hover:bg-white/[0.08] hover:text-white"}`}
              >
                {item}
                {page === item && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-white"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Hire me */}
          <motion.button
            type="button"
            onClick={() => goTo("Contact")}
            whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(255,211,110,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#07080f] transition hover:bg-[#ffd36e]"
          >
            <Mail className="h-4 w-4" />
            Hire me
          </motion.button>
        </motion.div>
      </header>

      {/* Page content */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {page === "Home" && <HomePage key="Home" setPage={goTo} />}
          {page === "Work" && <WorkPage key="Work" />}
          {page === "Stack" && <StackPage key="Stack" />}
          {page === "About" && <AboutPage key="About" />}
          {page === "Contact" && <ContactPage key="Contact" />}
        </AnimatePresence>
      </div>

      {/* Mobile dots nav */}
      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2.5 rounded-2xl border border-white/10 bg-[#07080f]/75 px-4 py-2.5 backdrop-blur-xl md:hidden">
        {PAGES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            aria-label={item}
            className="transition-all duration-300"
          >
            <motion.span
              className="block rounded-full bg-white/35"
              animate={{ width: page === item ? 28 : 10, height: 10, backgroundColor: page === item ? "#ff775d" : "rgba(255,255,255,0.35)" }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </main>
  );
}