/**
 * Syntax colours for code boxes, with no library.
 *
 * - `highlight(code, lang)` returns escaped HTML with `tok-*` spans (colours live in global.css).
 * - `attachCodeHighlight(textarea, lang)` lays a coloured copy of the text over a textarea.
 *   The textarea keeps working as before (typing, caret, selection, copy, scripts reading
 *   `.value`); only its own text turns transparent.
 * - `initCodeHighlight()` attaches to every `textarea[data-code-lang]` on the page.
 */

type State = Record<string, any>;
type Cls = string | null | ((m: string, code: string, end: number, s: State) => string | null);
interface Rule {
  re: RegExp; // must use the sticky flag
  cls?: Cls;
  html?: (m: RegExpExecArray, s: State) => string;
  test?: (s: State) => boolean;
  then?: (s: State, m: RegExpExecArray) => void;
}

export function escapeCode(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const span = (cls: string, text: string) => `<span class="tok-${cls}">${escapeCode(text)}</span>`;

function run(code: string, rules: Rule[], state: State = {}): string {
  let out = '';
  let plain = '';
  let i = 0;
  let guard = 0;
  const flush = () => {
    if (plain) out += escapeCode(plain);
    plain = '';
  };
  outer: while (i < code.length) {
    for (const r of rules) {
      if (r.test && !r.test(state)) continue;
      r.re.lastIndex = i;
      const m = r.re.exec(code);
      if (!m) continue;
      if (!m[0].length) {
        // A zero-length match may only switch state (e.g. leave an empty <style> block)
        if (r.then && guard++ < 4) {
          r.then(state, m);
          continue outer;
        }
        continue;
      }
      guard = 0;
      flush();
      const end = i + m[0].length;
      if (r.html) out += r.html(m, state);
      else {
        const cls = typeof r.cls === 'function' ? r.cls(m[0], code, end, state) : r.cls;
        out += cls ? span(cls, m[0]) : escapeCode(m[0]);
      }
      r.then?.(state, m);
      i = end;
      continue outer;
    }
    guard = 0;
    plain += code[i++];
  }
  flush();
  return out;
}

const words = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const nextNonSpace = (code: string, from: number) => {
  const m = /\S/.exec(code.slice(from, from + 40));
  return m ? m[0] : '';
};

// ─── SQL ─────────────────────────────────────────────────────────────────────

const SQL_KW = words(`select from where and or not in is like ilike between exists case when then else end as on
  join left right inner outer full cross natural using group by order having limit offset fetch first next rows
  only top distinct all union intersect except insert into values update set delete create alter drop table view
  index unique primary key foreign references constraint default check database schema if replace truncate begin
  commit rollback transaction with recursive asc desc returning over partition window collate grant revoke
  procedure function trigger declare return returns exec execute go use show describe explain lateral similar any
  some add column rename to cascade restrict nulls`);
const SQL_TYPES = words(`int integer bigint smallint tinyint decimal numeric float real double precision varchar char
  nvarchar text boolean bool date time timestamp timestamptz datetime interval json jsonb uuid serial bigserial blob`);
const SQL_CONST = words('true false null');

const sqlRules: Rule[] = [
  { re: /\s+/y },
  { re: /--[^\n]*|#[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, cls: 'com' },
  { re: /'(?:[^'\\]|\\.|'')*'?/y, cls: 'str' },
  { re: /"(?:[^"\\]|\\.)*"?|`[^`]*`?|\[[^\]\n]*\]/y, cls: 'prop' },
  { re: /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/iy, cls: 'num' },
  { re: /[@:$]\w+|\?/y, cls: 'var' },
  {
    re: /[A-Za-z_][\w$]*/y,
    cls: (m, code, end) => {
      const w = m.toLowerCase();
      if (SQL_CONST.has(w)) return 'const';
      if (SQL_KW.has(w)) return 'kw';
      if (SQL_TYPES.has(w)) return 'type';
      return nextNonSpace(code, end) === '(' ? 'fn' : null;
    },
  },
  { re: /[=<>!]+|[+\-*/%|&^~]/y, cls: 'op' },
  { re: /[(),;.]/y, cls: 'punct' },
];

// ─── JSON ────────────────────────────────────────────────────────────────────

const jsonRules: Rule[] = [
  { re: /\s+/y },
  { re: /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, cls: 'prop' },
  { re: /"(?:[^"\\\n]|\\.)*"?/y, cls: 'str' },
  { re: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y, cls: 'num' },
  { re: /\b(?:true|false|null)\b/y, cls: 'const' },
  { re: /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, cls: 'com' },
  { re: /[{}[\],:]/y, cls: 'punct' },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const cssCommon: Rule[] = [
  { re: /\s+/y },
  { re: /\/\*[\s\S]*?(?:\*\/|$)/y, cls: 'com' },
  { re: /"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/y, cls: 'str' },
];
const inValue = (s: State) => !!s.value;
const notValue = (s: State) => !s.value;
const cssRules: Rule[] = [
  ...cssCommon,
  // Inside a declaration value: "color: #fff !important;"
  { re: /!important\b/y, cls: 'kw', test: inValue },
  { re: /#[0-9a-fA-F]{3,8}\b/y, cls: 'num', test: inValue },
  { re: /-?(?:\d+\.?\d*|\.\d+)(?:%|[a-zA-Z]+)?/y, cls: 'num', test: inValue },
  { re: /--[\w-]+/y, cls: 'prop' },
  { re: /[\w-]+(?=\()/y, cls: 'fn', test: inValue },
  { re: /[\w-]+/y, cls: 'const', test: inValue },
  { re: /;/y, cls: 'punct', then: (s) => (s.value = false) },
  {
    re: /\}/y,
    cls: 'punct',
    then: (s) => {
      s.value = false;
      s.depth = Math.max(0, (s.depth || 0) - 1);
    },
  },
  { re: /[(),/*+]/y, cls: 'punct', test: inValue },
  // Selectors, at-rules and property names
  { re: /@[\w-]+/y, cls: 'kw', test: notValue },
  { re: /-?-?[\w-]+(?=\s*:(?![^{};]*\{))/y, cls: 'prop', test: notValue, then: (s) => (s.prop = true) },
  {
    re: /:/y,
    cls: 'punct',
    test: (s) => !s.value && s.prop,
    then: (s) => {
      s.value = true;
      s.prop = false;
    },
  },
  { re: /::?[\w-]+(?:\([^)]*\))?/y, cls: 'kw', test: notValue },
  { re: /[.#][\w-]+/y, cls: 'fn', test: notValue },
  { re: /\[[^\]\n]*\]?/y, cls: 'attr', test: notValue },
  { re: /\{/y, cls: 'punct', then: (s) => (s.depth = (s.depth || 0) + 1) },
  { re: /[a-zA-Z][\w-]*/y, cls: 'tag', test: notValue },
  { re: /[>+~,*()]/y, cls: 'punct' },
];

// ─── JavaScript / TypeScript ────────────────────────────────────────────────

const JS_KW = words(`break case catch class const continue debugger default delete do else export extends finally for
  function if import in instanceof let new of return static super switch throw try typeof var void while with yield
  async await from as get set interface type enum implements private public protected readonly declare namespace
  abstract keyof infer is satisfies`);
const JS_CONST = words('true false null undefined NaN Infinity this');
const JS_TYPES = words('string number boolean any unknown never object symbol bigint');

const jsRules: Rule[] = [
  { re: /\s+/y },
  { re: /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, cls: 'com' },
  { re: /`(?:[^`\\]|\\.)*`?|"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/y, cls: 'str' },
  { re: /\b(?:0[xX][\da-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b/y, cls: 'num' },
  { re: /@[\w$]+/y, cls: 'fn' },
  {
    re: /[A-Za-z_$][\w$]*/y,
    cls: (m, code, end, s) => {
      const afterDot = s.dot;
      s.dot = false;
      if (!afterDot) {
        if (JS_CONST.has(m)) return 'const';
        if (JS_KW.has(m)) return 'kw';
        if (JS_TYPES.has(m)) return 'type';
      }
      if (nextNonSpace(code, end) === '(') return 'fn';
      if (afterDot) return 'prop';
      return /^[A-Z]/.test(m) ? 'type' : null;
    },
  },
  { re: /\?\.|\./y, cls: 'punct', then: (s) => (s.dot = true) },
  { re: /=>|[=!<>]=?=?|&&|\|\||\?\?|[+\-*/%&|^~?:]/y, cls: 'op' },
  { re: /[{}()[\];,]/y, cls: 'punct' },
];

// ─── Python ──────────────────────────────────────────────────────────────────

const PY_KW = words(`and as assert async await break class continue def del elif else except finally for from global
  if import in is lambda nonlocal not or pass raise return try while with yield match case`);
const PY_CONST = words('True False None self cls');

const pyRules: Rule[] = [
  { re: /\s+/y },
  { re: /#[^\n]*/y, cls: 'com' },
  { re: /[rbfuRBFU]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$))/y, cls: 'str' },
  { re: /[rbfuRBFU]{0,2}(?:"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)/y, cls: 'str' },
  { re: /\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b/y, cls: 'num' },
  { re: /@[\w.]+/y, cls: 'fn' },
  {
    re: /[A-Za-z_]\w*/y,
    cls: (m, code, end) => {
      if (PY_CONST.has(m)) return 'const';
      if (PY_KW.has(m)) return 'kw';
      if (nextNonSpace(code, end) === '(') return 'fn';
      return /^[A-Z]/.test(m) ? 'type' : null;
    },
  },
  { re: /[=!<>]=?|\*\*|\/\/|->|[+\-*/%&|^~@:]/y, cls: 'op' },
  { re: /[{}()[\];,.]/y, cls: 'punct' },
];

// ─── HTML / XML / SVG ────────────────────────────────────────────────────────

const inTag = (s: State) => !!s.tag && !s.raw;
const htmlRules: Rule[] = [
  // Contents of <style> and <script> are coloured as CSS / JavaScript
  {
    re: /[\s\S]*?(?=<\/style\b|$)/iy,
    test: (s) => s.raw === 'style',
    html: (m) => highlight(m[0], 'css'),
    then: (s) => (s.raw = null),
  },
  {
    re: /[\s\S]*?(?=<\/script\b|$)/iy,
    test: (s) => s.raw === 'script',
    html: (m) => highlight(m[0], 'js'),
    then: (s) => (s.raw = null),
  },
  { re: /\s+/y, test: inTag },
  {
    re: /\/?>/y,
    cls: 'punct',
    test: inTag,
    then: (s, m) => {
      if (m[0] === '>' && !s.closing && (s.tag === 'style' || s.tag === 'script')) s.raw = s.tag;
      s.tag = null;
    },
  },
  { re: /"[^"]*"?|'[^']*'?/y, cls: 'str', test: inTag },
  { re: /=/y, cls: 'punct', test: inTag },
  { re: /[^\s"'>/=]+/y, cls: 'attr', test: inTag },
  { re: /\//y, cls: 'punct', test: inTag },
  // Outside tags
  { re: /<!--[\s\S]*?(?:-->|$)/y, cls: 'com' },
  { re: /<!\[CDATA\[[\s\S]*?(?:\]\]>|$)/y, cls: 'str' },
  { re: /<[!?][^>]*>?/y, cls: 'kw' },
  {
    re: /(<\/?)([A-Za-z][\w:.-]*)/y,
    html: (m) => span('punct', m[1]) + span('tag', m[2]),
    then: (s, m) => {
      s.tag = m[2].toLowerCase();
      s.closing = m[1] === '</';
    },
  },
  { re: /&#?\w+;/y, cls: 'num' },
  { re: /[^<&]+/y },
];

// ─── Markdown ────────────────────────────────────────────────────────────────

const mdRules: Rule[] = [
  // Fenced code is coloured in its own language: ```js … ```
  {
    re: /^(```|~~~)([^\n]*)(\n[\s\S]*?)(^(?:```|~~~)[^\n]*$|(?![\s\S]))/my,
    html: (m) =>
      span('punct', m[1]) +
      (m[2] ? span('kw', m[2]) : '') +
      (supportsLang(m[2].trim()) ? highlight(m[3], m[2].trim()) : span('str', m[3])) +
      (m[4] ? span('punct', m[4]) : ''),
  },
  { re: /^#{1,6}[ \t][^\n]*/my, cls: 'kw' },
  { re: /^>[^\n]*/my, cls: 'com' },
  { re: /^(?:-{3,}|\*{3,}|_{3,})[ \t]*$/my, cls: 'punct' },
  { re: /^[ \t]*(?:[-*+]|\d+[.)])(?=[ \t])/my, cls: 'tag' },
  { re: /^[ \t]*\[[ xX]\]/my, cls: 'tag' },
  { re: /`[^`\n]+`/y, cls: 'str' },
  { re: /!?\[[^\]\n]*\]\([^)\n]*\)?/y, cls: 'prop' },
  { re: /\*\*[^*\n]+\*\*|__[^_\n]+__/y, cls: 'strong' },
  { re: /\*[^*\s][^*\n]*\*|\b_[^_\n]+_\b/y, cls: 'em' },
  { re: /<\/?[A-Za-z][^>\n]*>/y, cls: 'tag' },
  { re: /[ \t]+|\n|\w+/y },
];

// ─── Public API ──────────────────────────────────────────────────────────────

const LANGS: Record<string, () => Rule[]> = {
  sql: () => sqlRules,
  json: () => jsonRules,
  css: () => cssRules,
  scss: () => cssRules,
  less: () => cssRules,
  html: () => htmlRules,
  xml: () => htmlRules,
  svg: () => htmlRules,
  js: () => jsRules,
  javascript: () => jsRules,
  ts: () => jsRules,
  typescript: () => jsRules,
  jsx: () => jsRules,
  tsx: () => jsRules,
  gs: () => jsRules,
  py: () => pyRules,
  python: () => pyRules,
  md: () => mdRules,
  markdown: () => mdRules,
};

export function supportsLang(lang: string): boolean {
  return !!LANGS[String(lang || '').toLowerCase()];
}

/** Escaped HTML with `tok-*` spans. Unknown languages come back escaped and uncoloured. */
export function highlight(code: string, lang: string): string {
  const rules = LANGS[String(lang || '').toLowerCase()];
  if (!rules || !code) return escapeCode(code || '');
  return run(code, rules(), {});
}

// Very long text is shown uncoloured so typing never lags
const MAX_COLOURED = 150_000;

const COPIED_STYLES = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontVariantLigatures',
  'fontFeatureSettings',
  'lineHeight',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'textIndent',
  'textAlign',
  'textTransform',
  'whiteSpace',
  'overflowWrap',
  'wordBreak',
  'direction',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

export interface CodeHighlightHandle {
  refresh: () => void;
}

/** Colours a textarea's text. `lang` may be a function, e.g. reading a language picker. */
export function attachCodeHighlight(
  ta: HTMLTextAreaElement,
  lang: string | (() => string),
): CodeHighlightHandle | null {
  if (!ta || ta.dataset.codeHl === 'on') return null;
  const parent = ta.parentElement;
  if (!parent) return null;
  ta.dataset.codeHl = 'on';
  const getLang = typeof lang === 'function' ? lang : () => lang;

  if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  const pre = document.createElement('pre');
  pre.className = 'code-hl';
  pre.setAttribute('aria-hidden', 'true');
  ta.insertAdjacentElement('afterend', pre);
  ta.classList.add('code-hl-input');

  let lastText: string | null = null;
  let lastLang = '';
  let frame = 0;

  const layout = () => {
    if (!ta.isConnected || ta.offsetParent === null) {
      pre.style.display = 'none';
      return;
    }
    pre.style.display = '';
    const cs = getComputedStyle(ta);
    for (const p of COPIED_STYLES) (pre.style as any)[p] = cs[p];
    pre.style.top = ta.offsetTop + ta.clientTop + 'px';
    pre.style.left = ta.offsetLeft + ta.clientLeft + 'px';
    pre.style.width = ta.clientWidth + 'px';
    pre.style.height = ta.clientHeight + 'px';
  };
  const syncScroll = () => {
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
  };
  const paint = () => {
    frame = 0;
    layout();
    const text = ta.value;
    const l = getLang();
    if (text !== lastText || l !== lastLang) {
      lastText = text;
      lastLang = l;
      const body = text.length > MAX_COLOURED ? escapeCode(text) : highlight(text, l);
      // A trailing newline needs something after it, or the last empty line has no height
      pre.innerHTML = body + (text.endsWith('\n') || !text ? ' ' : '');
    }
    syncScroll();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  // Scripts set `.value` directly (Format, Clear, Paste…) without an input event
  const proto = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  if (proto?.get && proto.set) {
    Object.defineProperty(ta, 'value', {
      configurable: true,
      get() {
        return proto.get!.call(this);
      },
      set(v) {
        proto.set!.call(this, v);
        schedule();
      },
    });
  }
  const setRangeText = ta.setRangeText;
  ta.setRangeText = function (...args: any[]) {
    (setRangeText as any).apply(this, args);
    schedule();
  } as typeof ta.setRangeText;

  ta.addEventListener('input', schedule);
  ta.addEventListener('change', schedule);
  ta.addEventListener('scroll', syncScroll, { passive: true });
  new MutationObserver(schedule).observe(ta, {
    attributes: true,
    attributeFilter: ['style', 'class', 'wrap'],
    childList: true,
    characterData: true,
    subtree: true,
  });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(ta);
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule).catch(() => {});

  paint();
  return {
    refresh: () => {
      lastText = null;
      schedule();
    },
  };
}

/** Attaches to every `textarea[data-code-lang]`. */
export function initCodeHighlight(root: ParentNode = document): void {
  root.querySelectorAll<HTMLTextAreaElement>('textarea[data-code-lang]').forEach((ta) => {
    attachCodeHighlight(ta, ta.dataset.codeLang || '');
  });
}
