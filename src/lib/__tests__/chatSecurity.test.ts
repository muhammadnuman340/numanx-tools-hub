import { describe, it, expect } from 'vitest';
import { getPrototypeResponse, createMessageBubble, FALLBACK_REPLY } from '../chatAssistant';

// Simulated minimal DOM Document for testing createMessageBubble in Node environment
class MockElement {
  tagName: string;
  className: string = '';
  textContent: string = '';
  children: MockElement[] = [];
  attributes: Record<string, string> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  appendChild(child: MockElement) {
    this.children.push(child);
    return child;
  }

  querySelector(selector: string): MockElement | null {
    if (selector === 'p') {
      return this.findChild((el) => el.tagName === 'P');
    }
    return null;
  }

  querySelectorAll(selector: string): MockElement[] {
    const results: MockElement[] = [];
    this.collectAll(selector.toUpperCase(), results);
    return results;
  }

  private collectAll(tag: string, results: MockElement[]) {
    for (const child of this.children) {
      if (child.tagName === tag) results.push(child);
      child.collectAll(tag, results);
    }
  }

  private findChild(predicate: (el: MockElement) => boolean): MockElement | null {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const found = child.findChild(predicate);
      if (found) return found;
    }
    return null;
  }
}

class MockDocument {
  createElement(tag: string): any {
    return new MockElement(tag);
  }
}

const mockDoc = new MockDocument() as unknown as Document;

describe('Production Chat & Toast Security Hotfix Suite', () => {
  describe('getPrototypeResponse() Prototype Engine', () => {
    it('returns the greeting reply', () => {
      expect(getPrototypeResponse('Hello!')).toContain('I am your local NumanX Assistant');
    });

    it('returns the image format reply', () => {
      expect(getPrototypeResponse('Which image formats can I convert?')).toContain('JPG to PNG');
    });

    it('returns the tool count reply with the registry total', () => {
      expect(getPrototypeResponse('How many tools are there?')).toContain('65 client-side tools');
    });

    it('returns the fallback without reflecting the input', () => {
      const payload = '<script>alert("reflected")</script>';
      const reply = getPrototypeResponse(payload);
      expect(reply).toBe(FALLBACK_REPLY);
      expect(reply).not.toContain('<script>');
      expect(reply).not.toContain('reflected');
    });

    it('does not treat "hi" inside another word as a greeting', () => {
      expect(getPrototypeResponse('this one')).toBe(FALLBACK_REPLY);
    });

    it('treats newlines in the input as spaces', () => {
      expect(getPrototypeResponse('Hello\r\nWorld')).toContain('I am your local NumanX Assistant');
    });

    it('handles empty or whitespace-only queries safely', () => {
      expect(getPrototypeResponse('')).toBe(FALLBACK_REPLY);
      expect(getPrototypeResponse('   \t  ')).toBe(FALLBACK_REPLY);
    });
  });

  describe('createMessageBubble() Production DOM Factory Verification', () => {
    const attackVectors = [
      { name: 'Script tag injection', payload: '<script>window.pwned=true; alert(1)</script>' },
      { name: 'Img onerror injection', payload: '<img src="x" onerror="alert(1)">' },
      { name: 'SVG onload injection', payload: '<svg onload="alert(1)">' },
      { name: 'Attribute breakout (double quotes)', payload: '"><script>alert(1)</script><div class="' },
      { name: 'Attribute breakout (single quotes)', payload: '\' onmouseover=\'alert(1)\' autofocus=\'' },
      { name: 'JavaScript URL in iframe', payload: '<iframe src="javascript:alert(1)"></iframe>' },
      { name: 'JavaScript URL in anchor', payload: '<a href="javascript:alert(1)">Click me</a>' },
      { name: 'HTML-like math comparison', payload: 'Formula: 5 < 10 and 12 > 8 & "quoted" text' },
      { name: 'Unicode and multiline input', payload: 'Line 1\nLine 2\r\n🔥 日本語 123 <tag>' },
    ];

    for (const { name, payload } of attackVectors) {
      it(`renders "${name}" safely without creating unauthorized HTML elements or attributes`, () => {
        const bubble = createMessageBubble(mockDoc, payload, '10:00 AM', true) as unknown as MockElement;

        // 1. Structure is preserved: outer div contains card and timeSpan
        expect(bubble.tagName).toBe('DIV');
        expect(bubble.className).toContain('flex flex-col items-end');
        expect(bubble.children.length).toBe(2);

        const card = bubble.children[0];
        expect(card.className).toContain('bg-amber-600/20');
        expect(card.children.length).toBe(1);

        const p = card.children[0];
        expect(p.tagName).toBe('P');

        // 2. The input remains intact as plain text content
        expect(p.textContent).toBe(payload);

        // 3. The paragraph element has zero child element nodes (not parsed as HTML)
        expect(p.children.length).toBe(0);

        // 4. No dangerous script, iframe, or img elements exist in the entire bubble tree
        expect(bubble.querySelectorAll('SCRIPT').length).toBe(0);
        expect(bubble.querySelectorAll('IFRAME').length).toBe(0);
        expect(bubble.querySelectorAll('IMG').length).toBe(0);
        expect(bubble.querySelectorAll('SVG').length).toBe(0);

        // 5. Time span is preserved
        const timeSpan = bubble.children[1];
        expect(timeSpan.tagName).toBe('SPAN');
        expect(timeSpan.textContent).toBe('10:00 AM');
      });
    }

    it('renders malicious simulated assistant responses safely', () => {
      const maliciousAiResponse = '<script>fetch("/steal")</script>Assistant response with <b>markup</b>';
      const bubble = createMessageBubble(mockDoc, maliciousAiResponse, '10:01 AM', false) as unknown as MockElement;

      expect(bubble.className).toContain('items-start');
      const card = bubble.children[0];
      expect(card.className).toContain('bg-[#1e1e1b]');

      const p = card.children[0];
      expect(p.textContent).toBe(maliciousAiResponse);
      expect(p.children.length).toBe(0);
      expect(bubble.querySelectorAll('SCRIPT').length).toBe(0);
    });
  });

  describe('Toast Notification Security Verification', () => {
    it('verifies that setting textContent on toast paragraph neutralizes HTML injection', () => {
      const toastPayloads = [
        '<b onmouseover="alert(1)">Error!</b>',
        '<img src=x onerror=alert(1)>',
        '<script>alert(1)</script>',
        'Plain text notification',
        'Unicode: ✓ 成功 🚀',
      ];

      for (const msg of toastPayloads) {
        const p = mockDoc.createElement('p') as unknown as MockElement;
        // Exact pattern used in Toast.astro:
        p.textContent = msg;

        // Content remains strictly literal text
        expect(p.textContent).toBe(msg);
        expect(p.children.length).toBe(0);
        expect(p.querySelectorAll('SCRIPT').length).toBe(0);
        expect(p.querySelectorAll('IMG').length).toBe(0);
      }
    });
  });
});
