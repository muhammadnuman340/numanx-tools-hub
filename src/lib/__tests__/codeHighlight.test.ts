import { describe, it, expect } from 'vitest';
import { highlight, supportsLang } from '../codeHighlight';

// The coloured copy must contain exactly the original text, or it drifts from the caret
const textOf = (html: string) =>
  html
    .replace(/<span class="tok-[a-z]+">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const tokens = (html: string, cls: string) =>
  [...html.matchAll(new RegExp(`<span class="tok-${cls}">([^<]*)</span>`, 'g'))].map((m) => textOf(m[1]));

const samples: Record<string, string> = {
  sql: `-- active users\nSELECT id, COUNT(*) AS n FROM "users" u\nWHERE u.active = 1 AND name LIKE 'O''Brien%' /* note */\nORDER BY created_at DESC;\n`,
  json: `{\n  "name": "Ann \\"A\\"",\n  "age": 31.5e2,\n  "ok": true,\n  "tags": [null, -2]\n}`,
  css: `@media (max-width: 600px) {\n  a:hover, .btn > #id[data-x="1"] { color: #fff !important; margin: -0.5rem calc(100% - 2px); --gap: 4px; }\n}\n/* end`,
  html: `<!DOCTYPE html>\n<div class="a" data-x='y' hidden>Tom &amp; Jerry < 3</div>\n<style>p { color: red; }</style><script>const a = 1 < 2;</script><!-- c --><br/>`,
  js: "// hi\nconst f = async (x) => x?.map((v) => v * 2) ?? `t ${x}`;\nclass A extends B { get n() { return 0x1f; } }\n",
  python: `@dec\ndef f(x: int) -> str:\n    """doc"""\n    return f"{x}" if x is not None else 'n'  # c\n`,
  markdown: `# Title\n\n> quote\n\n- item with **bold** and *em* and \`code\`\n1. [link](https://x.y)\n\n\`\`\`js\nconst a = 1;\n\`\`\`\n---\n`,
};

describe('highlight', () => {
  for (const [lang, code] of Object.entries(samples)) {
    it(`keeps ${lang} text exactly`, () => {
      expect(textOf(highlight(code, lang))).toBe(code);
    });
    it(`keeps every prefix of ${lang} text exactly (half-typed code)`, () => {
      for (let i = 0; i <= code.length; i += 3) {
        const part = code.slice(0, i);
        expect(textOf(highlight(part, lang))).toBe(part);
      }
    });
  }

  it('escapes HTML so typed text can never become markup', () => {
    const html = highlight('<img src=x onerror=alert(1)>', 'sql');
    expect(html).not.toContain('<img');
    expect(highlight('<b>x</b>', 'unknown')).toBe('&lt;b&gt;x&lt;/b&gt;');
  });

  it('colours SQL keywords, functions, strings and comments', () => {
    const html = highlight(samples.sql, 'sql');
    expect(tokens(html, 'kw')).toEqual(expect.arrayContaining(['SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'DESC']));
    expect(tokens(html, 'fn')).toContain('COUNT');
    expect(tokens(html, 'str')).toContain("'O''Brien%'");
    expect(tokens(html, 'com')).toEqual(['-- active users', '/* note */']);
  });

  it('tells JSON keys from string values', () => {
    const html = highlight(samples.json, 'json');
    expect(tokens(html, 'prop')).toEqual(['"name"', '"age"', '"ok"', '"tags"']);
    expect(tokens(html, 'const')).toEqual(['true', 'null']);
  });

  it('tells CSS properties from selectors and pseudo-classes', () => {
    const html = highlight(samples.css, 'css');
    expect(tokens(html, 'prop')).toEqual(expect.arrayContaining(['color', 'margin', '--gap']));
    expect(tokens(html, 'prop')).not.toContain('a');
    expect(tokens(html, 'kw')).toEqual(expect.arrayContaining(['@media', ':hover', '!important']));
    expect(tokens(html, 'num')).toEqual(expect.arrayContaining(['#fff', '-0.5rem', '100%']));
  });

  it('colours HTML tags and attributes, and CSS/JS inside style and script', () => {
    const html = highlight(samples.html, 'html');
    expect(tokens(html, 'tag')).toEqual(expect.arrayContaining(['div', 'style', 'script', 'br']));
    expect(tokens(html, 'attr')).toEqual(['class', 'data-x', 'hidden']);
    expect(tokens(html, 'prop')).toContain('color'); // inside <style>
    expect(tokens(html, 'kw')).toContain('const'); // inside <script>
  });

  it('knows its languages', () => {
    expect(supportsLang('SQL')).toBe(true);
    expect(supportsLang('svg')).toBe(true);
    expect(supportsLang('cobol')).toBe(false);
  });
});
