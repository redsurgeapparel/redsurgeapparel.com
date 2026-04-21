// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
interface Window {
  dataLayer: any[];
}

declare function gtag(...args: any[]): void;
