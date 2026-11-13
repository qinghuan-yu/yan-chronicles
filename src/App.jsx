import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SceneChrome } from './components/SceneChrome';
import { LoadingScreen } from './components/LoadingScreen';
import { easeInOutQuad } from './animations/timing';
import { useSectionNavigation } from './hooks/useSectionNavigation';
import { sections } from './data/sections';
import HomeSection from './sections/HomeSection';
const NewsSection = lazy(() => import('./sections/NewsSection'));
const OperatorSection = lazy(() => import('./sections/OperatorSection'));
const WorldSection = lazy(() => import('./sections/WorldSection'));
const MediaSection = lazy(() => import('./sections/MediaSection'));
const MoreSection = lazy(() => import('./sections/MoreSection'));

const components = [HomeSection, NewsSection, OperatorSection, WorldSection, MediaSection, MoreSection];

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const { index, navigate } = useSectionNavigation(menuOpen || !ready);
  const [motion, setMotion] = useState({ index, direction: 1 });
  if (motion.index !== index) setMotion({ index, direction: Math.sign(index - motion.index) });
  // Load a section on its first visit, then retain its local selection and history.
  const [visited, setVisited] = useState(() => new Set([index]));
  useEffect(() => {
    setVisited(previous => previous.has(index) ? previous : new Set([...previous, index]));
    document.title = sections[index].title + ' · 大炎山河风物志';
  }, [index]);
  return <>
    <Header index={index} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main id="main-content" className="page-sections" data-direction={motion.direction} inert={menuOpen || !ready} style={{ '--section-easing': easeInOutQuad }}>
      {components.map((Section, position) => <section key={sections[position].id} id={`section-${sections[position].id}`} aria-label={sections[position].title}
        data-position={position < index ? 'before' : position > index ? 'after' : 'current'} className={`page-section ${index === position ? 'is-active' : ''}`} inert={index !== position} aria-hidden={index !== position}>
        {(index === position || visited.has(position)) && <Suspense fallback={<div className="section-loading" role="status">正在加载{sections[position].title}…</div>}>
          <Section active={index === position && ready} />
        </Suspense>}
      </section>)}
    </main>
    <SceneChrome index={index} ready={ready} menuOpen={menuOpen} navigate={navigate} />
    <LoadingScreen onReady={onReady} />
    {index === 5 && <footer className="site-footer">大炎 · 非官方主题作品 / 美术与音乐权利归原权利人所有</footer>}
  </>;
}
