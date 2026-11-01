// Same card as ToolCard.astro, for lists built in the browser (search, favorites).
import { hueForLabel } from '../data/categoryStyle';

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export interface CardItem {
  url: string;
  name: string;
  desc: string;
  /** Category label, e.g. "Image Tools"; picks the colour and shows in the footer */
  cat: string;
  /** Inline SVG markup for the icon (trusted, from iconSvgs.ts) */
  iconSvg?: string;
  extraClass?: string;
}

/** Posts and guides say Read, tools say Open */
const ctaFor = (url: string) => (/^\/(blog|guides|comparisons)\//.test(url) ? 'Read' : 'Open');

export function toolCardHtml(item: CardItem): string {
  const label = esc(String(item.cat || '').replace(/ Tools$/, ''));
  return `<a href="${esc(item.url)}" class="nx-card ${esc(item.extraClass || '')}" style="--cat: ${hueForLabel(item.cat)}">
  <span class="nx-card-top"><span class="nx-card-icon" aria-hidden="true">${item.iconSvg || ''}</span></span>
  <h3 class="nx-card-title">${esc(item.name)}</h3>
  <span class="nx-card-desc">${esc(item.desc)}</span>
  <span class="nx-card-foot"><span class="nx-card-cat">${label}</span><span class="nx-card-go">${ctaFor(item.url)} <span aria-hidden="true">→</span></span></span>
</a>`;
}
