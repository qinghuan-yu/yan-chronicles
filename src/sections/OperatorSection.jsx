import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Scrollbar } from 'swiper/modules';
import operators from '../data/operators.json';
import { Icon } from '../components/Icon';
import { ContentTransition } from '../components/ContentTransition';
import { BorderText } from '../components/BorderText';

const decoded = new Map();
const loadArtwork = src => {
  if (!decoded.has(src)) {
    const img = new Image(); img.src = src;
    decoded.set(src, img.decode().catch(error => { decoded.delete(src); throw error; }));
  }
  return decoded.get(src);
};
export default function OperatorSection() {
  const [choice, setChoice] = useState({ index: 1, phase: 1 });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const request = useRef(0), desired = useRef(choice), phases = useRef({});
  const { index, phase } = choice;
  const operator = operators[index], illustration = operator.illustList[phase];
  const focus = illustration.focus, styled = illustration.styledFocus;
  const choose = async (nextIndex, nextPhase = phases.current[operators[nextIndex].id] ?? 1) => {
    const token = ++request.current;
    desired.current = { index: nextIndex, phase: nextPhase };
    setPending(true); setError(false);
    try {
      await loadArtwork(operators[nextIndex].illustList[nextPhase].illust);
      if (token !== request.current) return;
      phases.current[operators[nextIndex].id] = nextPhase;
      setChoice({ index: nextIndex, phase: nextPhase }); setPending(false);
    } catch { if (token === request.current) { setPending(false); setError(true); } }
  };
  useEffect(() => {
    loadArtwork(illustration.illust).catch(() => setError(true));
    // 当前画面就绪后再预解码其余立绘；容器始终保持固定尺寸。
    const timer = setTimeout(() => operators.forEach(entry => entry.illustList.forEach(art => loadArtwork(art.illust).catch(() => {}))), 800);
    return () => { clearTimeout(timer); request.current++; };
  }, []);
  return <div className="operator-container">
    <div className="operator-bgMask" />
    <div className="operator-illustStyled"><ContentTransition state={index + '-' + phase} direction="horizontal"><div className="operator-img" style={{ backgroundImage:'url(' + illustration.illust + ')', backgroundSize:'220rem auto', backgroundPosition:(48-styled.x*220)+'rem '+(19-styled.y*220)+'rem' }} /></ContentTransition></div>
    <ContentTransition state={index + '-' + phase} direction="horizontal" reverse><div className="operator-illust"><div className="operator-imgWrapper"><img className="operator-img" src={illustration.illust} alt={operator.name + ' · 精英' + (phase ? '二' : '零') + '立绘'} width="2048" height="2048" style={{ transform:'translate('+focus.tx*100+'%,'+focus.ty*100+'%) scale('+focus.scale+')' }} /></div></div></ContentTransition>
    <div className="operator-artworkShade" /><div className="operator-bottomBlock" />
    <div className="operator-moduleTitle"><div className="operator-title">YAN ://</div><div className="operator-subtitle">CHARACTERS</div></div>
    <div className="operator-main"><div className="operator-_main">
      <ContentTransition state={operator.id} direction="horizontal" reverse><div className="operator-charInfo">
        <div className="operator-codenameShadowed"><div className="operator-text">{operator.codename}</div><BorderText>{operator.codename}</BorderText></div>
        <div className="operator-charNameAndCamp"><div className="operator-charName"><div className="operator-codename">{operator.codename}</div><h2 className="operator-name">{operator.name}</h2></div><div className="operator-camp"><img className="operator-img" src={operator.camp} alt="" /></div></div>
        <div className="operator-voiceContainer"><a className="operator-archiveLink" href={operator.url} target="_blank" rel="noreferrer">人物档案 · PRTS<span><Icon name="icon_arrow" /></span></a><span className="operator-profession">{operator.profession}</span></div>
        <p className="operator-intro">{operator.description}</p>
      </div></ContentTransition>
      <div className="operator-list" data-scrollable><Swiper className="operator-scrollView" slidesPerView={4} modules={[FreeMode,Scrollbar]} freeMode grabCursor scrollbar={{el:'.operator-scrollbar',draggable:true}}>
        {operators.map((item,i)=><SwiperSlide key={item.id}><button type="button" className={'operator-charAvatar '+(i===index?'operator-active':'')} aria-label={'选择人物 '+item.name} aria-pressed={i===index} onClick={()=>choose(i)}>
          <span className="operator-flag" /><span className="operator-border" /><span className="operator-avatar"><img className="operator-img" src={item.avatar} alt="" width="180" height="180" /></span><span className="operator-info"><span className="operator-charName">{item.name}</span></span>
        </button></SwiperSlide>)}
      </Swiper></div><div className="operator-scrollbar" />
    </div></div>
    <div className="operator-phaseSelector">{operator.illustList.map((art,i)=><button type="button" key={art.phase} aria-label={'切换至精英'+(i?'二':'零')+'立绘'} aria-pressed={phase===i} className={'operator-phaseItem '+(phase===i?'operator-active':'')} onClick={()=>choose(index,i)}><span className="operator-icon"><Icon name={'elite_phase_'+art.phase} /></span></button>)}</div>
    <div className="operator-loadStatus" role="status">{pending ? 'LOADING / 立绘载入中' : error ? <button onClick={()=>choose(desired.current.index,desired.current.phase)}>立绘未载入 · 点击重试</button> : ''}</div>
  </div>;
}
