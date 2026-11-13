import { chapters, origin } from './chapters';
export const cities = chapters.slice(1);
const link = (primaryText, subText, href) => ({ primaryText, subText, href, themeColor: '#c7a66b' });
const topic = (id, title, subtitle, description, image, extra = {}) => ({
  cid: id, content: { title, subtitle, description, cover: { url: image }, coverPortrait: { url: image }, buttons: [], ...extra },
});
export const cityTopics = cities.map(city => topic(city.id, city.name, city.roman + '\n' + city.theme, city.paragraphs.join('\n\n'), city.images[0].src, {
  images: city.images, buttons: city.sources.map(source => link(source.label, 'SOURCE / PRTS', source.href)),
}));
export const world = cities.map(city => ({
  id: city.id, name: city.name, nameEn: city.roman, image: '/assets/dayan/symbols/' + city.id + '.svg',
  intro: city.paragraphs[0], source: { title: '阅读 ' + city.facts[1] + ' · PRTS', url: city.sources[0].href },
}));
export const banners = cities.map(city => ({
  id: city.id, title: city.name + ' · ' + city.theme, label: 'YAN / ' + city.roman,
  desc: city.introduction, image: city.images[0].src,
}));
export const infoLabels = { OVERVIEW: '见闻', CITY: '城郭', SCENERY: '风物', STORY: '纪事' };
export const information = {
  OVERVIEW: cities.map(city => ({ tag: city.name.slice(0, 2), label: city.roman, title: city.title, city: city.id })),
  CITY: cities.map(city => ({ tag: '地理', label: city.roman, title: city.name + ' · ' + city.facts[0], city: city.id })),
  SCENERY: cities.map(city => ({ tag: '风物', label: city.roman, title: city.theme + ' / ' + city.images.length + ' 幅画卷', city: city.id })),
  STORY: cities.map(city => ({ tag: '故事', label: city.roman, title: '《' + city.facts[1] + '》 · ' + city.name, city: city.id })),
};
export const musicTopics = [
  topic('fu-da-huang', '赴大荒', 'MUSIC / YAN\n循声入画', '让当年的那一曲，继续陪我们走过山河。\n《赴大荒》沿用自最初的课程作品，点击播放后，可在这里静听，也可用顶部的音乐按钮让它伴随翻页。', '/assets/scenes/dahuang-fields.png', { audio: true }),
];
export const originTopics = [
  topic('beginning', '从一个未完成的愿望开始', 'THE BEGINNING\n大炎 · 初作', origin.paragraphs[0] + '\n\n' + origin.paragraphs[1], '/assets/scenes/gouwu-1.jpg', { buttons: [link('打开最初的提交', 'ORIGINAL / VUE 3', origin.repository)] }),
  topic('continue', '山河，终于续上这一卷', 'TO BE CONTINUED\n循着当年的方向', '“' + origin.quote + '”\n\n以明日方舟官网的基础设计，续写一个大炎主题网站。保留当年的山河、题字与音乐，也让最初想象过的动效与交互在这里落地。', '/assets/scenes/mountains.png', { buttons: [link('最初的作品仓库', 'VUE-PERSONAL-INTRO', 'https://github.com/qinghuan-yu/yan-chronicles/tree/862ca1c4b31c483149c3bd9e80d288d42752e0d3')] }),
];
export const sourceTopics = [
  topic('lore', '城与故事的出处', 'REFERENCE / PRTS\n设定与资料', '五城的地理与故事线索参照 PRTS：百灶《相见欢》、勾吴《画中人》、大荒城《怀黍离》、尚蜀《将进酒》、玉门《登临意》。画卷中的抒情文字为本站编写，具体设定以来源为准。', '/assets/scenes/baizao-mainstreet.png', { buttons: [link('炎国地理', 'TERRA / YAN', 'https://prts.wiki/w/泰拉大典:地理/炎')] }),
  topic('art', '画面与声音', 'ARTWORK / MUSIC\n素材鸣谢', '本网站为非官方爱好者主题作品。《明日方舟》角色、场景与音乐的权利归原权利人所有。\n\n场景来自原课程作品与 PRTS 公开资料；《赴大荒》、龙纹与齐伋体题字延续自原作。原课程作品作者：黄芷馨、谭力玮。各素材对应来源保存在源码 credits.json 中。', '/assets/scenes/yumen-distant.png', { buttons: [link('PRTS Wiki', 'ARKNIGHTS WIKI', 'https://prts.wiki/'), link('原作仓库', 'ORIGINAL WORK', 'https://github.com/qinghuan-yu/yan-chronicles/tree/862ca1c4b31c483149c3bd9e80d288d42752e0d3')] }),
];
