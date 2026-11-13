import { useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';

function MountainDust({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current, ctx = canvas.getContext('2d');
    let frame, previous = 0;
    const points = Array.from({ length: 48 }, () => ({ x: Math.random(), y: Math.random(), size: .5 + Math.random() * 1.3, speed: .003 + Math.random() * .007, phase: Math.random() * 6 }));
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    const draw = time => {
      const dt = previous ? Math.min((time - previous) / 1000, .05) : 0; previous = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach(p => {
        p.y -= p.speed * dt; if (p.y < -.02) p.y = 1.02;
        ctx.globalAlpha = .12 + (Math.sin(time / 2300 + p.phase) + 1) * .18;
        ctx.fillStyle = '#f0dcaf'; ctx.beginPath();
        ctx.arc((p.x + Math.sin(time / 9000 + p.phase) * .008) * canvas.width, p.y * canvas.height, p.size, 0, Math.PI * 2); ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    const visibility = () => { cancelAnimationFrame(frame); previous = 0; if (!document.hidden) frame = requestAnimationFrame(draw); };
    resize(); visibility(); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, [active]);
  return <canvas className="home-dust" ref={ref} aria-hidden="true" />;
}
export default function HomeSection({ active }) {
  return <div className={'home-container ' + (active ? 'home-active' : '')}>
    <div className="home-bg" /><div className="home-scenicShade" /><MountainDust active={active} />
    <div className="home-maskBlock" /><div className="home-maskBlock2" /><div className="home-bottomShadow" />
    <div className="home-poem" aria-hidden="true"><span>天地、星月、风雨、时令、云烟。</span><i>山河风物志 · 序</i></div>
    <div className="home-infos"><div className="home-main"><h1 className="home-primaryText">大炎</h1>
      <div className="home-subBox"><div className="home-secondaryText">山河风物志</div><div className="home-linkText">TERRA / YAN · LANDSCAPE ARCHIVE</div></div>
    </div><div className="home-copyright"><Icon name="copyright_mini" /></div></div>
  </div>;
}
