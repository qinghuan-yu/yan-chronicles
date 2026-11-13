import { useId } from 'react';
const boxes = {
  title_arknights: '0 0 254 119', logo_rhodes_island: '0 0 459.1 374.4',
  copyright_mini: '0 0 166 18', icon_sound: '0 0 30 34', icon_voice: '0 0 44 44',
  icon_arrow: '0 0 7 15', icon_dblArrow: '0 0 13 11',
  icon_arrow_hrz: '0 0 40 7.5', icon_play_btn: '0 0 34.1 32.1', icon_mini_play_btn: '0 0 44 42',
  elite_phase_0: '0 0 128 78', elite_phase_1: '0 0 127.7 77.9', elite_phase_2: '0 0 127.7 103.7',
};

export function Icon({ name, className = '', reverse = false, rotation = 0 }) {
  const maskId = useId();
  if (name === 'logo_rhodes_island') return <svg aria-hidden="true" className={className} viewBox="0 0 300 300"><defs><mask id={maskId}><image href="/assets/emblem.png" width="300" height="300" /></mask></defs><rect width="300" height="300" fill="currentColor" mask={'url(#' + maskId + ')'} /></svg>;
  if (name === 'title_arknights') return <svg aria-hidden="true" className={className} viewBox="0 0 254 119"><text x="127" y="72" textAnchor="middle" textLength="180" lengthAdjust="spacingAndGlyphs" fontSize="72" className="dayan-brandText">大炎</text><path d="M2 84H252V86H2Z" /><text x="127" y="107" textAnchor="middle" fontSize="13" className="dayan-brandSub">TERRA / YAN</text></svg>;
  if (name === 'copyright_mini') return <svg aria-hidden="true" className={className} viewBox="0 0 166 18"><text x="0" y="13" fontSize="12" className="dayan-brandSub">YAN / LANDSCAPE</text></svg>;
  return <svg aria-hidden="true" className={className} viewBox={boxes[name]} style={reverse || rotation ? { transform: `rotate(${reverse ? 180 : rotation}deg)` } : undefined}>
    <use href={`/assets/images/icons.svg#svg_def-${name}`} />
  </svg>;
}
