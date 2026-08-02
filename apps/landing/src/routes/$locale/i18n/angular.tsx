import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  CodeExample,
  LibraryIntegration,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { CoreSdkFlow } from "@/components/framework/SdkFlow";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Angular i18n.
 *
 * This page used to document `@better-i18n/angular` — `BetterI18nModule.forRoot()`
 * and a `TranslateService` imported from it. No such package exists
 * (`oss/packages/`: core, use-intl, next, expo, server, remix, vite, cli, sdk,
 * mcp, flutter), so all four samples on the page were unrunnable.
 *
 * The honest replacement, and why it is this shape:
 *   - Angular's built-in i18n (`@angular/localize`) is COMPILE-time: it produces
 *     one bundle per locale, so runtime CDN messages fundamentally do not fit it.
 *     That is stated on the page rather than glossed over.
 *   - The runtime path Angular teams actually use is `@ngx-translate/core` with a
 *     custom `TranslateLoader`, whose contract is
 *     `getTranslation(lang): Observable<any>` — one rxjs `from()` around
 *     `getMessages(lang)` and the integration is done.
 *   - `@better-i18n/core` has zero dependencies (packages/core/package.json
 *     `dependencies: {}`), so it runs in the browser and in Angular Universal
 *     alike. `getMessages` / `getLanguages` are the real methods
 *     (packages/core/src/cdn.ts:796-799).
 */

export const Route = createFileRoute("/$locale/i18n/angular")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nAngular",
      pathname: "/i18n/angular",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Angular",
        frameworkDescription:
          "Angular internationalization with ngx-translate and Better I18N: a custom TranslateLoader backed by @better-i18n/core, CDN-delivered translations, and runtime locale switching without a per-locale build.",
        dependencies: ["@angular/core", "@ngx-translate/core", "@better-i18n/core"],
      },
    });
  },
  component: AngularI18nPage,
});

const INSTALL_CODE = `npm install @ngx-translate/core @better-i18n/core

# @better-i18n/core ships zero dependencies —
# it is the same client our React SDKs are built on.`;

const LOADER_CODE = `import { Injectable } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { createI18nCore } from '@better-i18n/core'
import { from, Observable } from 'rxjs'

// Module scope: the 60s in-memory cache lives on the instance, so one
// client per app — not one per component.
const betterI18n = createI18nCore({
  projectId: 'your-org/your-project', // Settings → General → Project ID
  defaultLocale: 'en',
})

@Injectable({ providedIn: 'root' })
export class BetterI18nLoader implements TranslateLoader {
  // TranslateLoader's contract: one Observable of messages per language.
  getTranslation(lang: string): Observable<Record<string, unknown>> {
    return from(betterI18n.getMessages(lang))
  }
}

export { betterI18n }`;

const PROVIDE_CODE = `import { bootstrapApplication } from '@angular/platform-browser'
import { importProvidersFrom } from '@angular/core'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { AppComponent } from './app/app.component'
import { BetterI18nLoader } from './app/better-i18n.loader'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: { provide: TranslateLoader, useClass: BetterI18nLoader },
      })
    ),
  ],
})`;

const SWITCH_CODE = `import { Component, inject } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { betterI18n } from './better-i18n.loader'

@Component({
  selector: 'app-locale-switcher',
  standalone: true,
  imports: [TranslateModule],
  template: \`
    <select (change)="switchTo($any($event.target).value)">
      <option *ngFor="let l of languages" [value]="l.code">{{ l.name }}</option>
    </select>
  \`,
})
export class LocaleSwitcherComponent {
  private translate = inject(TranslateService)
  languages: { code: string; name: string }[] = []

  async ngOnInit() {
    // Locales come from the project manifest, not a hardcoded array.
    this.languages = await betterI18n.getLanguages()
  }

  switchTo(lang: string) {
    // use() calls the loader, which hits the cache or the CDN.
    this.translate.use(lang)
  }
}`;

const TEMPLATE_CODE = `<!-- app.component.html -->
<h1>{{ 'home.title' | translate }}</h1>
<p>{{ 'home.greeting' | translate: { name: 'World' } }}</p>

<!-- ICU plurals authored in the Better i18n dashboard -->
<p>{{ 'cart.items' | translate: { count: 3 } }}</p>

<app-locale-switcher />`;

function AngularI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.angular.features.standalone"),
    t("i18n.angular.features.signals"),
    t("i18n.angular.features.pipes"),
    t("i18n.angular.features.directives"),
    t("i18n.angular.features.services"),
    t("i18n.angular.features.lazyLoading"),
    t("i18n.angular.features.ssr"),
    t("i18n.angular.features.aot"),
    t("i18n.angular.features.cli"),
  ];

  const libraries = [
    {
      name: "@ngx-translate/core",
      description: t("i18n.angular.libraries.ngxTranslate.description"),
      integrationText: t("i18n.angular.libraries.ngxTranslate.integration"),
    },
    {
      name: "Angular i18n (built-in)",
      description: t("i18n.angular.libraries.builtIn.description"),
      integrationText: t("i18n.angular.libraries.builtIn.integration"),
    },
    {
      name: "Transloco",
      description: t("i18n.angular.libraries.transloco.description"),
      integrationText: t("i18n.angular.libraries.transloco.integration"),
    },
  ];

  const relatedLinks = [
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.angular.related.react") },
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.angular.related.vue") },
    { title: t("i18n.angular.related.comparisons"), to: "/$locale/compare", description: t("i18n.angular.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.angular.hero.title")}
        subtitle={t("i18n.angular.hero.subtitle")}
        badgeText="Angular i18n"
      />

      <SetupGuide
        icon="rocket"
        eyebrow="Setup"
        title={t("i18n.angular.setup.title")}
        subtitle={t("i18n.angular.setup.subtitle")}
        steps={[
          {
            step: 1,
            title: t("i18n.angular.setup.step1.title"),
            description: t("i18n.angular.setup.step1.description"),
            code: INSTALL_CODE,
            fileName: "terminal",
            language: "bash",
          },
          {
            step: 2,
            title: t("i18n.angular.setup.step2.title"),
            description: t("i18n.angular.setup.step2.description"),
            code: LOADER_CODE,
            fileName: "src/app/better-i18n.loader.ts",
            language: "ts",
          },
          {
            step: 3,
            title: t("i18n.angular.setup.step3.title"),
            description: t("i18n.angular.setup.step3.description"),
            code: PROVIDE_CODE,
            fileName: "src/main.ts",
            language: "ts",
          },
        ]}
      />

      <CoreSdkFlow
        title={t("i18n.angular.flow.title")}
        subtitle={t("i18n.angular.flow.subtitle")}
        appTitle="Your Angular app"
        appMeta="The translate pipe reads what TranslateService already loaded."
        clientMeta="getMessages(lang) inside the TranslateLoader — cached per language."
      />

      <CodeExample
        icon="code"
        eyebrow="Switching locale"
        title={t("i18n.angular.codeExample.title")}
        description={t("i18n.angular.codeExample.description")}
        code={SWITCH_CODE}
        fileName="src/app/locale-switcher.component.ts"
        language="ts"
      />

      <CodeExample
        icon="code-brackets"
        eyebrow="In a template"
        title={t("i18n.angular.template.title")}
        description={t("i18n.angular.template.subtitle")}
        code={TEMPLATE_CODE}
        fileName="src/app/app.component.html"
        language="html"
      />

      <FeatureList
        icon="zap"
        eyebrow="Capabilities"
        title={t("i18n.angular.featuresTitle")}
        features={features}
      />

      <LibraryIntegration
        icon="api-connection"
        eyebrow="Works with"
        title={t("i18n.angular.librariesTitle")}
        subtitle={t("i18n.angular.librariesSubtitle")}
        libraries={libraries}
      />

      <ComparisonRelatedTopics heading={t("i18n.angular.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.angular.otherFrameworks")}
        currentFramework="angular"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.angular.cta.title")}
        subtitle={t("i18n.angular.cta.subtitle")}
        primaryCTA={t("i18n.angular.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.angular.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/quick-start"
      />
    </MarketingLayout>
  );
}
