<template>
  <div class="contact-page">

    <!-- UI Container -->
    <div class="ui-container">

      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>CONTACT</h1>
          <div class="sub-header">// NETWORK INTERFACE</div>
        </div>

        <transition-group tag="div" name="staggered-list" class="archive-list" appear>
          <button v-for="(item, index) in channels" :key="item.key"
            :class="['ak-list-item', { active: activeKey === item.key }]" @click="handleSelect(item.key)"
            :style="{ '--i': index }">
            <div class="item-content-row">
              <span class="item-title-cn">{{ item.label }}</span>
            </div>
            <div class="item-separator"></div>
          </button>
        </transition-group>

        
      </div>

      <!-- Right/Center: Visual Presentation Layer -->
      <div class="visual-stage">
        <!-- 
            KEY FIX: aspect-ratio wrapper 
            We force this wrapper to be 16:9 (or whatever your image is).
            This ensures top: 50% is ALWAYS 50% of the image, not the empty space.
          -->
        <div class="scene-wrapper">
          <!-- base-layer -->
          <img src="./backscene.png" alt="Scene Base" class="scene-base" />

          <!-- highlight-layer -->
          <transition name="fade">
            <img v-if="activeItem && activeItem.img" :key="activeItem.key" :src="activeItem.img" :alt="activeItem.label"
              class="scene-overlay" crossorigin="anonymous" @load="calculateBoundingBox" />
          </transition>

          <!-- Focus Frame -->
          <transition name="zoom">
            <!-- Only show if dynamicPos is calculated -->
            <div v-if="dynamicPos" class="focus-frame" :style="{
              top: dynamicPos.top,
              left: dynamicPos.left,
              width: dynamicPos.width,
              height: dynamicPos.height
            }" @click="openLink(activeItem.link)">
              <!-- Info Panel attached to the frame -->
              <transition name="slide-right">
                <div class="info-panel-attached">
                  <h1>{{ activeItem.label }}</h1>
                  <p>{{ activeItem.desc }}</p>
                  <div class="action-btn" @click.stop="openLink(activeItem.link)" v-if="activeItem.link">
                    ACCESS NET >
                  </div>
                </div>
              </transition>
            </div>
          </transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const getAssetUrl = (name) => {
  return new URL(`./${name}`, import.meta.url).href;
};

// Restored overlay images as requested
// Removed hardcoded 'pos' - now using automatic bounding box detection
const channels = [
  {
    key: 'github',
    label: 'GITHUB',
    desc: '浏览项目列表以及源代码',
    img: getAssetUrl('githubicon.png'),
    link: 'https://github.com/qinghuan-yu'
  },
  {
    key: 'social',
    label: 'WECHAT & QQ',
    desc: '通过二维码添加好友',
    img: getAssetUrl('desktop.png'),
    link: null
  },
  {
    key: 'steam',
    label: 'STEAM',
    desc: 'steam个人资料链接',
    img: getAssetUrl('game.png'),
    link: 'https://steamcommunity.com/id/qing_uu/'
  },
  {
    key: 'music',
    label: 'NETEASE MUSIC',
    desc: '网易云音乐歌手主页',
    img: getAssetUrl('vinyl.png'),
    link: 'https://music.163.com/#/artist?id=100570638'
  },
  {
    key: 'mail',
    label: 'MAIL',
    desc: 'reliarc.yu@gmail.com',
    img: getAssetUrl('letter.png'),
    link: 'mailto:reliarc.yu@gmail.com'
  }
];

const activeKey = ref(null);
const activeItem = computed(() => channels.find(c => c.key === activeKey.value));

// Dynamic bounding box position
const dynamicPos = ref(null);

watch(activeKey, () => {
  // Reset pos immediately when switching, waiting for new image load to recalc
  dynamicPos.value = null;
});

/**
 * Calculates the bounding box of the non-transparent pixels in the image.
 * Ignores faint glow/bloom by using an alpha threshold.
 */
const calculateBoundingBox = (event) => {
  const imgElement = event.target;
  // Ensure image is loaded and has dimensions
  if (!imgElement || !imgElement.naturalWidth) return;

  // Create offscreen canvas for pixel analysis
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const width = imgElement.naturalWidth;
  const height = imgElement.naturalHeight;
  canvas.width = width;
  canvas.height = height;

  // Draw image to canvas
  ctx.drawImage(imgElement, 0, 0);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  // Alpha Threshold: Ignore pixels with alpha less than this value (0-255)
  // 30 is a good balance to cut off weak Bloom effects
  const alphaThreshold = 30;

  // Scan pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // data layout: R, G, B, A, R, G, B, A...
      const alphaIndex = (y * width + x) * 4 + 3;
      const alpha = data[alphaIndex];

      if (alpha > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return;

  // Add some padding (e.g., 1.5% of dimension) so the box isn't too tight
  const paddingX = width * 0.015;
  const paddingY = height * 0.015;

  minX = Math.max(0, minX - paddingX);
  minY = Math.max(0, minY - paddingY);
  maxX = Math.min(width, maxX + paddingX);
  maxY = Math.min(height, maxY + paddingY);

  // Convert to percentages for CSS positioning
  dynamicPos.value = {
    left: ((minX / width) * 100).toFixed(2) + '%',
    top: ((minY / height) * 100).toFixed(2) + '%',
    width: (((maxX - minX) / width) * 100).toFixed(2) + '%',
    height: (((maxY - minY) / height) * 100).toFixed(2) + '%'
  };
};

const handleSelect = (key) => {
  if (activeKey.value === key) {
    activeKey.value = null;
  } else {
    activeKey.value = key;
  }
};

const openLink = (url) => {
  if (url) {
    if (url.startsWith('mailto')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>
.contact-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  /* Transparent logic confirmed */
  background-color: transparent;
  font-family: 'Space Grotesk', 'Arial', sans-serif;
  color: white;
  overflow: hidden;
}

.ui-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 48px;
  /* Add padding matching Music page */
  padding: 24px;
}

@media (min-width: 1024px) {
  .ui-container {
    flex-direction: row;
    align-items: stretch;
    padding: 96px;
    /* Match Music page desktop padding */
  }
}

/* Sidebar */
.sidebar {
  /* Match Music page .music-left positioning */
  width: 100%;
  height: auto;
  background: transparent;
  backdrop-filter: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-right: none;
  z-index: 100;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .sidebar {
    width: 30%;
    justify-content: flex-start;
    padding-top: 48px;
    /* Match Music page padding-top */
    height: 100%;
  }
}

.sidebar-header {
  margin-bottom: 3rem;
}

.sidebar-header h1 {
  font-size: 48px;
  color: #22d3ee;
  margin: 0;
  letter-spacing: -0.05em;
  font-weight: 500;
}

.sub-header {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 48px;
}

/* Archive List Style (Arknights) */
.archive-list {
  display: flex;
  flex-direction: column;
  background: transparent;
  gap: 24px;
}

/* ================= Side Panel Staggered Entry Animation Engine ================= */
/* Fix: Increase specificity with .archive-list prefix to ensure animation parameters override base styles */
.archive-list .staggered-list-enter-active,
.archive-list .staggered-list-leave-active {
  transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1) !important;
  transition-delay: calc(var(--i) * 0.15s) !important;
}

/* Initial State: Transparent and offset top by 40px (Top to Bottom slide) */
.archive-list .staggered-list-enter-from,
.archive-list .staggered-list-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

/* ================= Sidebar Interaction Style Deep Alignment ================= */

.ak-list-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  position: relative;
  opacity: 0.5;
  /* Default dim */
  /* Hover physical feedback - Fixed: Explicit properties to avoid transition-delay conflict */
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    text-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Hover/Active: Highlight and push right */
.ak-list-item:hover,
.ak-list-item.active {
  opacity: 1;
  background: transparent;
  transform: translateX(12px);
  /* Push right interaction feedback */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.item-content-row {
  display: flex;
  align-items: baseline;
  padding-bottom: 8px;
  gap: 12px;
}

.item-title-cn {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s;
}

.ak-list-item:hover .item-title-cn,
.ak-list-item.active .item-title-cn {
  color: #fff;
  font-weight: 700;
}

.item-separator {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: left center;
  margin-top: 4px;
}

.ak-list-item:hover .item-separator {
  background: rgba(255, 255, 255, 0.8);
}

.ak-list-item.active .item-separator {
  background: #22d3ee;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
  transform: scaleY(2);
}

/* Visual Stage */
.visual-stage {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 
   KEY FIX: Aspect Ratio Lock 
   This ensures the div size matches the image render size exactly.
   Updated: Scaled down to ~90% (max-height 81vh, max-width 144vh)
*/
.scene-wrapper {
  position: relative;
  width: 100%;
  max-width: 144vh;
  /* 160vh * 0.9 */

  /* Force 16:9 Aspect Ratio */
  aspect-ratio: 16 / 9;

  /* Scale down if it hits screen edges */
  height: auto;
  max-height: 81vh;
  /* 90vh * 0.9 */

  /* Fallback for safety */
  display: flex;
  justify-content: center;
  align-items: center;
}

.scene-base,
.scene-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Since we locked aspect ratio, cover/contain are effectively same */
  pointer-events: none;
}

.scene-base {
  opacity: 0;
  /* Force initial state to 0 */
  animation: baseFadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
}

@keyframes baseFadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.8;
  }
}

.scene-overlay {
  z-index: 10;
}

/* Focus Frame (Updated Style: Glowing Box) */
.focus-frame {
  position: absolute;
  /* Thick white border */
  border: 3px solid rgba(255, 255, 255, 0.9);
  /* Strong white glow */
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3);
  z-index: 50;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.focus-frame:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.4);
  border-color: #ffffff;
}

/* Removed corners and scan-effect per request */

/* Info Panel - Attached to Focus Frame */
.info-panel-attached {
  position: absolute;
  top: 50%;
  left: 105%;
  /* Push to the right of the frame */
  transform: translateY(-50%);
  width: 300px;
  text-align: left;
  /* Alignment changed to left */
  z-index: 60;
  pointer-events: none;
  /* Allow clicks to pass through except for button */
  /* Ensure it doesn't get cut off on small screens? */
}

/* Ensure text is clearly visible against potential background */
.info-panel-attached h1 {
  font-size: 48px;
  margin: 0;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 0 20px black;
}

.info-panel-attached p {
  border-left: 3px solid #22d3ee;
  /* Changed to left border */
  padding-left: 15px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
  /* Gradient direction flip */
  padding: 10px;
  margin-top: 10px;
  color: #ddd;
  font-size: 14px;
}

.action-btn {
  pointer-events: auto;
  display: inline-block;
  margin-top: 15px;
  padding: 8px 20px;
  background: #000;
  border: 1px solid #22d3ee;
  color: #22d3ee;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 12px;
}

.action-btn:hover {
  background: #22d3ee;
  color: black;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.4s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 768px) {
  .ui-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    padding: 1rem;
    flex-direction: row;
    background: rgba(10, 10, 10, 0.9);
  }

  .sidebar-header {
    margin: 0;
    font-size: 16px;
  }

  .scene-wrapper {
    width: 100%;
    aspect-ratio: 16/9;
    max-height: none;
  }

  /* Mobile adjustment for info panel? */
  .info-panel-attached {
    position: fixed;
    left: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    height: auto;
    transform: none;
    padding: 20px;
    background: rgba(0, 0, 0, 0.8);
    text-align: left;
  }
}

/* ================= 背景底层淡入引擎 ================= */
/* Removed Vue transition engine in favor of native CSS keyframes on .scene-base for reliability with static image loads */
</style>
