/**
 * Tests for translation hook detection
 *
 * Focuses on getTranslations() server-side detection patterns
 */

import { describe, it, expect } from 'bun:test';
import { analyzeSourceText } from './index.js';

describe('getTranslations detection', () => {
  describe('string literal namespace', () => {
    it('should detect basic string literal', () => {
      const source = `
        const t = await getTranslations("welcome");
        t("title");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      // Should NOT be marked as dynamic or root scoped
      expect(result.stats.dynamicNamespaces).toBe(0);
      expect(result.stats.rootScopedTranslators).toBe(0);
    });

    it('should handle await expression', () => {
      const source = `
        async function Page() {
          const t = await getTranslations("maintenance");
          return <h1>{t("title")}</h1>;
        }
      `;

      const result = analyzeSourceText(source, 'page.tsx');

      expect(result.stats.dynamicNamespaces).toBe(0);
      expect(result.stats.rootScopedTranslators).toBe(0);
    });

    it('should detect in destructured assignment', () => {
      const source = `
        const { t } = await getTranslations("auth");
        t("login");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.dynamicNamespaces).toBe(0);
    });
  });

  describe('object literal with namespace', () => {
    it('should detect namespace property in object', () => {
      const source = `
        const t = await getTranslations({
          locale: "en",
          namespace: "maintenance"
        });
        t("title");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.dynamicNamespaces).toBe(0);
      expect(result.stats.rootScopedTranslators).toBe(0);
    });

    it('should handle object without namespace as root scoped', () => {
      const source = `
        const t = await getTranslations({ locale: "en" });
        t("title");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.rootScopedTranslators).toBe(1);
      expect(result.stats.dynamicNamespaces).toBe(0);
    });

    it('should mark dynamic namespace in object', () => {
      const source = `
        const ns = getNamespace();
        const t = await getTranslations({
          locale: "en",
          namespace: ns
        });
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.dynamicNamespaces).toBe(1);
    });
  });

  describe('no arguments (root scoped)', () => {
    it('should mark as root scoped when no arguments', () => {
      const source = `
        const t = await getTranslations();
        t("title");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.rootScopedTranslators).toBe(1);
      expect(result.stats.dynamicNamespaces).toBe(0);
    });

    it('should handle root scoped in component', () => {
      const source = `
        export default async function Page() {
          const t = await getTranslations();
          return <h1>{t("global.title")}</h1>;
        }
      `;

      const result = analyzeSourceText(source, 'page.tsx');

      expect(result.stats.rootScopedTranslators).toBe(1);
    });
  });
});

describe('useTranslations detection', () => {
  describe('client-side hook', () => {
    it('should detect useTranslations with namespace', () => {
      const source = `
        const t = useTranslations("auth");
        t("login");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.dynamicNamespaces).toBe(0);
      expect(result.stats.rootScopedTranslators).toBe(0);
    });

    it('should mark root scoped without namespace', () => {
      const source = `
        const t = useTranslations();
        t("title");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.rootScopedTranslators).toBe(1);
    });

    it('should handle destructured hook', () => {
      const source = `
        const { t } = useTranslations("nav");
        t("home");
      `;

      const result = analyzeSourceText(source, 'test.tsx');

      expect(result.stats.dynamicNamespaces).toBe(0);
    });
  });
});

describe('mixed patterns', () => {
  it('should detect both client and server hooks in same file', () => {
    const source = `
      const clientT = useTranslations("client");

      async function serverFunction() {
        const serverT = await getTranslations("server");
        return serverT("title");
      }

      clientT("hello");
    `;

    const result = analyzeSourceText(source, 'mixed.tsx');

    expect(result.stats.dynamicNamespaces).toBe(0);
    expect(result.stats.rootScopedTranslators).toBe(0);
  });

  it('should handle multiple server components', () => {
    const source = `
      async function Welcome() {
        const t1 = await getTranslations("welcome");
        return <h1>{t1("title")}</h1>;
      }

      async function Maintenance() {
        const t2 = await getTranslations("maintenance");
        return <p>{t2("message")}</p>;
      }
    `;

    const result = analyzeSourceText(source, 'pages.tsx');

    expect(result.stats.dynamicNamespaces).toBe(0);
    expect(result.stats.rootScopedTranslators).toBe(0);
  });
});

describe('edge cases', () => {
  it('should handle nested function scopes', () => {
    const source = `
      async function outer() {
        const t1 = await getTranslations("outer");

        async function inner() {
          const t2 = await getTranslations("inner");
          return t2("nested");
        }

        return t1("title");
      }
    `;

    const result = analyzeSourceText(source, 'nested.tsx');

    expect(result.stats.dynamicNamespaces).toBe(0);
  });

  it('should handle conditional getTranslations', () => {
    const source = `
      async function ConditionalPage({ isAdmin }: Props) {
        const t = await getTranslations(isAdmin ? "admin" : "user");
        return <h1>{t("title")}</h1>;
      }
    `;

    const result = analyzeSourceText(source, 'conditional.tsx');

    // Ternary namespace is dynamic
    expect(result.stats.dynamicNamespaces).toBe(1);
  });

  it('should not confuse with other functions named getTranslations', () => {
    const source = `
      // Custom function with same name
      function getTranslations(ns: string) {
        return (key: string) => key;
      }

      const t = getTranslations("custom");
    `;

    const result = analyzeSourceText(source, 'custom.tsx');

    // Should still detect it (we check function name, not import source)
    expect(result.stats.dynamicNamespaces).toBe(0);
  });
});
