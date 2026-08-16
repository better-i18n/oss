/**
 * Compile-time guarantees for the schemas the admin SDK derives its argument
 * types from. Nothing here runs and nothing is re-exported from `index.ts` —
 * `tsc --noEmit` is the whole point.
 *
 * Why this file exists: every array/number parameter goes through
 * `z.preprocess` so agents can send a JSON string instead of a real array. In
 * Zod 4 a bare `z.preprocess` types its input as `unknown`, and that `unknown`
 * propagates into `z.input<>` — so `admin.languages.add()` accepted anything
 * and suggested nothing. A customer reported it against `languages.add` on
 * 2026-08-16; the same collapse was live on nine other parameters.
 *
 * Reintroduce a bare `z.preprocess(...)` and the matching line below stops
 * compiling, instead of silently shipping an untyped SDK again.
 */

import type {
  addLanguagesInput,
  createKeysInput,
  deleteKeysInput,
  deleteLanguagesInput,
  getTranslationsInput,
  listKeysInput,
  setTranslationsInput,
  updateKeysInput,
  updateLanguagesInput,
} from "./schemas";
import type { z } from "zod";

/**
 * `Expect<Typed<X>>` is a type error when `X` is `unknown` or `any`, because
 * `Typed` resolves to `false` and `false` does not satisfy the `true`
 * constraint. A plain conditional alias would resolve to `never` and compile
 * happily, which is the trap this pattern avoids.
 */
type Expect<T extends true> = T;
type Typed<T> = unknown extends T ? false : true;

// --- languages ---------------------------------------------------------------

type AddLanguages = z.input<typeof addLanguagesInput>;

export type AddLanguagesIsTyped = Expect<Typed<AddLanguages["languages"]>>;
/** The array form carries a real element type, not `unknown[]`. */
export type AddLanguagesElementIsTyped = Expect<
  Typed<Extract<AddLanguages["languages"], readonly unknown[]>[number]>
>;

export type UpdateLanguagesIsTyped = Expect<
  Typed<z.input<typeof updateLanguagesInput>["updates"]>
>;
export type DeleteLanguagesIsTyped = Expect<
  Typed<z.input<typeof deleteLanguagesInput>["languageCodes"]>
>;

/** Both call shapes stay legal: real objects, and the JSON string agents send. */
export const addLanguagesCallShapes = [
  [{ languageCode: "en-ca" }, { languageCode: "en-au", status: "draft" }],
  '[{"languageCode":"en-ca"}]',
] satisfies AddLanguages["languages"][];

// --- keys and translations ---------------------------------------------------

export type CreateKeysIsTyped = Expect<Typed<z.input<typeof createKeysInput>["k"]>>;
export type UpdateKeysIsTyped = Expect<Typed<z.input<typeof updateKeysInput>["t"]>>;
export type SetTranslationsIsTyped = Expect<
  Typed<z.input<typeof setTranslationsInput>["t"]>
>;
export type DeleteKeysIsTyped = Expect<
  Typed<z.input<typeof deleteKeysInput>["keyIds"]>
>;

// --- read parameters ---------------------------------------------------------

type ListKeys = z.input<typeof listKeysInput>;

export type ListKeysNamespacesIsTyped = Expect<Typed<ListKeys["namespaces"]>>;
export type ListKeysFieldsIsTyped = Expect<Typed<ListKeys["fields"]>>;
export type ListKeysPageIsTyped = Expect<Typed<ListKeys["page"]>>;
export type ListKeysLimitIsTyped = Expect<Typed<ListKeys["limit"]>>;

type GetTranslations = z.input<typeof getTranslationsInput>;

export type GetTranslationsNamespacesIsTyped = Expect<
  Typed<GetTranslations["namespaces"]>
>;
export type GetTranslationsKeysIsTyped = Expect<Typed<GetTranslations["keys"]>>;
export type GetTranslationsLanguagesIsTyped = Expect<
  Typed<GetTranslations["languages"]>
>;
export type GetTranslationsLimitIsTyped = Expect<Typed<GetTranslations["limit"]>>;
