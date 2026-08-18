"use client";

import { useEffect, useRef } from "react";

// A quiet, full-bleed particle drift meant to sit *behind* section content
// (absolutely positioned, pointer-events disabled). Adds motion without
// competing with the text on top of it.
export default function AmbientParticles({ color = 0xc9932a, count = 120 }) {
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
      let height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 20);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        speeds[i] = 0.05 + Math.random() * 0.12;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color, size: 0.05, transparent: true, opacity: 0.35 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const onResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let frameId;
      const animate = () => {
        const dt = clock.getDelta();
        const pos = geo.attributes.position.array;
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] += speeds[i] * dt;
          if (pos[i * 3 + 1] > 3.6) pos[i * 3 + 1] = -3.6;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.y += dt * 0.02;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        window.removeEventListener("resize", onResize);
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
  }, [color, count]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}   