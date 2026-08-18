"use client";

import { useEffect, useRef } from "react";

function getThemeColors() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    accent: isDark ? 0x9b81ff : 0x7c5cfc,
    sage: isDark ? 0x7fa38c : 0x5c7d68,
    particle: isDark ? 0xf2f0f7 : 0x1a1726,
  };
}

// Full-bleed hero background: two wireframe solids drifting inside a wide
// particle field, with mouse-parallax. Colors adapt live to light/dark theme
// via a MutationObserver on <html data-theme>. Three.js loads dynamically
// (client-only) so nothing touches WebGL/window during SSR.
export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      let width = container.clientWidth;
      let height = container.clientHeight || width;

      const colors = getThemeColors();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 9;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const icoGeo = new THREE.IcosahedronGeometry(2.3, 1);
      const icoMat = new THREE.MeshBasicMaterial({ color: colors.accent, wireframe: true, transparent: true, opacity: 0.4 });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      ico.position.set(2.6, 0.4, -1);
      scene.add(ico);

      const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.24, 140, 16);
      const knotMat = new THREE.MeshBasicMaterial({ color: colors.sage, wireframe: true, transparent: true, opacity: 0.32 });
      const knot = new THREE.Mesh(knotGeo, knotMat);
      knot.position.set(-3.2, -0.8, -1.5);
      scene.add(knot);

      // Wide particle field spanning the full hero
      const particleCount = 320;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ color: colors.particle, size: 0.035, transparent: true, opacity: 0.22 });
      const points = new THREE.Points(particleGeo, particleMat);
      scene.add(points);

      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight || width;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      // Live-update colors if the person toggles light/dark theme
      const themeObserver = new MutationObserver(() => {
        const c = getThemeColors();
        icoMat.color.setHex(c.accent);
        knotMat.color.setHex(c.sage);
        particleMat.color.setHex(c.particle);
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const clock = new THREE.Clock();
      let frameId;
      const animate = () => {
        const t = clock.getElapsedTime();
        ico.rotation.x = t * 0.12;
        ico.rotation.y = t * 0.18;
        knot.rotation.x = -t * 0.2;
        knot.rotation.y = t * 0.15;
        points.rotation.y = t * 0.025;

        camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        themeObserver.disconnect();
        cancelAnimationFrame(frameId);
        icoGeo.dispose();
        icoMat.dispose();
        knotGeo.dispose();
        knotMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
}