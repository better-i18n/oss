// Ambient module declarations for framework peerDependencies.
//
// These minimal type shims let `tsc` resolve types at build time without
// the peer packages installed. At runtime, the consumer's own install of
// the framework provides the real implementation — that's the standard
// peerDependency contract.
//
// We use this approach instead of adding vue/svelte/react-native to
// devDependencies because (a) it bloats CI installs, (b) it implies a
// build-time dependency that doesn't actually exist, and (c) bumping a
// devDep version could conflict with the consumer's pinned framework.
//
// Keep these shims MINIMAL — only declare the API surface our adapters
// actually use. If you add a new vue/svelte call, extend the shim here.

declare module 'vue' {
  export type InjectionKey<T> = symbol & { __vue_injection_brand__?: T };
  export function inject<T>(key: InjectionKey<T>): T | undefined;
  export function inject<T>(key: InjectionKey<T>, defaultValue: T): T;
  export function inject<T>(key: string): T | undefined;
  export function provide<T>(
    key: InjectionKey<T> | string,
    value: T,
  ): void;
}
