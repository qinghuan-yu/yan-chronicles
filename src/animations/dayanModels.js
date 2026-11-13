const root = '/assets/dayan/symbols/';
const definitions = {
  yan: { src: 'yan.png', size: 512, extent: 400, step: 4, tint: [0.94, 0.89, 0.77] },
  baizao: { src: 'baizao.svg', tint: [0.94, 0.78, 0.54] },
  gouwu: { src: 'gouwu.svg', tint: [0.91, 0.91, 0.83] },
  dahuang: { src: 'dahuang.svg', tint: [0.94, 0.83, 0.59] },
  shangshu: { src: 'shangshu.svg', tint: [0.91, 0.88, 0.79] },
  yumen: { src: 'yumen.svg', tint: [0.93, 0.79, 0.58] },
};
const cache = new Map();
const keyFor = name => Object.hasOwn(definitions, name) ? name : 'yan';

// 与原官网模型接口完全一致；图案只提供目标点，聚散与透视仍由 ParticleScene 驱动。
export function loadDayanModel(name = 'yan') {
  const key = keyFor(name);
  if (!cache.has(key)) {
    const promise = (async () => {
      const definition = definitions[key];
      const image = new Image();
      image.src = root + definition.src;
      await image.decode();
      const size = definition.size || 800;
      const extent = definition.extent || 500;
      const step = definition.step || 5;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas 2D context unavailable');
      const scale = extent / Math.max(image.naturalWidth, image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      const pixels = context.getImageData(0, 0, size, size).data;
      const points = [];
      let seed = [...key].reduce((sum, letter) => sum + letter.charCodeAt(0), 173);
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        return (seed >>> 0) / 4294967296;
      };
      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const px = Math.min(size - 1, x + Math.floor(random() * step));
          const py = Math.min(size - 1, y + Math.floor(random() * step));
          const offset = (py * size + px) * 4;
          // 龙纹原图有不透明黑底，需同时看亮度与透明度，避免采成一整块方形。
          const luminance = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
          const alpha = pixels[offset + 3] * luminance / 255;
          if (alpha > 36) points.push([px, py, Math.round(alpha)]);
        }
      }
      return { size: { width: size, height: size }, points };
    })();
    cache.set(key, promise);
    promise.catch(() => { if (cache.get(key) === promise) cache.delete(key); });
  }
  return cache.get(key);
}

// shuffledModel 的每个点为 x/y/z/r/g/b/a；仅调整 RGB，不触碰位置、透明度或运动参数。
export function tintDayanTargets(targets, name = 'yan') {
  const tint = definitions[keyFor(name)].tint;
  for (let index = 0; index < targets.length; index += 7) {
    targets[index + 3] = tint[0];
    targets[index + 4] = tint[1];
    targets[index + 5] = tint[2];
  }
  return targets;
}
