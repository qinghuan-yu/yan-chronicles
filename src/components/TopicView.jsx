import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ContentTransition } from './ContentTransition';
import { Icon } from './Icon';

const decodedImages = new Map();
const imageUrl = image => typeof image === 'string' ? image : image?.url;
const getImages = (content, portrait) => {
  if (content.images?.length) return content.images.filter(image => image.src);
  const src = imageUrl(portrait ? content.coverPortrait : content.cover) || imageUrl(content.cover) || imageUrl(content.coverPortrait);
  return src ? [{ src, label: content.title, position: portrait ? content.positionPortrait : content.position }] : [];
};
const decodeImage = src => {
  if (!src) return Promise.resolve();
  if (decodedImages.has(src)) return decodedImages.get(src);
  const loading = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = async () => {
      try { if (image.decode) await image.decode(); resolve(); }
      catch { reject(new Error('无法解码图片')); }
    };
    image.onerror = () => reject(new Error('无法加载图片'));
    image.src = src;
  }).catch(error => { decodedImages.delete(src); throw error; });
  decodedImages.set(src, loading);
  return loading;
};

export function TopicView({ title, topics = [], onReturn, active, visible }) {
  const portrait = useMediaQuery('(orientation: portrait)');
  const galleries = useMemo(() => topics.map(entry => getImages(entry.content, portrait)), [topics, portrait]);
  const galleryKey = JSON.stringify(galleries);
  const currentGalleries = useRef(galleries);
  currentGalleries.current = galleries;
  const returnHandler = useRef(onReturn);
  returnHandler.current = onReturn;
  const [selection, setSelection] = useState(() => ({ topicIndex: 0, imageIndex: 0, image: galleries[0]?.[0] }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const requested = useRef({ topicIndex: 0, imageIndex: 0 });
  const generation = useRef(0);
  const currentSelection = useRef(selection);
  currentSelection.current = selection;
  const root = useRef(null);
  const returnButton = useRef(null);
  const dialog = useRef(null);
  const dialogClose = useRef(null);
  const enlargeButton = useRef(null);
  const audio = useRef(null);
  const dialogTitle = useId();
  const index = selection.topicIndex;
  const topic = topics[index]?.content;
  const images = galleries[index] || [];
  const currentImage = selection.image;
  const isOpen = visible && active;

  const requestImage = useCallback(async target => {
    const gallery = currentGalleries.current[target.topicIndex] || [];
    const imageIndex = gallery.length ? ((target.imageIndex % gallery.length) + gallery.length) % gallery.length : 0;
    const next = { topicIndex: target.topicIndex, imageIndex };
    requested.current = next;
    const ticket = ++generation.current;
    setPending(true);
    setError('');
    try {
      const image = gallery[imageIndex];
      await decodeImage(image?.src);
      if (ticket !== generation.current) return;
      setSelection({ ...next, image });
      setPending(false);
    } catch {
      if (ticket !== generation.current) return;
      setPending(false);
      setError('图片未能载入，当前画面已保留。');
    }
  }, []);

  const stepImage = direction => requestImage({ ...requested.current, imageIndex: requested.current.imageIndex + direction });
  const selectTopic = topicIndex => requestImage({ topicIndex, imageIndex: 0 });
  const closeImage = () => dialog.current?.close();
  const openImage = () => {
    if (!currentImage?.src || !dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    setExpanded(true);
    dialogClose.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (isOpen) {
      requestImage(requested.current);
      return;
    }
    ++generation.current;
    requested.current = { topicIndex: currentSelection.current.topicIndex, imageIndex: currentSelection.current.imageIndex };
    setPending(false);
    setError('');
    audio.current?.pause();
    dialog.current?.close();
  }, [isOpen, galleryKey, requestImage]);

  useEffect(() => { audio.current?.pause(); }, [index]);
  useEffect(() => () => { ++generation.current; }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const frame = requestAnimationFrame(() => returnButton.current?.focus({ preventScroll: true }));
    const keydown = event => {
      if (dialog.current?.open || event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      returnHandler.current();
    };
    document.addEventListener('keydown', keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', keydown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.closest('[inert]')) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!topic) return null;
  const actionContent = button => <>
    <span className="topic-flag" style={{ backgroundColor: button.themeColor || '#c7a66b' }} />
    <span className="topic-subText">{button.subText}</span>
    <span className="topic-primaryText">{button.primaryText}</span>
    <span className="topic-icon"><Icon name="icon_arrow" /></span>
  </>;
  const galleryNavigation = modal => <div className={`archive-galleryControls ${modal ? 'archive-modalControls' : ''}`}>
    <button type="button" aria-label="上一张图片" disabled={images.length < 2} onClick={() => stepImage(-1)}>←</button>
    <span className="archive-imageCount" aria-live="polite">{String(selection.imageIndex + 1).padStart(2, '0')}<span>/ {String(images.length).padStart(2, '0')}</span></span>
    <button type="button" aria-label="下一张图片" disabled={images.length < 2} onClick={() => stepImage(1)}>→</button>
    {!modal && <button ref={enlargeButton} type="button" className="archive-enlarge" onClick={openImage}>查看原图 <span aria-hidden="true">↗</span></button>}
  </div>;
  const loadingStatus = <div className="archive-loadStatus" role="status" aria-live="polite">
    {pending ? '正在载入下一幅画面…' : error}
    {error && <button type="button" onClick={() => requestImage(requested.current)}>重试</button>}
  </div>;

  return <div ref={root} className={`topic-container archive-topic ${visible ? 'topic-active' : ''}`} inert={!isOpen} data-scrollable onWheel={event => event.stopPropagation()}>
    <ContentTransition state={`${index}:${currentImage?.src}`}><div className="topic-bgWrapper"><div className="topic-bg" style={{
      backgroundImage: currentImage?.src ? `linear-gradient(90deg, rgba(0,0,0,.72), transparent 75%), linear-gradient(0deg, rgba(0,0,0,.72), transparent 72%), url("${currentImage.src}")` : undefined,
      backgroundPosition: currentImage?.position || (portrait ? topic.positionPortrait : topic.position) || 'center'
    }} /></div></ContentTransition>
    <div className="topic-bgMask" />
    <div className="topic-tabList"><div className="topic-_tabList">{topics.map((entry, i) => <button type="button" key={entry.cid || i}
      className={`topic-tabItem ${index === i ? 'topic-active' : ''}`} aria-pressed={index === i} onClick={() => selectTopic(i)}>
      <span className="topic-text">{entry.content.title}</span><span className="topic-icon"><Icon name="icon_arrow" /></span>
    </button>)}</div></div>
    {!portrait && <div className="topic-floatingText">{title}</div>}
    {currentImage && <div className="archive-gallery" aria-label="画面浏览" aria-busy={pending}>
      <p className="archive-imageLabel">{currentImage.label || topic.title}</p>
      {galleryNavigation(false)}
      {!expanded && loadingStatus}
    </div>}
    <ContentTransition state={index} direction="horizontal"><div className="topic-topicInfo">
      <div className="topic-subtitle">{topic.subtitle}</div><h2 className="topic-title">{topic.title}</h2><div className="topic-titleLine" />
      <p className="topic-description">{topic.description}</p>
      {topic.audio === true && <div className="archive-audio"><span>赴大荒 · 音乐档案</span><audio ref={audio} controls preload="none" src="/assets/audio/fu-da-huang.mp3" onPlay={() => window.dispatchEvent(new Event('dayan:pause-background'))} /></div>}
      <div className="topic-actions">{(topic.buttons || topics[index]?.buttons || []).map((button, i) =>
        <a key={i} className="topic-action" href={button.href} target={/^https?:/.test(button.href || '') ? '_blank' : undefined} rel="noreferrer">{actionContent(button)}</a>
      )}</div><div className="topic-actionsLine" />
    </div></ContentTransition>
    <div className="topic-navContainer">{topics.map((entry, i) => <button type="button" className={`topic-navItem ${index === i ? 'topic-active' : ''}`} key={entry.cid || i} aria-label={`切换至${entry.content.title}`} aria-pressed={index === i} onClick={() => selectTopic(i)} />)}</div>
    <div className="topic-buttons"><button ref={returnButton} type="button" className="topic-button topic-returnBtn" onClick={onReturn}><span className="topic-icon"><Icon name="icon_arrow_hrz" /></span><span className="topic-btnText"><span className="topic-main">返回</span><span className="topic-sub">GO BACK</span></span></button></div>
    <div className="topic-coordMark" />
    <dialog ref={dialog} className="archive-lightbox" aria-labelledby={dialogTitle} onCancel={event => { event.preventDefault(); event.stopPropagation(); closeImage(); }} onClose={() => {
      setExpanded(false);
      if (isOpen) enlargeButton.current?.focus({ preventScroll: true });
    }} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); stepImage(event.key === 'ArrowLeft' ? -1 : 1);
      }
      event.stopPropagation();
    }}>
      <div className="archive-lightboxHeader"><h2 id={dialogTitle}>{currentImage?.label || topic.title}</h2><button ref={dialogClose} type="button" className="archive-close" onClick={closeImage} aria-label="关闭原图">关闭 <span aria-hidden="true">×</span></button></div>
      <div className="archive-lightboxImage">{currentImage && <img src={currentImage.src} alt={currentImage.label || topic.title} />}</div>
      <div className="archive-lightboxFooter">{galleryNavigation(true)}{expanded && loadingStatus}</div>
    </dialog>
  </div>;
}
