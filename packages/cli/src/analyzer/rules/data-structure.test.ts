/**
 * Tests for data structure detection rule
 */

import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

describe("Data structure detection", () => {
  describe("Array of objects pattern", () => {
    it("should detect translation keys in array of objects with t parameter", () => {
      const source = `
        const getLoadingStages = (t) => [
          { message: "reviewingYourCriteria", icon: Brain },
          { message: "selectingQuestions", icon: TestTube },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect 2 keys from data structure
      expect(result.stats.dataStructureKeys).toBeGreaterThanOrEqual(2);
      expect(result.stats.dataStructureScopes).toBe(1);

      // Check that keys were found
      const keys = result.issues
        .filter((i) => i.text === "reviewingYourCriteria" || i.text === "selectingQuestions")
        .map((i) => i.key);
      expect(keys.length).toBe(2);
    });

    it("should apply namespace from useTranslations binding", () => {
      const source = `
        const t = useTranslations("testGeneration");
        const getLoadingStages = (t) => [
          { message: "reviewingYourCriteria" },
          { message: "selectingQuestions" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Keys should have namespace prefix
      const keys = result.issues
        .filter((i) => i.key?.startsWith("testGeneration."))
        .map((i) => i.key);
      expect(keys.length).toBeGreaterThanOrEqual(2);
      expect(keys).toContain("testGeneration.reviewingYourCriteria");
      expect(keys).toContain("testGeneration.selectingQuestions");
    });

    it("should not detect when not in translation scope", () => {
      const source = `
        const getData = () => [
          { message: "someMessage" },
          { label: "someLabel" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx", {
        dataStructureDetection: { requireTranslationScope: true },
      });

      // Should not detect anything (no translation scope)
      expect(result.stats.dataStructureKeys).toBe(0);
    });
  });

  describe("Object literal patterns", () => {
    it("should detect keys in object literals", () => {
      const source = `
        const getMessages = (t) => ({
          success: { message: "operationSuccess", icon: Check },
          error: { message: "operationFailed", icon: X },
        });
      `;

      const result = analyzeSourceText(source, "test.tsx");

      expect(result.stats.dataStructureKeys).toBeGreaterThanOrEqual(2);
      const messageKeys = result.issues.filter(
        (i) => i.text === "operationSuccess" || i.text === "operationFailed",
      );
      expect(messageKeys.length).toBe(2);
    });

    it("should detect multiple property name patterns", () => {
      const source = `
        const getConfig = (t) => ({
          title: "pageTitle",
          description: "pageDescription",
          placeholder: "inputPlaceholder",
          label: "fieldLabel",
        });
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect all 4 property patterns
      expect(result.stats.dataStructureKeys).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Nested structures", () => {
    it("should handle nested objects within maxDepth", () => {
      const source = `
        const getMenu = (t) => [
          {
            title: "home",
            items: [
              { label: "dashboard" },
              { label: "profile" },
            ],
          },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect title and labels (within depth limit)
      expect(result.stats.dataStructureKeys).toBeGreaterThanOrEqual(3);
    });

    it("should respect maxDepth configuration", () => {
      const source = `
        const getDeepStructure = (t) => ({
          level1: {
            level2: {
              level3: {
                level4: {
                  message: "deepKey",
                },
              },
            },
          },
        });
      `;

      const result = analyzeSourceText(source, "test.tsx", {
        dataStructureDetection: { maxDepth: 2 },
      });

      // Should not detect deeply nested key (beyond maxDepth)
      const deepKeys = result.issues.filter((i) => i.text === "deepKey");
      expect(deepKeys.length).toBe(0);
    });
  });

  describe("Filtering and heuristics", () => {
    it("should filter out URLs", () => {
      const source = `
        const getLinks = (t) => [
          { message: "validKey", url: "https://example.com" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect validKey but not URL
      const keys = result.issues.map((i) => i.text);
      expect(keys).toContain("validKey");
      expect(keys).not.toContain("https://example.com");
    });

    it("should filter out file paths", () => {
      const source = `
        const getConfig = (t) => ({
          message: "validKey",
          path: "/some/file/path",
        });
      `;

      const result = analyzeSourceText(source, "test.tsx");

      const keys = result.issues.map((i) => i.text);
      expect(keys).toContain("validKey");
      expect(keys).not.toContain("/some/file/path");
    });

    it("should filter out CSS classes", () => {
      const source = `
        const getStyles = (t) => ({
          message: "validKey",
          className: "flex items-center gap-2",
        });
      `;

      const result = analyzeSourceText(source, "test.tsx");

      const keys = result.issues.map((i) => i.text);
      expect(keys).toContain("validKey");
      expect(keys).not.toContain("flex items-center gap-2");
    });

    it("should filter out very short strings", () => {
      const source = `
        const getData = (t) => [
          { message: "validKey", type: "x" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      const keys = result.issues.map((i) => i.text);
      expect(keys).toContain("validKey");
      expect(keys).not.toContain("x");
    });
  });

  describe("Custom configuration", () => {
    it("should respect custom property names", () => {
      const source = `
        const getCustom = (t) => [
          { customKey: "myTranslationKey" },
          { unknownProp: "shouldNotDetect" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx", {
        dataStructureDetection: {
          propertyNames: ["customKey"],
          requireTranslationScope: true,
        },
      });

      const keys = result.issues.map((i) => i.text);
      expect(keys).toContain("myTranslationKey");
      expect(keys).not.toContain("shouldNotDetect");
    });

    it("should allow disabling the feature", () => {
      const source = `
        const getMessages = (t) => [
          { message: "key1" },
          { message: "key2" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx", {
        dataStructureDetection: { enabled: false },
      });

      expect(result.stats.dataStructureKeys).toBe(0);
    });
  });

  describe("Translation scope detection", () => {
    it("should detect scope with various t parameter patterns", () => {
      const source = `
        const fn1 = (t) => [{ message: "key1" }];
        const fn2 = (tCommon) => [{ message: "key2" }];
        const fn3 = (tAuth) => [{ message: "key3" }];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // All 3 functions have t-style parameters
      expect(result.stats.dataStructureScopes).toBe(3);
      expect(result.stats.dataStructureKeys).toBeGreaterThanOrEqual(3);
    });

    it("should work with useTranslations binding", () => {
      const source = `
        const t = useTranslations("myNamespace");
        const config = {
          message: "myKey",
          label: "myLabel",
        };
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect in scope where useTranslations was called
      const keys = result.issues
        .filter((i) => i.namespace === "myNamespace")
        .map((i) => i.key);
      expect(keys.length).toBeGreaterThanOrEqual(2);
      expect(keys).toContain("myNamespace.myKey");
      expect(keys).toContain("myNamespace.myLabel");
    });
  });

  describe("Real-world example", () => {
    it("should handle the getLoadingStages pattern from the issue", () => {
      const source = `
        import { Brain, TestTube } from "lucide-react";

        const t = useTranslations("testGeneration");

        const getLoadingStages = (t: (key: string) => string) => [
          { message: "reviewingYourCriteria", icon: Brain },
          { message: "selectingQuestions", icon: TestTube },
          { message: "preparingContent", icon: FileText },
        ];

        const loadingStages = getLoadingStages(t);
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect all 3 keys with namespace
      const keys = result.issues
        .filter((i) => i.namespace === "testGeneration")
        .map((i) => i.key);

      expect(keys).toContain("testGeneration.reviewingYourCriteria");
      expect(keys).toContain("testGeneration.selectingQuestions");
      expect(keys).toContain("testGeneration.preparingContent");
      expect(result.stats.dataStructureScopes).toBeGreaterThanOrEqual(1);
    });
  });

  describe("File-level namespace inference", () => {
    it("should apply file-level namespace when data structure is in module scope", () => {
      const source = `
        // Module scope - defined before useTranslations
        const getLoadingStages = (t) => [
          { message: "reviewingYourCriteria" },
          { message: "selectingQuestions" },
        ];

        export function Component() {
          const t = useTranslations("testGeneration");
          const stages = getLoadingStages(t);
        }
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect keys with namespace from file-level inference
      const keys = result.issues
        .filter(i => i.namespace === "testGeneration")
        .map(i => i.key);

      expect(keys).toContain("testGeneration.reviewingYourCriteria");
      expect(keys).toContain("testGeneration.selectingQuestions");
      expect(keys.length).toBe(2);
    });

    it("should handle multiple namespaces in file", () => {
      const source = `
        const data = (t) => [{ message: "key1" }];

        function Component1() {
          const t = useTranslations("namespace1");
        }

        function Component2() {
          const t = useTranslations("namespace2");
        }
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should use first namespace with unknown-scoped binding type (ambiguous)
      const key = result.issues.find(i => i.text === "key1");
      expect(key?.namespace).toBeDefined();
      expect(["namespace1", "namespace2"]).toContain(key?.namespace);
      // Should mark as unknown-scoped due to ambiguity
      expect(key?.bindingType).toBe("unknown-scoped");
    });

    it("should handle module-scope data structure before useTranslations call", () => {
      const source = `
        // Data structure at module scope - BEFORE useTranslations
        const statusMessages = (t) => ({
          success: { message: "operationSucceeded", icon: Check },
          error: { message: "operationFailed", icon: X },
          loading: { message: "operationInProgress", icon: Loader },
        });

        // useTranslations call comes AFTER in the file
        export function StatusDisplay() {
          const t = useTranslations("status");
          const messages = statusMessages(t);
          return <div>{t(messages.success.message)}</div>;
        }
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect all 3 keys with the "status" namespace via file-level inference
      const statusKeys = result.issues
        .filter(i => i.namespace === "status")
        .map(i => i.key);

      expect(statusKeys).toContain("status.operationSucceeded");
      expect(statusKeys).toContain("status.operationFailed");
      expect(statusKeys).toContain("status.operationInProgress");
      expect(statusKeys.length).toBe(3);
    });

    it("should use file-level namespace when no scope-bound namespace exists", () => {
      const source = `
        // File-level namespace at top
        const t = useTranslations("fileLevel");

        // Function with data structure but no local useTranslations
        function Component() {
          const getData = (t) => [
            { message: "scopedKey" }
          ];
          const data = getData(t);
        }
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should use file-level namespace since no local binding exists
      const key = result.issues.find(i => i.text === "scopedKey");
      expect(key?.namespace).toBe("fileLevel");
      expect(key?.key).toBe("fileLevel.scopedKey");
    });

    it("should work with no namespaces in file", () => {
      const source = `
        const getData = (t) => [
          { message: "someKey" }
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect key without namespace (existing behavior)
      const key = result.issues.find(i => i.text === "someKey");
      expect(key).toBeDefined();
      expect(key?.namespace).toBeUndefined();
      expect(key?.key).toBe("someKey");
      expect(key?.bindingType).toBe("unbound");
    });
  });

  describe("Language selector pattern exclusion", () => {
    it("should not detect native language names in language selectors", () => {
      const source = `
        const t = useTranslations("common");

        const options = [
          { value: "en", label: "English" },
          { value: "tr", label: "Türkçe" },
          { value: "de", label: "Deutsch" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should NOT detect language names
      const englishKey = result.issues.find(i => i.text === "English");
      const turkishKey = result.issues.find(i => i.text === "Türkçe");
      const germanKey = result.issues.find(i => i.text === "Deutsch");

      expect(englishKey).toBeUndefined();
      expect(turkishKey).toBeUndefined();
      expect(germanKey).toBeUndefined();
    });

    it("should handle language codes with region codes", () => {
      const source = `
        const t = useTranslations("common");

        const options = [
          { value: "en-US", label: "English (US)" },
          { value: "en-GB", label: "English (UK)" },
          { value: "pt-BR", label: "Português (Brasil)" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should NOT detect language names
      const keys = result.issues.map(i => i.text);
      expect(keys).not.toContain("English (US)");
      expect(keys).not.toContain("English (UK)");
      expect(keys).not.toContain("Português (Brasil)");
    });

    it("should still detect regular label properties outside language selectors", () => {
      const source = `
        const t = useTranslations("common");

        // Regular array with label - should detect
        const buttons = [
          { id: "save", label: "saveButton" },
          { id: "cancel", label: "cancelButton" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect these as they're not language codes
      const keys = result.issues
        .filter(i => i.namespace === "common")
        .map(i => i.text);

      expect(keys).toContain("saveButton");
      expect(keys).toContain("cancelButton");
    });

    it("should handle real-world language switcher component", () => {
      const source = `
        import { useTranslations } from "next-intl";

        export default function LocaleSwitcherSelect() {
          const t = useTranslations("common");

          return (
            <SimpleSelect
              options={[
                { value: "tr", label: "Türkçe" },
                { value: "en", label: "English" },
              ]}
            />
          );
        }
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should NOT detect "Türkçe" or "English"
      const turkishKey = result.issues.find(i => i.text === "Türkçe");
      const englishKey = result.issues.find(i => i.text === "English");

      expect(turkishKey).toBeUndefined();
      expect(englishKey).toBeUndefined();
    });

    it("should require at least 2 elements to be a language selector", () => {
      const source = `
        const t = useTranslations("common");

        // Single element - not a selector, should detect
        const option = [
          { value: "en", label: "selectLanguage" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect since it's not a language selector pattern (only 1 element)
      const key = result.issues.find(i => i.text === "selectLanguage");
      expect(key).toBeDefined();
    });

    it("should not match if value is not a language code", () => {
      const source = `
        const t = useTranslations("common");

        // Values are not language codes - should detect labels
        const options = [
          { value: "option1", label: "firstOption" },
          { value: "option2", label: "secondOption" },
        ];
      `;

      const result = analyzeSourceText(source, "test.tsx");

      // Should detect labels since values aren't language codes
      const keys = result.issues.map(i => i.text);
      expect(keys).toContain("firstOption");
      expect(keys).toContain("secondOption");
    });
  });
});
