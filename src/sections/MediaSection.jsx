import { useState } from 'react';
import modules from '../data/media.json';
import { TopicView } from '../components/TopicView';
import { cityTopics, musicTopics } from '../data/dayan';
import { Icon } from '../components/Icon';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ContentTransition } from '../components/ContentTransition';

const labels = { GALLERY: ['山河画卷', '览五城风景，寻一卷人间'], VIDEO: ['赴大荒', '循着旧作里的旋律，走入山河'] };
const names = { GALLERY: 'GALLERY', VIDEO: 'MUSIC' };
const percent = (value, total) => `${value / total * 100}%`;

export default function MediaSection({ active }) {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(null);
  const portrait = useMediaQuery('(orientation: portrait)');
  return <div className="media-container"><div className="media-bgMask" />
    <div className={`media-home ${view === null ? 'media-active' : ''}`} inert={view !== null}><div className="media-blurHandler" onClick={() => setSelected(null)} />
      <div className="media-_home"><div className="media-blurHandler" onClick={() => setSelected(null)} />
        <div className="media-mainStage"><div className="media-screen" aria-hidden="true"><img src="/assets/scenes/mountains.png" alt="" /><span>山河档案</span></div>{modules.map(item => {
          const box = item.activeImageStyles;
          const title = portrait ? item.titleStylesPortrait : item.titleStyles;
          return <button type="button" key={item.key} className={`media-moduleItem ${selected === item.key ? 'media-active' : ''}`} aria-label={`选择${labels[item.key][0]}`}
            style={{ width: percent(box.width, 1027), height: percent(box.height, 814), left: percent(box.left, 1027), top: percent(box.top, 814) }} onClick={() => selected === item.key ? setView(item.key) : setSelected(item.key)}>
            <span className="media-blockOne" style={{ left: percent(item.blockOne.left, box.width), top: percent(item.blockOne.top, box.height) }} /><span className="media-blockTwo" style={{ left: percent(item.blockTwo.left, box.width), top: percent(item.blockTwo.top, box.height) }} />
            <img className="media-moduleImg" src={item.activeImage} alt="" /><span className="media-title" style={{ left: percent(title.left, box.width), top: percent(title.top, box.height) }}><i className="media-box" />{names[item.key]}</span>
            <span className="media-logo" style={{ width: item.logoStyles.width ? percent(item.logoStyles.width, box.width) : undefined, left: percent(item.logoStyles.left, box.width), top: percent(item.logoStyles.top, box.height) }}><img className="media-img" src={item.logo} alt="" /><span className="media-logoTitle">{names[item.key]}</span></span>
            <span className="media-hitBox" style={{ width: percent(item.hotArea.width, box.width), height: percent(item.hotArea.height, box.height), left: percent(item.hotArea.left, box.width), top: percent(item.hotArea.top, box.height) }} />
          </button>;
        })}</div>
        <div className="media-moduleTitle"><div className="media-title">AUDIO / VISUAL</div><div className="media-moduleMenu">{modules.map(item => <button type="button" key={item.key} className={`media-item ${selected === item.key ? 'media-active' : ''}`} aria-pressed={selected === item.key} onClick={() => setSelected(item.key)}><span className="media-checkbox" />{names[item.key]}</button>)}</div></div>
        <div className="media-floatingText">AUDIO / VISUAL</div><div className="media-info"><ContentTransition state={selected}><div>
          <div className="media-subtitle">{names[selected] || 'AUDIO / VISUAL'}</div><h2 className="media-title">{selected ? labels[selected][0] : '山河视听'}</h2>
          <div className="media-desc"><div className="media-mainText">{selected ? labels[selected][1] : '请选择您要查看的内容'}</div><div className="media-subText">LANDSCAPE ARCHIVE / YAN</div></div>
        </div></ContentTransition></div>
        <button type="button" className={`media-detailBtn ${selected ? 'media-visible' : 'media-hidden'}`} disabled={!selected} onClick={() => setView(selected)}><span><span className="media-mainText">查看详情</span><span className="media-subText">READ MORE</span></span><span className="media-icon"><Icon name="icon_arrow" /></span></button>
      </div>
    </div>
    <TopicView title="GALLERY" topics={cityTopics} visible={view === 'GALLERY'} active={active && view === 'GALLERY'} onReturn={() => setView(null)} />
    <TopicView title="MUSIC" topics={musicTopics} visible={view === 'VIDEO'} active={active && view === 'VIDEO'} onReturn={() => setView(null)} />
  </div>;
}
