import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCombo, matchesCombo, registerShortcut } from './index';

describe('keyboard-shortcut-listener', () => {
  describe('parseCombo', () => {
    it('should parse ctrl+k', () => {
      const parsed = parseCombo('ctrl+k');
      expect(parsed.ctrl).toBe(true);
      expect(parsed.meta).toBe(false);
      expect(parsed.key).toBe('k');
    });

    it('should parse complex combo: cmd+shift+p', () => {
      const parsed = parseCombo('cmd+shift+p');
      expect(parsed.meta).toBe(true);
      expect(parsed.shift).toBe(true);
      expect(parsed.ctrl).toBe(false);
      expect(parsed.key).toBe('p');
    });

    it('should parse alt/option combinations', () => {
      const parsed = parseCombo('alt+enter');
      expect(parsed.alt).toBe(true);
      expect(parsed.key).toBe('enter');
    });

    it('should parse simple key without modifier', () => {
      const parsed = parseCombo('escape');
      expect(parsed.ctrl).toBe(false);
      expect(parsed.key).toBe('escape');
    });
  });

  describe('matchesCombo', () => {
    it('should match exact key and modifier', () => {
      const parsed = parseCombo('ctrl+s');
      const event = {
        key: 's',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false
      } as KeyboardEvent;

      expect(matchesCombo(event, parsed, true)).toBe(true);
    });

    it('should reject when unmentioned modifier is active under exact mode', () => {
      const parsed = parseCombo('ctrl+s');
      const eventWithShift = {
        key: 's',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: true // Unmentioned shift
      } as KeyboardEvent;

      expect(matchesCombo(eventWithShift, parsed, true)).toBe(false);
    });

    it('should handle key alias esc -> escape', () => {
      const parsed = parseCombo('esc');
      const event = {
        key: 'Escape',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false
      } as KeyboardEvent;

      expect(matchesCombo(event, parsed)).toBe(true);
    });
  });

  describe('registerShortcut', () => {
    let mockTarget: EventTarget & {
      listeners: Record<string, ((e: any) => void)[]>;
      trigger: (e: any) => void;
    };

    beforeEach(() => {
      const listeners: Record<string, ((e: any) => void)[]> = {};
      mockTarget = {
        listeners,
        addEventListener(event: string, handler: any) {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(handler);
        },
        removeEventListener(event: string, handler: any) {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((h) => h !== handler);
          }
        },
        dispatchEvent(e: any) { return true; },
        trigger(e: any) {
          listeners['keydown']?.forEach((cb) => cb(e));
        }
      };
    });

    it('should trigger callback on matching shortcut', () => {
      const handler = vi.fn();
      const unregister = registerShortcut('ctrl+k', handler, {
        target: mockTarget,
        ignoreInputs: false
      });

      mockTarget.trigger({
        key: 'k',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        preventDefault: vi.fn()
      });

      expect(handler).toHaveBeenCalledTimes(1);

      unregister();
      mockTarget.trigger({
        key: 'k',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        preventDefault: vi.fn()
      });

      expect(handler).toHaveBeenCalledTimes(1); // Not called again after unregister
    });

    it('should call preventDefault when option enabled', () => {
      const handler = vi.fn();
      registerShortcut('ctrl+s', handler, {
        target: mockTarget,
        preventDefault: true,
        ignoreInputs: false
      });

      const preventDefault = vi.fn();
      mockTarget.trigger({
        key: 's',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        preventDefault
      });

      expect(handler).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should support array of combos', () => {
      const handler = vi.fn();
      registerShortcut(['ctrl+k', 'ctrl+p'], handler, {
        target: mockTarget,
        ignoreInputs: false
      });

      mockTarget.trigger({
        key: 'k',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false
      });
      expect(handler).toHaveBeenCalledTimes(1);

      mockTarget.trigger({
        key: 'p',
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false
      });
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });
});
