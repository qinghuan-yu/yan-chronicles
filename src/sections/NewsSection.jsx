import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import { banners, information, infoLabels } from '../data/dayan';
import { cityTopics } from '../data/dayan';
import { TopicView } from '../components/TopicView';
import { Icon } from '../components/Icon';
import { ContentTransition } from '../components/ContentTransition';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function NewsSection({ active }) {
  const [view, setView] = useState(null);
  const [category, setCategory] = useState('OVERVIEW');
  const portrait = useMediaQuery('(orientation: portrait)');
  const [slide, setSlide] = useState(0);
  const swiper = useRef(null);
  const banner = banners[slide];
  useEffect(() => { (active && !view) ? swiper.current?.autoplay.start() : swiper.current?.autoplay.stop(); }, [active, view]);
  return <><div inert={!!view} className={`information-container ${active ? 'information-active' : ''}`}>
    <div className="information-bottomShadow" />
    <div className="information-bannerContainer" data-scrollable>
      <Swiper className="information-swiper" modules={[Autoplay, Scrollbar]} autoplay={active ? { delay: 5000 } : false} grabCursor
        scrollbar={{ el: '.information-bannerScrollBar', draggable: true }} onSwiper={instance => { swiper.current = instance; }} onSlideChange={instance => setSlide(instance.activeIndex)}>
        {banners.map(item => <SwiperSlide key={item.id}><div className="information-imgWrapper"><img className="information-img" src={item.image} alt={item.title} /></div></SwiperSlide>)}
      </Swiper>
    </div>
    <div className="information-bannerScrollBarContainer"><div className="information-bannerScrollBar" /></div>
    <div className="information-globalMask1" /><div className="information-globalMask2" />
    <div className="information-main"><div className="information-bgBlock" /><div className="information-mainMask" />
      <div className="information-articlesContainer"><div className="information-floatingText"><span className="information-text">YAN CHRONICLES</span></div>
        <div className="information-currentBannerInfo"><ContentTransition state={banner.id} direction="horizontal"><div>
          {!portrait && <div className="information-date">{banner.label}</div>}<h2 className="information-title">{banner.title}</h2>
          {portrait && <div className="information-date">{banner.label}</div>}<div className="information-subtitle">{banner.desc}</div><div className="information-comment">LANDSCAPE ARCHIVE / YAN</div>
        </div></ContentTransition></div>
        <div className="information-tabList" role="tablist" aria-label="风物分类">
          {Object.entries(infoLabels).map(([key, label]) => <button type="button" key={key} role="tab" aria-selected={category === key}
            className={`information-tabItem ${category === key ? 'information-active' : ''}`} onClick={() => setCategory(key)}>
            <span>{label}</span><span className="information-icon"><Icon name="icon_arrow" /></span>
          </button>)}
        </div>
        <ContentTransition state={category} direction="horizontal"><div className="information-newsList" role="tabpanel">
          {information[category].map((item, i) => <button type="button" className="information-newsItem" key={i} onClick={() => setView(item.city)}>
            <span className="information-cate">{item.tag}</span>
            <div className="information-newsInfo"><span className="information-date">{item.label}</span><h3 className="information-newsTitle">{item.title}</h3></div>
          </button>)}
        </div></ContentTransition>
      </div>
    </div>
  </div>{view && <TopicView title="YAN CHRONICLES" topics={cityTopics.filter(topic => topic.cid === view)} visible active={active} onReturn={() => setView(null)} />}</>;
}
