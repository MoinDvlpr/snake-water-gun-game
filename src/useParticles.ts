import { useRef, useCallback } from 'react';
import { Particle } from './types';

let particleId = 0;

export function useParticles() {
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const colors = {
    win: ['#39ff14', '#00ff88', '#88ff00', '#00ffaa', '#66ff33'],
    lose: ['#ff006e', '#ff3366', '#ff0044', '#ff6688', '#cc0044'],
    draw: ['#ffe600', '#ffcc00', '#ffaa00', '#ff8800', '#ffdd44'],
    confetti: ['#39ff14', '#00fff5', '#ff006e', '#ffe600', '#b026ff', '#ff6600', '#00aaff'],
  };

  const spawnParticles = useCallback((
    x: number,
    y: number,
    count: number,
    colorSet: string[],
    type: Particle['type'] = 'spark',
    spread = 200,
    lifeRange = [30, 60] as [number, number]
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (Math.random() * spread) / 30 + spread / 60;
      particlesRef.current.push({
        id: particleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'confetti' ? 2 : 0),
        life: lifeRange[0] + Math.random() * (lifeRange[1] - lifeRange[0]),
        maxLife: lifeRange[1],
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        size: type === 'confetti' ? 4 + Math.random() * 4 : type === 'ring' ? 10 + Math.random() * 15 : 2 + Math.random() * 4,
        type,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
      });
    }
  }, []);

  const emitWin = useCallback((x: number, y: number) => {
    spawnParticles(x, y, 30, colors.win, 'spark', 250, [40, 70]);
    spawnParticles(x, y, 15, colors.confetti, 'confetti', 300, [50, 90]);
    spawnParticles(x, y, 5, colors.win, 'ring', 100, [30, 50]);
    spawnParticles(x, y, 8, colors.win, 'star', 200, [40, 70]);
  }, [spawnParticles]);

  const emitLose = useCallback((x: number, y: number) => {
    spawnParticles(x, y, 20, colors.lose, 'spark', 180, [30, 50]);
    spawnParticles(x, y, 3, colors.lose, 'ring', 80, [20, 40]);
  }, [spawnParticles]);

  const emitDraw = useCallback((x: number, y: number) => {
    spawnParticles(x, y, 15, colors.draw, 'spark', 150, [30, 50]);
    spawnParticles(x, y, 5, colors.draw, 'star', 120, [30, 50]);
  }, [spawnParticles]);

  const emitConfetti = useCallback((width: number, _height: number) => {
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = -20;
      spawnParticles(x, y, 1, colors.confetti, 'confetti', 50, [80, 140]);
    }
  }, [spawnParticles]);

  const updateAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const alive: Particle[] = [];

    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.vx *= 0.98;
      p.life -= 1;
      p.rotation += p.rotationSpeed;

      if (p.life <= 0) continue;
      alive.push(p);

      const alpha = Math.min(1, p.life / (p.maxLife * 0.3));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.type === 'spark') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      } else if (p.type === 'confetti') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'ring') {
        const progress = 1 - p.life / p.maxLife;
        const radius = p.size * (1 + progress * 3);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.stroke();
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
        ctx.fill();
      }

      ctx.restore();
    }

    particlesRef.current = alive;

    if (alive.length > 0 || isRunningRef.current) {
      animFrameRef.current = requestAnimationFrame(updateAndDraw);
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animFrameRef.current = requestAnimationFrame(updateAndDraw);
    }
  }, [updateAndDraw]);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  return {
    canvasRef,
    emitWin,
    emitLose,
    emitDraw,
    emitConfetti,
    startLoop,
    stopLoop,
  };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
