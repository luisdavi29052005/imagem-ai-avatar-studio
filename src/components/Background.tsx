
import { useEffect, useRef } from "react";

export function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and animate particles
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing particles
    container.innerHTML = '';

    // Create new particles
    const particleCount = window.innerWidth < 768 ? 20 : 30;
    for (let i = 0; i < particleCount; i++) {
      createParticle(container);
    }

    // Handle window resize
    const handleResize = () => {
      container.innerHTML = '';
      const newCount = window.innerWidth < 768 ? 20 : 30;
      for (let i = 0; i < newCount; i++) {
        createParticle(container);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createParticle = (container: HTMLDivElement) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random opacity
    particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
    
    // Add to container
    container.appendChild(particle);
    
    // Animate
    animateParticle(particle);
  };

  const animateParticle = (particle: HTMLDivElement) => {
    const duration = Math.random() * 100 + 10;
    const xMovement = Math.random() * 20 - 10;
    const yMovement = Math.random() * 20 - 10;
    
    // Set the animation
    particle.animate(
      [
        { transform: `translate(0, 0)` },
        { transform: `translate(${xMovement}px, ${yMovement}px)` }
      ],
      {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      }
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient bg-grid">
      <div ref={containerRef} className="particles-container"></div>
      <div className="blob purple-blob"></div>
      <div className="blob blue-blob"></div>
    </div>
  );
}
