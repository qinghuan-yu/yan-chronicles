# 大炎 · 山河风物志

沿着明日方舟官网的六屏布局与动画，续写最初的大炎主题课程作品。水墨山河、书法题字与粒子、坐标网格和科技界面相接。

```sh
npm install
npm run dev
```

本地预览：http://127.0.0.1:4175/

生产构建：`npm run build`；构建预览：`npm run preview`。

React 19 · Vite 6 · Three.js · Swiper。纯静态前端，内容、图片、字体和音乐均从本地文件读取。PRTS 与原作链接仅作为资料来源。

- `src/sections/`：序篇、风物、人物、舆图、视听、缘起。
- `src/data/`：五城文案、人物、主题内容及素材来源。
- `src/animations/`：粒子采样、聚散与鼠标交互。
- `src/components/`：导航、过渡、图库、原图浏览。
- `public/assets/`：场景、立绘、音乐与字体。

原作：[大炎初作](https://github.com/qinghuan-yu/yan-chronicles/tree/862ca1c4b31c483149c3bd9e80d288d42752e0d3)，作者黄芷馨、谭力玮。场景、人物资料补充自 [PRTS](https://prts.wiki/)，逐项来源见 `src/data/credits.json`。五城粒子纹样为本次绘制的风物意象，并非官方城市徽章。

本站为非官方爱好者主题作品；《明日方舟》美术及音乐的权利归原权利人所有。原作齐伋体用于题字，思源黑体用于正文；后者许可见字体目录的 OFL.txt。

`node_modules/`、`dist/` 与本地日志不属于源码交付内容。

本主线从最后仍展示大炎主界面的提交 [`8e5cae7d`](https://github.com/qinghuan-yu/yan-chronicles/commit/8e5cae7d0a3c7803797201ec3993a590cbdcf0ba) 续写。默认分支为 `codex/dayan`；个人主页完整保留在 [`codex/personal-homepage`](https://github.com/qinghuan-yu/yan-chronicles/tree/codex/personal-homepage)。旧 `main` 保留为既有部署的兼容引用。
