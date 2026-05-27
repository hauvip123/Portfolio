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
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const PAGES = ["Home", "Work", "Stack", "About", "Contact"] as const;
type Page = (typeof PAGES)[number];

const readSceneSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(1, Math.round(rect.width || element.clientWidth || window.innerWidth)),
    height: Math.max(1, Math.round(rect.height || element.clientHeight || window.innerHeight)),
  };
};

// Cosmic theme per page
const COSMIC_THEMES = {
  Home: {
    nebula1: "#ff3cac", nebula2: "#784ba0", nebula3: "#2b86c5",
    blackHole: "#ff3cac", starfield: "#ffe0f7",
    haze: "rgba(255,60,172,0.22)", wash: "rgba(43,134,197,0.18)",
    name: "Andromeda Rift",
    rigX: 1.1, rigY: -0.1, cameraZ: 8.5, spin: 0.08, scale: 1,
  },
  Work: {
    nebula1: "#f9d423", nebula2: "#ff4e50", nebula3: "#fc913a",
    blackHole: "#f9d423", starfield: "#fff8e0",
    haze: "rgba(249,212,35,0.2)", wash: "rgba(255,78,80,0.2)",
    name: "Orion Nebula",
    rigX: -1.2, rigY: 0.1, cameraZ: 7.8, spin: 0.12, scale: 1.06,
  },
  Stack: {
    nebula1: "#43e97b", nebula2: "#38f9d7", nebula3: "#00b4d8",
    blackHole: "#43e97b", starfield: "#e0fff5",
    haze: "rgba(67,233,123,0.2)", wash: "rgba(56,249,215,0.18)",
    name: "Crab Nebula",
    rigX: 0.3, rigY: 0, cameraZ: 8.1, spin: 0.11, scale: 0.97,
  },
  About: {
    nebula1: "#a18cd1", nebula2: "#fbc2eb", nebula3: "#8fd3f4",
    blackHole: "#a18cd1", starfield: "#f0e8ff",
    haze: "rgba(161,140,209,0.22)", wash: "rgba(143,211,244,0.18)",
    name: "Eagle Nebula",
    rigX: 1.6, rigY: 0.2, cameraZ: 8.8, spin: 0.07, scale: 0.92,
  },
  Contact: {
    nebula1: "#00f2fe", nebula2: "#4facfe", nebula3: "#0052d4",
    blackHole: "#00f2fe", starfield: "#e0f8ff",
    haze: "rgba(0,242,254,0.2)", wash: "rgba(79,172,254,0.18)",
    name: "Helix Nebula",
    rigX: -0.5, rigY: -0.08, cameraZ: 7.5, spin: 0.15, scale: 1.12,
  },
} satisfies Record<Page, { nebula1: string; nebula2: string; nebula3: string; blackHole: string; starfield: string; haze: string; wash: string; name: string; rigX: number; rigY: number; cameraZ: number; spin: number; scale: number }>;

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
    color: "#ff3cac",
    accent2: "#f9d423",
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
    color: "#43e97b",
    accent2: "#38f9d7",
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
    color: "#4facfe",
    accent2: "#00f2fe",
    tag: "Commerce",
  },
];

const CAPABILITIES = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    text: "React, TypeScript, Vite, Tailwind, animation systems, responsive UI, and clean component structure.",
    chips: ["React", "TypeScript", "Tailwind", "Motion"],
    color: "#ff3cac",
    number: "01",
  },
  {
    icon: Server,
    title: "Backend Foundations",
    text: "Node.js, Express, JWT auth, REST API design, validation, and production-minded route organization.",
    chips: ["Node.js", "Express", "JWT", "REST"],
    color: "#43e97b",
    number: "02",
  },
  {
    icon: Database,
    title: "Data & Tooling",
    text: "MongoDB, MySQL, PostgreSQL basics, Git workflows, Linux, Docker, Postman, and debugging discipline.",
    chips: ["MongoDB", "PostgreSQL", "Docker", "Linux"],
    color: "#4facfe",
    number: "03",
  },
];

const METRICS = [
  { value: "3.2", label: "Current GPA", color: "#f9d423" },
  { value: "3", label: "Shipped projects", color: "#ff3cac" },
  { value: "2027", label: "Graduating", color: "#4facfe" },
  { value: "5+", label: "Core tech areas", color: "#43e97b" },
];

// ── Spaceship cursor ──────────────────────────────────────────────────────────
function SpaceshipCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const [angle, setAngle] = useState(0);
  const [isPointer, setIsPointer] = useState(false);
  const [isThrusting, setIsThrusting] = useState(false);
  const prevPos = useRef({ x: -200, y: -200 });
  const thrustTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 2) {
        const newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setAngle(newAngle);
        setIsThrusting(true);
        if (thrustTimeout.current) clearTimeout(thrustTimeout.current);
        thrustTimeout.current = setTimeout(() => setIsThrusting(false), 120);
      }
      prevPos.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 20);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsPointer(el.matches("a,button,[role='button']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      if (thrustTimeout.current) clearTimeout(thrustTimeout.current);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[200]"
      style={{ x: springX, y: springY, rotate: angle }}
    >
      {/* Spaceship SVG */}
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Thruster flame */}
        <AnimatePresence>
          {isThrusting && (
            <motion.ellipse
              cx="16" cy="36"
              initial={{ ry: 0, opacity: 0 }}
              animate={{ ry: 7 + Math.random() * 4, opacity: 0.9 }}
              exit={{ ry: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
              rx={isPointer ? 5 : 3.5}
              fill="url(#thrustGrad)"
              filter="url(#thrustBlur)"
            />
          )}
        </AnimatePresence>
        <defs>
          <radialGradient id="thrustGrad" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="35%" stopColor="#f9d423" />
            <stop offset="70%" stopColor="#ff3cac" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="thrustBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="glowShip">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="shipBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e8ff" />
            <stop offset="100%" stopColor="#a0b4ff" />
          </linearGradient>
          <linearGradient id="shipWingL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
          <linearGradient id="shipWingR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3cac" />
            <stop offset="100%" stopColor="#784ba0" />
          </linearGradient>
        </defs>
        {/* Wings */}
        <path d="M16 28 L4 38 L10 28 Z" fill="url(#shipWingL)" opacity="0.9" filter="url(#glowShip)" />
        <path d="M16 28 L28 38 L22 28 Z" fill="url(#shipWingR)" opacity="0.9" filter="url(#glowShip)" />
        {/* Body */}
        <path d="M16 2 C10 8 8 20 10 28 L16 30 L22 28 C24 20 22 8 16 2Z" fill="url(#shipBody)" filter="url(#glowShip)" />
        {/* Cockpit */}
        <ellipse cx="16" cy="12" rx="4" ry="6" fill="#00f2fe" opacity="0.85" />
        <ellipse cx="16" cy="12" rx="2.5" ry="4" fill="white" opacity="0.5" />
        {/* Engine pods */}
        <rect x="9" y="24" width="4" height="6" rx="2" fill="#a0b4ff" />
        <rect x="19" y="24" width="4" height="6" rx="2" fill="#a0b4ff" />
        {/* Hover ring */}
        {isPointer && (
          <motion.circle
            cx="16" cy="16" r="18"
            stroke="#f9d423"
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0, r: 14 }}
            animate={{ opacity: [0.4, 0.8, 0.4], r: [14, 18, 14] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </svg>
    </motion.div>
  );
}

// ── Star field canvas (deep background) ──────────────────────────────────────
function StarField({ page }: { page: Page }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = COSMIC_THEMES[page];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Stars
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.12 + 0.02,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      color: Math.random() > 0.85 ? theme.starfield : "white",
    }));

    let animFrame = 0;
    const draw = () => {
      animFrame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.twinkle += star.twinkleSpeed;
        const alpha = 0.3 + Math.sin(star.twinkle) * 0.45;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color === "white"
          ? `rgba(255,255,255,${alpha})`
          : `rgba(255,230,250,${alpha * 0.8})`;
        ctx.fill();
        star.x -= star.speed * 0.2;
        if (star.x < 0) { star.x = canvas.width; star.y = Math.random() * canvas.height; }
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1]" />;
}

// ── Black hole THREE.js scene ──────────────────────────────────────────────────
function BlackHoleScene({ activePage }: { activePage: Page }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetPageRef = useRef(activePage);

  useEffect(() => { targetPageRef.current = activePage; }, [activePage]);

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
    scene.fog = new THREE.Fog(0x020408, 12, 28);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1, 8.5);

    const rig = new THREE.Group();
    rig.position.set(1.1, -0.1, 0);
    scene.add(rig);

    const initTheme = COSMIC_THEMES[activePage];

    // BLACK HOLE – dark sphere
    const bhGeo = new THREE.SphereGeometry(0.9, 48, 48);
    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(bhGeo, bhMat);
    rig.add(blackHole);

    // Accretion disk rings (gravitational lensing effect)
    const diskMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(initTheme.blackHole),
      transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const disks = [1.15, 1.55, 2.0, 2.6, 3.3].map((radius, i) => {
      const mat = diskMat.clone();
      mat.opacity = 0.72 - i * 0.11;
      const disk = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025 + i * 0.012, 14, 220), mat);
      disk.rotation.set(1.35 + i * 0.08, i * 0.22, 0.18 + i * 0.05);
      rig.add(disk);
      return disk;
    });

    // Photon ring (bright ring closest to BH)
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const photonRing = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.008, 12, 240), photonMat);
    photonRing.rotation.set(1.35, 0, 0.18);
    rig.add(photonRing);

    // Nebula particles (colored gas clouds)
    const nebulaParticles = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.022, 6, 6),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(initTheme.nebula1),
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
      800,
    );
    const nebulaParticles2 = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.016, 6, 6),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(initTheme.nebula2),
        transparent: true, opacity: 0.45,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
      600,
    );
    const dummy = new THREE.Object3D();
    const pData1 = Array.from({ length: 800 }, () => ({
      radius: 3.5 + Math.random() * 7,
      angle: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 5.5,
      speed: 0.06 + Math.random() * 0.2,
      scale: 0.5 + Math.random() * 1.2,
    }));
    const pData2 = Array.from({ length: 600 }, () => ({
      radius: 2.8 + Math.random() * 9,
      angle: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 6.5,
      speed: 0.04 + Math.random() * 0.15,
      scale: 0.4 + Math.random() * 1.1,
    }));
    scene.add(nebulaParticles);
    scene.add(nebulaParticles2);

    // Cosmic debris (white sparkles)
    const sparkleGeo = new THREE.SphereGeometry(0.01, 4, 4);
    const sparkles = new THREE.InstancedMesh(sparkleGeo,
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }),
      340,
    );
    const sData = Array.from({ length: 340 }, () => ({
      radius: 1.5 + Math.random() * 11,
      angle: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 8,
      speed: 0.08 + Math.random() * 0.28,
      scale: 0.5 + Math.random(),
    }));
    scene.add(sparkles);

    // Lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x050014, 1.4));
    const key = new THREE.PointLight(new THREE.Color(initTheme.nebula1), 48, 12);
    key.position.set(-3, 2.5, 3);
    scene.add(key);
    const rim = new THREE.PointLight(new THREE.Color(initTheme.nebula3), 36, 12);
    rim.position.set(3.5, -1.5, 3);
    scene.add(rim);

    // Color interpolation targets
    const c1 = new THREE.Color();
    const c2 = new THREE.Color();
    const c3 = new THREE.Color();
    const currentRig = { x: initTheme.rigX, y: initTheme.rigY, z: initTheme.cameraZ, spin: initTheme.spin, scale: initTheme.scale };

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerTarget.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
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
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.05);
      const theme = COSMIC_THEMES[targetPageRef.current];
      const mobile = wrap.clientWidth < 900;
      const mobileOffset = mobile ? -0.55 : 0;
      const mobileScale = wrap.clientWidth < 640 ? 0.7 : 1;

      // Smooth transitions
      currentRig.x += (theme.rigX + mobileOffset - currentRig.x) * 0.032;
      currentRig.y += (theme.rigY - currentRig.y) * 0.032;
      currentRig.z += (theme.cameraZ - currentRig.z) * 0.032;
      currentRig.spin += (theme.spin - currentRig.spin) * 0.032;
      currentRig.scale += (theme.scale * mobileScale - currentRig.scale) * 0.032;

      // Color lerp
      (diskMat as THREE.MeshBasicMaterial).color.lerp(c1.set(theme.blackHole), 0.04);
      disks.forEach((d) => { (d.material as THREE.MeshBasicMaterial).color.lerp(c1.set(theme.blackHole), 0.04); });
      (nebulaParticles.material as THREE.MeshBasicMaterial).color.lerp(c2.set(theme.nebula1), 0.04);
      (nebulaParticles2.material as THREE.MeshBasicMaterial).color.lerp(c3.set(theme.nebula2), 0.04);
      key.color.lerp(c2.set(theme.nebula1), 0.04);
      rim.color.lerp(c3.set(theme.nebula3), 0.04);

      camera.position.z = currentRig.z;
      rig.position.set(currentRig.x, currentRig.y, 0);
      rig.scale.setScalar(currentRig.scale);
      rig.rotation.y = t * currentRig.spin + pointer.x * 0.25;
      rig.rotation.x = Math.sin(t * 0.4) * 0.05 - pointer.y * 0.12;

      // Accretion disk spin (differential rotation like real BH)
      disks.forEach((d, i) => {
        d.rotation.z += (i % 2 === 0 ? 1 : -1) * (0.004 + i * 0.001);
      });
      photonRing.rotation.z += 0.018;

      // BH pulsation (event horizon shimmer)
      const pulse = 1 + Math.sin(t * 2.8) * 0.012;
      blackHole.scale.setScalar(pulse);

      // Nebula particles orbit
      pData1.forEach((p, i) => {
        const a = p.angle + t * p.speed * 0.15;
        dummy.position.set(Math.cos(a) * p.radius, p.y + Math.sin(t * p.speed + i) * 0.1, Math.sin(a) * p.radius - 2.5);
        dummy.scale.setScalar(p.scale); dummy.updateMatrix();
        nebulaParticles.setMatrixAt(i, dummy.matrix);
      });
      nebulaParticles.instanceMatrix.needsUpdate = true;
      pData2.forEach((p, i) => {
        const a = p.angle + t * p.speed * 0.1;
        dummy.position.set(Math.cos(a) * p.radius + pointer.x * 0.4, p.y + Math.sin(t * p.speed * 0.7 + i) * 0.14, Math.sin(a) * p.radius - 3);
        dummy.scale.setScalar(p.scale); dummy.updateMatrix();
        nebulaParticles2.setMatrixAt(i, dummy.matrix);
      });
      nebulaParticles2.instanceMatrix.needsUpdate = true;
      sData.forEach((p, i) => {
        const a = p.angle + t * p.speed * 0.07;
        dummy.position.set(Math.cos(a) * p.radius, p.y, Math.sin(a) * p.radius - 4);
        dummy.scale.setScalar(p.scale); dummy.updateMatrix();
        sparkles.setMatrixAt(i, dummy.matrix);
      });
      sparkles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  const theme = COSMIC_THEMES[activePage];
  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Deep space base */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, #0a0618 0%, #020408 60%, #000 100%)" }} />
      {/* Nebula color wash */}
      <motion.div
        key={activePage + "-nebula"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 72% 38%, ${theme.haze} 0%, transparent 40%), radial-gradient(ellipse at 22% 72%, ${theme.wash} 0%, transparent 36%), radial-gradient(ellipse at 50% 10%, ${theme.nebula2}18 0%, transparent 55%)`
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.15)_72%,rgba(0,0,0,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.28)_36%,transparent_65%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}

// ── Grain overlay ─────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.028]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}

// ── Warp jump transition ──────────────────────────────────────────────────────
function WarpTransition({ token }: { token: number }) {
  if (token === 0) return null;
  return (
    <motion.div
      key={token}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #020408 0%, #000 100%)" }}
    >
      {/* Warp streaks */}
      {Array.from({ length: 42 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scaleX: 0.02, opacity: 0, x: 0 }}
          animate={{ scaleX: [0.02, 1, 2.4], opacity: [0, 0.95, 0], x: 900 }}
          transition={{ duration: 0.72, delay: i * 0.004, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-px w-80 origin-left"
          style={{
            transform: `rotate(${(i / 42) * 360}deg)`,
            background: i % 3 === 0
              ? "linear-gradient(90deg, #fff, #ff3cac, transparent)"
              : i % 3 === 1
                ? "linear-gradient(90deg, #fff, #4facfe, transparent)"
                : "linear-gradient(90deg, #fff, #f9d423, transparent)",
          }}
        />
      ))}
      {/* Central flash */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 1, 0], scale: [0.3, 1.2, 3] }}
        transition={{ duration: 0.85 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(79,172,254,0.4)_6%,rgba(255,60,172,0.2)_14%,transparent_40%)]"
      />
    </motion.div>
  );
}

// ── Split text animate ────────────────────────────────────────────────────────
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 44, rotateX: -95 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.028, duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: char === " " ? "inline" : "inline-block", transformOrigin: "bottom center" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ── Nebula ticker ─────────────────────────────────────────────────────────────
function Marquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y py-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, "-33.33%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.28)" }}>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "#ff3cac" }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Count up ──────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = () => { v += to / 44; if (v < to) { setVal(Math.floor(v)); requestAnimationFrame(step); } else setVal(to); };
    const t = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

// ── 3D tilt card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0); const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 200, damping: 22 });
  const sY = useSpring(rotY, { stiffness: 200, damping: 22 });
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    rotX.set(-((e.clientY - top) / height - 0.5) * 14);
    rotY.set(((e.clientX - left) / width - 0.5) * 14);
  }, []);
  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: sX, rotateY: sY, transformStyle: "preserve-3d", ...style }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Nebula mini scene for cards ───────────────────────────────────────────────
function NebulaScene({ color, color2 }: { color: string; color2: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 50);
    camera.position.set(0, 0.2, 5.2);
    const rig = new THREE.Group();
    scene.add(rig);

    const accent = new THREE.Color(color);
    const accent2 = new THREE.Color(color2);

    // Mini black hole
    const bh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    bh.position.set(0.5, 0.05, 0);
    rig.add(bh);

    const ringMat = (c: THREE.Color, op: number) => new THREE.MeshBasicMaterial({
      color: c, transparent: true, opacity: op,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    [0.88, 1.22, 1.65].forEach((r, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018 + i * 0.006, 10, 160), ringMat(i % 2 === 0 ? accent : accent2, 0.7 - i * 0.12));
      ring.position.set(0.5, 0.05, 0);
      ring.rotation.set(1.2 + i * 0.1, i * 0.28, 0.22);
      rig.add(ring);
    });

    const particles = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.018, 5, 5),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
      180,
    );
    const dummy = new THREE.Object3D();
    const pData = Array.from({ length: 180 }, () => ({
      r: 1.8 + Math.random() * 2.6, a: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 2.8, sp: 0.25 + Math.random() * 0.5, sc: 0.5 + Math.random(),
    }));
    scene.add(particles);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0014, 1.5));
    const pt = new THREE.PointLight(accent, 22, 5);
    pt.position.set(-1.2, 1.5, 2); scene.add(pt);

    const resize = () => {
      const { width, height } = readSceneSize(wrap);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const obs = new ResizeObserver(resize); obs.observe(wrap); resize();

    const clock = new THREE.Clock();
    let af = 0;
    const loop = () => {
      af = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      rig.rotation.y = t * 0.2; rig.rotation.x = Math.sin(t * 0.6) * 0.08;
      pData.forEach((p, i) => {
        const a = p.a + t * p.sp * 0.25;
        dummy.position.set(Math.cos(a) * p.r + 0.5, p.y, Math.sin(a) * p.r - 1.2);
        dummy.scale.setScalar(p.sc); dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);
      });
      particles.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };
    loop();
    return () => { cancelAnimationFrame(af); obs.disconnect(); renderer.dispose(); };
  }, [color, color2]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0 opacity-0 transition duration-500 group-hover:opacity-75">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent,rgba(2,4,8,0.55)_80%)]" />
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────
function PageShell({ children, pageKey }: { children: React.ReactNode; pageKey: Page }) {
  return (
    <motion.section
      key={pageKey}
      initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.86, rotateX: -12, filter: "blur(18px)" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex h-full min-h-0 items-center px-5 pb-6 pt-28"
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </motion.section>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -18, scale: 1.02 }}
      className="group relative isolate flex min-h-[480px] flex-col overflow-hidden rounded-2xl border p-7 backdrop-blur-sm transition-all duration-300"
      style={{
        borderColor: hovered ? project.color + "50" : "rgba(255,255,255,0.08)",
        background: hovered ? "rgba(8,5,20,0.94)" : "rgba(6,3,15,0.85)",
        boxShadow: hovered ? `0 30px 90px ${project.color}28, 0 0 0 1px ${project.color}22` : "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <NebulaScene color={project.color} color2={project.accent2} />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(6,3,15,0.85)_0%,rgba(6,3,15,0.4)_48%,rgba(6,3,15,0.9)_100%)] opacity-70 transition duration-300 group-hover:opacity-80" />
      <motion.div className="absolute inset-x-0 top-0 z-20 h-[2px] origin-left rounded-full"
        initial={{ scaleX: 0 }} animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.42 }}
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accent2})` }} />
      <motion.div className="pointer-events-none absolute -right-16 -top-16 z-0 h-52 w-52 rounded-full blur-3xl"
        animate={{ opacity: hovered ? 0.45 : 0, scale: hovered ? 1.1 : 0.8 }} transition={{ duration: 0.5 }}
        style={{ backgroundColor: project.color }} />
      {/* Constellation dots on hover */}
      {hovered && Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} className="pointer-events-none absolute z-[5] h-0.5 w-0.5 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0], x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 40 }}
          transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.18 }}
          style={{ backgroundColor: "white", left: `${20 + i * 10}%`, top: `${30 + (i % 4) * 15}%` }} />
      ))}

      <div className="relative z-20 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{ borderColor: project.color + "55", color: project.color, background: project.color + "14" }}>
            {project.tag}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.3)" }}>0{index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.4)" }}>
            {project.period}
          </span>
          <motion.a href={project.href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.2, rotate: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
            <ExternalLink className="h-3.5 w-3.5" />
          </motion.a>
        </div>
      </div>

      <motion.div className="relative z-20 mt-8" animate={{ y: hovered ? -4 : 0 }} transition={{ duration: 0.3 }}>
        <h3 className="font-mono text-[3rem] font-black leading-none tracking-tight text-white"
          style={{ textShadow: hovered ? `0 0 55px ${project.color}55` : "none" }}>
          {project.name}
        </h3>
        <p className="mt-2.5 text-sm font-semibold" style={{ color: project.color + "cc" }}>{project.type} · {project.role}</p>
        <p className="mt-5 text-[15px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.72)" }}>{project.summary}</p>
      </motion.div>

      <div className="relative z-20 mt-6 grid gap-1.5">
        {project.proof.map((item, i) => (
          <motion.div key={item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
            className="flex items-center gap-2.5 text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.68)" }}>
            <motion.span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              animate={{ scale: hovered ? [1, 1.6, 1] : 1, boxShadow: hovered ? [`0 0 0px ${project.color}`, `0 0 8px ${project.color}`, `0 0 0px ${project.color}`] : "none" }}
              transition={{ delay: i * 0.1, repeat: hovered ? Infinity : 0, repeatDelay: 0.8 }}
              style={{ backgroundColor: project.color }} />
            {item}
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 mt-auto flex flex-wrap gap-1.5 pt-5 border-t mt-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {project.stack.map((item) => (
          <span key={item} className="rounded-md border px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm"
            style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.58)" }}>
            {item}
          </span>
        ))}
      </div>

      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-6"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }} transition={{ duration: 0.3 }}>
        <span className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
          style={{ background: `linear-gradient(135deg, ${project.color}, ${project.accent2})`, color: "#020408" }}>
          <Rocket className="h-4 w-4" /> View on GitHub
        </span>
      </motion.div>
    </motion.article>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Tailwind", "Motion", "Docker", "PostgreSQL", "Leaflet", "JWT", "Vite"];

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <PageShell pageKey="Home">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm backdrop-blur-xl"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#43e97b" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#43e97b" }} />
            </span>
            Open to Internship · Thu Duc, HCM City
          </motion.div>

          <h1 className="font-mono text-6xl font-black leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
            <SplitText text="Nguyen" delay={0.15} />
            <br />
            <SplitText text="Van Hau" delay={0.35} />
            <motion.span initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95, type: "spring", stiffness: 280 }}
              style={{ color: "#ff3cac" }}>.</motion.span>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.6 }}
            className="mt-2 font-mono text-xs uppercase tracking-[0.32em]" style={{ color: "rgba(79,172,254,0.75)" }}>
            Full-Stack Developer · React · Node.js
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78, duration: 0.6 }}
            className="mt-7 max-w-2xl text-lg leading-[1.78]" style={{ color: "rgba(255,255,255,0.6)" }}>
            I build React and Node.js products with clear user flows, typed frontends, reliable APIs, and visual craft that makes the portfolio feel alive.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.92, duration: 0.5 }}
            className="mt-9 flex flex-wrap gap-3">
            <motion.button type="button" onClick={() => setPage("Work")}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 55px rgba(255,60,172,0.45)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center gap-2.5 rounded-xl px-6 text-base font-bold transition-all"
              style={{ background: "linear-gradient(135deg, #ff3cac, #784ba0)", color: "white", boxShadow: "0 12px 38px rgba(255,60,172,0.28)" }}>
              View selected work <ChevronRight className="h-4.5 w-4.5" />
            </motion.button>
            <motion.a href="https://github.com/hauvip123" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.05, borderColor: "#4facfe" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center gap-2.5 rounded-xl border px-6 text-base font-bold backdrop-blur-xl transition"
              style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", color: "white" }}>
              <Github className="h-4.5 w-4.5" /> GitHub
            </motion.a>
          </motion.div>
        </div>

        {/* Nebula badge side */}
        <div className="relative ml-auto hidden w-full max-w-[420px] lg:flex items-center justify-center">
          <TiltCard className="relative z-10 w-full">
            <motion.div initial={{ opacity: 0, scale: 0.88, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl border p-10 backdrop-blur-xl flex flex-col items-center justify-center text-center"
              style={{ borderColor: "rgba(255,60,172,0.3)", background: "rgba(6,3,15,0.7)", minHeight: 320 }}>
              {/* Orbit rings */}
              {[80, 130, 180].map((r, i) => (
                <motion.div key={i} className="pointer-events-none absolute rounded-full border"
                  style={{ width: r * 2, height: r * 2, borderColor: i === 0 ? "rgba(255,60,172,0.35)" : i === 1 ? "rgba(79,172,254,0.25)" : "rgba(67,233,123,0.2)" }}
                  animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
                  transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}>
                  {/* Orbit dot */}
                  <motion.div className="absolute h-2.5 w-2.5 -top-1.5 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ background: i === 0 ? "#ff3cac" : i === 1 ? "#4facfe" : "#43e97b", boxShadow: `0 0 10px ${i === 0 ? "#ff3cac" : i === 1 ? "#4facfe" : "#43e97b"}` }} />
                </motion.div>
              ))}
              {/* Core glow */}
              <motion.div className="relative z-10 h-24 w-24 rounded-full flex items-center justify-center"
                animate={{ boxShadow: ["0 0 30px rgba(255,60,172,0.5)", "0 0 60px rgba(79,172,254,0.6)", "0 0 30px rgba(67,233,123,0.5)", "0 0 30px rgba(255,60,172,0.5)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "radial-gradient(circle, rgba(255,60,172,0.3), rgba(79,172,254,0.2), transparent)" }}>
                <Rocket className="h-10 w-10 text-white opacity-90" />
              </motion.div>
              <div className="relative z-10 mt-6">
                <div className="font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "rgba(255,60,172,0.9)" }}>Hau.dev</div>
                <div className="mt-2 text-xl font-black text-white">Full-Stack Dev</div>
                <div className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>React · TypeScript · Node.js</div>
              </div>
            </motion.div>
          </TiltCard>

          <motion.div initial={{ opacity: 0, x: -24, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-8 -left-8 z-20 rounded-2xl border p-4 backdrop-blur-xl shadow-xl"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(2,4,8,0.85)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "#f9d423" }}>Recruiter snapshot</div>
            <div className="mt-1.5 text-sm font-semibold text-white">React · TypeScript · Node.js</div>
            <div className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>3.2 GPA · 2027 graduate</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-10 -right-6 z-20 rounded-2xl border p-3.5 backdrop-blur-xl"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(2,4,8,0.75)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "#43e97b" }}>Available</div>
            <div className="mt-1 text-sm font-bold text-white">Internship 2026</div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45, duration: 0.6 }} className="mt-12">
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
            <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "#f9d423" }}>
              <span className="h-px w-8" style={{ background: "#f9d423" }} />
              Orion Nebula · Selected work
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="max-w-4xl font-mono text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
              Hover cards.
              <br /><span style={{ color: "rgba(255,255,255,0.38)" }}>The content stands up.</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
            3 projects · Solo + team
          </motion.div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
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
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "#43e97b" }}>
            <span className="h-px w-8" style={{ background: "#43e97b" }} />
            Crab Nebula · Stack
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="max-w-4xl font-mono text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
            Practical tools,
            <br /><span style={{ color: "rgba(255,255,255,0.38)" }}>engineered across the cosmos.</span>
          </motion.h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <TiltCard key={cap.title}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative isolate h-full overflow-hidden rounded-2xl border p-7 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(5,2,14,0.88)" }}>
                  <NebulaScene color={cap.color} color2={i === 0 ? "#4facfe" : i === 1 ? "#38f9d7" : "#00f2fe"} />
                  <div className="pointer-events-none absolute inset-0 z-10 transition duration-300"
                    style={{ background: "linear-gradient(180deg,rgba(5,2,14,0.85)_0%,rgba(5,2,14,0.42)_52%,rgba(5,2,14,0.9)_100%)", opacity: 0.68 }} />
                  <motion.div className="pointer-events-none absolute -right-12 -top-12 z-0 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-38"
                    style={{ backgroundColor: cap.color }} />

                  <div className="relative z-20 mb-7 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:-translate-y-1"
                      style={{ background: cap.color + "18", border: `1px solid ${cap.color}38` }}>
                      <Icon className="h-5.5 w-5.5" style={{ color: cap.color }} />
                    </div>
                    <span className="font-mono text-4xl font-black" style={{ color: "rgba(255,255,255,0.07)" }}>{cap.number}</span>
                  </div>
                  <h3 className="relative z-20 text-xl font-black text-white">{cap.title}</h3>
                  <p className="relative z-20 mt-3.5 text-[15px] leading-[1.72]" style={{ color: "rgba(255,255,255,0.68)" }}>{cap.text}</p>
                  <div className="relative z-20 mt-6 flex flex-wrap gap-1.5">
                    {cap.chips.map((chip) => (
                      <span key={chip} className="rounded-md border px-2.5 py-1 text-[11px] font-bold"
                        style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.62)" }}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICS.map(({ value, label, color }, i) => {
            const num = parseFloat(value.replace("+", ""));
            const hasPlus = value.includes("+");
            return (
              <motion.div key={label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 + 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl border p-5 backdrop-blur-sm"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <div className="font-mono text-4xl font-black" style={{ color }}>
                  {Number.isInteger(num) ? <CountUp to={num} suffix={hasPlus ? "+" : ""} /> : value}
                </div>
                <div className="mt-1.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>{label}</div>
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
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "#a18cd1" }}>
            <span className="h-px w-8" style={{ background: "#a18cd1" }} />
            Eagle Nebula · About
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-mono text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
            Student engineer
            <br /><span style={{ color: "rgba(255,255,255,0.38)" }}>with a shipping mindset.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-[1.78]" style={{ color: "rgba(255,255,255,0.55)" }}>
            I like interfaces that feel alive, APIs that are easy to reason about, and teams that care about turning ambiguity into something usable.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Go (learning)", "MongoDB"].map((tech, i) => (
              <motion.span key={tech} initial={{ opacity: 0, scale: 0.78 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="rounded-full border px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.62)" }}>
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="space-y-3.5">
          {[
            [GraduationCap, "Education", "Software Engineering, Posts and Telecommunications Institute of Technology, 2022 – 2027.", "#a18cd1"],
            [BriefcaseBusiness, "Target role", "Full-stack Developer Intern, strongest contribution on React, TypeScript, and Node.js features.", "#f9d423"],
            [MapPin, "Location", "Thu Duc, Ho Chi Minh City. Ready for internship interviews and collaborative product teams.", "#43e97b"],
          ].map(([Icon, label, value, color], i) => {
            const ItemIcon = Icon as typeof GraduationCap;
            return (
              <motion.div key={label as string} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 8 }}
                className="rounded-2xl border p-6 backdrop-blur-sm transition-all"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(4,2,12,0.75)" }}>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: (color as string) + "14", border: `1px solid ${color as string}30`, color: color as string }}>
                    <ItemIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.32)" }}>{label}</div>
                    <p className="mt-2 text-[15px] leading-[1.72]" style={{ color: "rgba(255,255,255,0.62)" }}>{value}</p>
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
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
          className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "#4facfe" }}>
          <span className="h-px w-8" style={{ background: "#4facfe" }} />
          Helix Nebula · Contact
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-3 font-mono text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
          Let's talk internship.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-10 max-w-lg text-base leading-[1.78]" style={{ color: "rgba(255,255,255,0.48)" }}>
          Ready to join a team, build product features, and learn from senior engineers from day one.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          style={{ borderColor: "rgba(79,172,254,0.25)", background: "rgba(250,252,255,0.97)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ff3cac, #f9d423, #43e97b, #4facfe, #a18cd1)" }} />
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: "#ff3cac" }}>Nguyen Van Hau</div>
              <p className="mt-3 max-w-sm text-[15px] leading-[1.78]" style={{ color: "#2d3748" }}>
                Looking to contribute from day one — building features, growing fast, and shipping products that matter.
              </p>
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: "rgba(67,233,123,0.3)", background: "rgba(67,233,123,0.1)", color: "#166534" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#43e97b" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#43e97b" }} />
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
                <motion.a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  whileHover={{ x: 5, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3.5 rounded-xl px-5 py-3.5 text-sm font-bold transition-all"
                  style={primary
                    ? { background: "linear-gradient(135deg,#020408,#1a0a2e)", color: "white" }
                    : { border: "1px solid #cbd5e1", color: "#0f172a", background: "white" }}>
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

// ── Nebula page label ─────────────────────────────────────────────────────────
function NebulaLabel({ page }: { page: Page }) {
  const theme = COSMIC_THEMES[page];
  return (
    <motion.div
      key={page + "-label"}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed right-5 top-1/2 z-30 -translate-y-1/2 hidden xl:flex flex-col items-end gap-1.5"
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>location</div>
      <div className="font-mono text-sm font-bold" style={{ color: theme.nebula1 }}>{theme.name}</div>
      <div className="h-12 w-px" style={{ background: `linear-gradient(to bottom, ${theme.nebula1}88, transparent)` }} />
    </motion.div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function PortfolioDeck() {
  const [page, setPage] = useState<Page>("Home");
  const [warpToken, setWarpToken] = useState(0);

  useEffect(() => {
    const readHash = () => {
      const next = PAGES.find((p) => p.toLowerCase() === window.location.hash.replace("#", "").toLowerCase());
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
    <main className="relative h-screen overflow-hidden text-white" style={{ background: "#000", cursor: "none" }}>
      <SpaceshipCursor />
      <GrainOverlay />
      <StarField page={page} />
      <BlackHoleScene activePage={page} />

      <AnimatePresence>
        <WarpTransition token={warpToken} />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <NebulaLabel key={page + "-nl"} page={page} />
      </AnimatePresence>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-5 py-3.5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(2,4,8,0.72)" }}>
          <button type="button" onClick={() => goTo("Home")}
            className="font-mono text-lg font-black tracking-tight text-white transition"
            style={{ textShadow: "0 0 20px rgba(255,60,172,0.6)" }}>
            Hau<span style={{ color: "#ff3cac" }}>.</span>dev
          </button>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex" style={{ color: "rgba(255,255,255,0.5)" }}>
            {PAGES.map((item) => (
              <button key={item} type="button" onClick={() => goTo(item)}
                className="relative rounded-xl px-4 py-2 transition-all font-mono"
                style={page === item
                  ? { background: "rgba(255,255,255,0.95)", color: "#020408", fontWeight: 700 }
                  : {}}>
                {item}
                {page === item && (
                  <motion.span layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.95)", zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
              </button>
            ))}
          </nav>

          <motion.button type="button" onClick={() => goTo("Contact")}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 28px rgba(255,60,172,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #ff3cac, #784ba0)", color: "white" }}>
            <Rocket className="h-4 w-4" /> Hire me
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

      {/* Mobile nav */}
      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2.5 rounded-2xl border px-4 py-2.5 backdrop-blur-xl md:hidden"
        style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(2,4,8,0.8)" }}>
        {PAGES.map((item) => (
          <button key={item} type="button" onClick={() => goTo(item)} aria-label={item} className="transition-all duration-300">
            <motion.span className="block rounded-full"
              animate={{
                width: page === item ? 28 : 10,
                height: 10,
                backgroundColor: page === item ? COSMIC_THEMES[item].nebula1 : "rgba(255,255,255,0.28)",
                boxShadow: page === item ? `0 0 8px ${COSMIC_THEMES[item].nebula1}` : "none",
              }}
              transition={{ duration: 0.32 }} />
          </button>
        ))}
      </div>
    </main>
  );
}