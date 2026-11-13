const picture = (file, label, position = '50% 50%') => ({ src: '/assets/scenes/' + file + (file.includes('.') ? '' : '.jpg'), label, position });
const wiki = title => 'https://prts.wiki/w/' + encodeURIComponent(title);
export const chapters = [
  {
    id: 'yan', name: '大炎', roman: 'YAN', number: '序', theme: '山河风物志', mode: 'emblem', color: '#d7c49a',
    verse: '天地、星月、风雨、时令、云烟。',
    introduction: '循五城风物，见山河人间。',
    images: [picture('mountains.png', '山岳云海', '48% 50%')],
    title: '山河之间，皆是人间',
    paragraphs: ['这部风物志从一份 Vue 课程作业重新出发。沿着炎国的灯火、水乡、群山、田畴与关城，读一段景，也读景中生活的人。', '画面来自《明日方舟》的世界，触动我们的，则是熟悉的山水意境与人间烟火。'],
    facts: ['五城风物', '山河画卷', '一曲赴大荒'],
    sources: [{ label: 'PRTS · 炎国地理', href: wiki('泰拉大典:地理/炎') }],
  },
  {
    id: 'baizao', name: '百灶', roman: 'BAIZAO', number: '一', theme: '长街与烟火', mode: 'embers', color: '#e5b780',
    verse: '天有烘炉，地生五金。', introduction: '一城灯火，照见寻常日子。',
    images: [picture('baizao-downtown.png', '百灶闹市'), picture('baizao-mainstreet.png', '百灶主街'), picture('baizao-dingfeng.png', '鼎丰楼'), picture('baizao-restaurant.png', '余味居'), picture('baizao-snow.png', '百灶的雪')],
    title: '都城深处，人间烟火',
    paragraphs: ['百灶是大炎都城。《相见欢》的故事从这里的街巷与酒楼展开，让宏大的城阙落回寻常人的饮食与团圆。', '老字号的招牌与新灶的火光交错，远来的客人在茶楼落座。循着鼎丰楼与余味居的灯火看去，城市的滋味也藏在一餐一饭之间。'],
    facts: ['大炎都城', '相见欢', '鼎丰楼'], sources: [{ label: 'PRTS · 相见欢', href: wiki('相见欢') }, { label: 'PRTS · 炎国地理', href: wiki('泰拉大典:地理/炎') }],
  },
  {
    id: 'gouwu', name: '勾吴', roman: 'GOUWU', number: '二', theme: '水乡与画境', mode: 'mist', color: '#d1ddd5',
    verse: '破墨浣山海，走笔尽波澜。', introduction: '白墙黛瓦之间，水与墨相逢。',
    images: [picture('gouwu-1', '水巷石桥', '58% 50%'), picture('gouwu-2', '墨色庭院'), picture('gouwu-3', '雨中长廊'), picture('gouwu-4', '月洞窗前'), picture('gouwu-5', '山水画境')],
    title: '一城水墨，几重画境',
    paragraphs: ['勾吴城位于灰齐山附近。故事《画中人》从这里的山水小镇展开，将日常的街巷与夕笔下的画境交织在一起。', '石桥与水巷、屋檐与远山，是这一卷留下的线索。画内与画外的界限，在水墨间渐渐模糊。'],
    facts: ['灰齐山', '画中人', '水墨画境'], sources: [{ label: 'PRTS · 画中人', href: wiki('画中人') }],
  },
  {
    id: 'dahuang', name: '大荒城', roman: 'DAHUANG', number: '三', theme: '田畴与新城', mode: 'grain', color: '#d7cf9c',
    verse: '禾下有梦，岁岁生生。', introduction: '从一粒种子，到一座新城。',
    images: [picture('dahuang-new.png', '新大荒'), picture('qingrang.png', '青穰'), picture('dahuang-fields.png', '禾下稻田', '42% 50%'), picture('dahuang-4', '引水入城')],
    title: '土地托起的城市',
    paragraphs: ['大荒城是炎国北部的农业基地，也与古老的垦荒历史相连。《怀黍离》将目光落在土地、作物与耕耘者身上。', '十二楼五城的建设，让农田与移动城市的新貌在这里相遇。宏大的工程终究要回到每一株庄稼，以及人们下一年的生活。'],
    facts: ['农业基地', '怀黍离', '十二楼五城'], sources: [{ label: 'PRTS · 怀黍离', href: wiki('怀黍离') }, { label: 'PRTS · 炎国地理', href: wiki('泰拉大典:地理/炎') }],
  },
  {
    id: 'shangshu', name: '尚蜀', roman: 'SHANGSHU', number: '四', theme: '群山与行舟', mode: 'mist', color: '#bfcfd8',
    verse: '云峦波涛，江山故人。', introduction: '山路曲折处，仍有人间来往。',
    images: [picture('shangshu-view.png', '尚蜀风高'), picture('shangshu-1', '山巅古亭', '65% 50%')],
    title: '城在山中，人在江湖',
    paragraphs: ['尚蜀位于炎国腹地，城与群山相依。《将进酒》的故事发生在这里，江湖行旅与市井生活在山城中交汇。', '山峰、楼台与水道共同构成城市的轮廓。登高望去，远山层叠；回到街巷，客栈与渡口又连接起一个个寻常故事。'],
    facts: ['炎国腹地', '将进酒', '群山环绕'], sources: [{ label: 'PRTS · 将进酒', href: wiki('将进酒') }, { label: 'PRTS · 炎国地理', href: wiki('泰拉大典:地理/炎') }],
  },
  {
    id: 'yumen', name: '玉门', roman: 'YUMEN', number: '五', theme: '风沙与关城', mode: 'wind', color: '#ddc29b',
    verse: '玉门城高，我辈共登临。', introduction: '关城向着风沙，也护着身后灯火。',
    images: [picture('yumen-distant.png', '玉门远眺'), picture('yumen-2', '塞外石壁'), picture('yumen-1', '风沙大漠')],
    title: '登临处，天地壮行色',
    paragraphs: ['玉门是炎国的边塞城市。沙渠、屏风卫与天灾工事共同守护这座移动关城，也构成了《登临意》的故事背景。', '驻军与钦天监维护着城市的运转。城内尚武的风气、擂台上的往来，与城外漫长的风沙一道，留下玉门独有的性格。'],
    facts: ['边塞关城', '登临意', '沙渠与屏风卫'], sources: [{ label: 'PRTS · 登临意', href: wiki('登临意') }, { label: 'PRTS · 炎国地理', href: wiki('泰拉大典:地理/炎') }],
  },
];
export const origin = {
  title: '从那一个深夜，走到这里',
  paragraphs: ['最初，这是一份基于 Vue 3 的 Web 开发期末作业。黄芷馨、谭力玮选择了《明日方舟》里的大炎，希望借游戏中的城市与山河，呈现熟悉的中华风物。', '两个星期的学习，一周的通宵。跨年的零点还在调试文字，凌晨五点仍在面对报错。这些细节，都被留在了当年的《先读我》里。', '旧作的风景、题字与《赴大荒》在这里继续。读城、览景、走过五卷，完成当初想呈现的一段山河。'],
  quote: '在无数的未知前不甘平庸，就是完成这个作业核心的动力。',
  repository: 'https://github.com/qinghuan-yu/yan-chronicles/tree/862ca1c4b31c483149c3bd9e80d288d42752e0d3',
};
