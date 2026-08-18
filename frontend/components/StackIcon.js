"use client";

import { useEffect, useRef } from "react";

// A small, self-contained rotating wireframe icon. `shape` picks the
// geometry so each category on the page gets a visually distinct mark.
export default function StackIcon({ shape = "ico", size = 52, color = 0xc9932a }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(size, size);
      container.appendChild(renderer.domElement);

      const geometries = {
        ico: () => new THREE.IcosahedronGeometry(1, 0),
        octa: () => new THREE.OctahedronGeometry(1, 0),
        sphere: () => new THREE.SphereGeometry(1, 12, 8),
        box: () => new THREE.BoxGeometry(1.3, 1.3, 1.3),
        torus: () => new THREE.TorusGeometry(0.8, 0.28, 8, 24),
        tetra: () => new THREE.TetrahedronGeometry(1.15, 0),
      };
      const geo = (geometries[shape] || geometries.ico)();
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.85 });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const clock = new THREE.Clock();
      let frameId;
      const animate = () => {
        const t = clock.getElapsedTime();
        mesh.rotation.x = t * 0.4;
        mesh.rotation.y = t * 0.55;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frameId);
        geo.dispose();
        mat.dispose();
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
  }, [shape, size, color]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}