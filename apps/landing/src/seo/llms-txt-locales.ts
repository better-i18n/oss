/**
 * Localized strings for per-locale llms.txt generation.
 *
 * Each locale gets a translated tagline, about paragraph, and section headings
 * so that AI crawlers consuming /{locale}/llms.txt receive context in the
 * target language.
 *
 * Technical terms (framework names, "i18n", "l10n", "TMS") are kept in English
 * as they are universal industry abbreviations.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface LlmsLocaleStrings {
  /** One-line product tagline */
  readonly tagline: string;
  /** Multi-sentence about paragraph */
  readonly about: string;
  /** Section heading translations */
  readonly headings: Readonly<Record<SectionKey, string>>;
}

export type SectionKey =
  | "keyPages"
  | "solutionsByRole"
  | "solutionsByIndustry"
  | "frameworkGuides"
  | "comparisons"
  | "educationalContent"
  | "localizationGuides"
  | "multilingualSeoGuides"
  | "developerTools"
  | "blogPosts"
  | "externalLinks";

// ─── English (default / fallback) ───────────────────────────────────

const en: LlmsLocaleStrings = {
  tagline: "AI-powered localization platform for developers and product teams. Ship multilingual apps faster with automated translations, context-aware AI, and seamless framework integrations.",
  about: "Better i18n is a translation management system (TMS) that combines AI-powered translations with developer-first tooling. It supports React, Next.js, Vue, Nuxt, Angular, Svelte, and Expo (React Native) through official SDK packages. The platform provides context-rich translation environments for translators, automated sync for developers, and hassle-free localization management for product teams.",
  headings: {
    keyPages: "Key Pages",
    solutionsByRole: "Solutions by Role",
    solutionsByIndustry: "Solutions by Industry",
    frameworkGuides: "Framework Guides",
    comparisons: "Comparisons",
    educationalContent: "Educational Content",
    localizationGuides: "Localization Guides",
    multilingualSeoGuides: "Multilingual SEO Guides",
    developerTools: "Developer Tools",
    blogPosts: "Blog Posts",
    externalLinks: "External Links",
  },
};

// ─── Locale data ────────────────────────────────────────────────────

const LOCALE_STRINGS: Readonly<Record<string, LlmsLocaleStrings>> = {
  en,
  tr: {
    tagline: "Geliştiriciler ve ürün ekipleri için yapay zeka destekli yerelleştirme platformu. Otomatik çeviriler, bağlam duyarlı yapay zeka ve kusursuz framework entegrasyonlarıyla çok dilli uygulamaları daha hızlı yayınlayın.",
    about: "Better i18n, yapay zeka destekli çevirileri geliştirici odaklı araçlarla birleştiren bir çeviri yönetim sistemidir (TMS). React, Next.js, Vue, Nuxt, Angular, Svelte ve Expo (React Native) için resmi SDK paketleri sunar. Platform, çevirmenler için bağlam zengin çeviri ortamları, geliştiriciler için otomatik senkronizasyon ve ürün ekipleri için sorunsuz yerelleştirme yönetimi sağlar.",
    headings: {
      keyPages: "Ana Sayfalar",
      solutionsByRole: "Rollere Göre Çözümler",
      solutionsByIndustry: "Sektöre Göre Çözümler",
      frameworkGuides: "Framework Rehberleri",
      comparisons: "Karşılaştırmalar",
      educationalContent: "Eğitim İçerikleri",
      localizationGuides: "Yerelleştirme Rehberleri",
      multilingualSeoGuides: "Çok Dilli SEO Rehberleri",
      developerTools: "Geliştirici Araçları",
      blogPosts: "Blog Yazıları",
      externalLinks: "Harici Bağlantılar",
    },
  },
  de: {
    tagline: "KI-gestützte Lokalisierungsplattform für Entwickler und Produktteams. Liefern Sie mehrsprachige Apps schneller mit automatisierten Übersetzungen, kontextbewusster KI und nahtlosen Framework-Integrationen.",
    about: "Better i18n ist ein Übersetzungsmanagementsystem (TMS), das KI-gestützte Übersetzungen mit entwicklerorientierten Werkzeugen kombiniert. Es unterstützt React, Next.js, Vue, Nuxt, Angular, Svelte und Expo (React Native) über offizielle SDK-Pakete. Die Plattform bietet kontextreiche Übersetzungsumgebungen für Übersetzer, automatische Synchronisierung für Entwickler und unkompliziertes Lokalisierungsmanagement für Produktteams.",
    headings: {
      keyPages: "Wichtige Seiten",
      solutionsByRole: "Lösungen nach Rolle",
      solutionsByIndustry: "Lösungen nach Branche",
      frameworkGuides: "Framework-Anleitungen",
      comparisons: "Vergleiche",
      educationalContent: "Bildungsinhalte",
      localizationGuides: "Lokalisierungsleitfäden",
      multilingualSeoGuides: "Mehrsprachige SEO-Leitfäden",
      developerTools: "Entwickler-Tools",
      blogPosts: "Blog-Beiträge",
      externalLinks: "Externe Links",
    },
  },
  fr: {
    tagline: "Plateforme de localisation alimentée par l'IA pour les développeurs et les équipes produit. Livrez des applications multilingues plus rapidement grâce aux traductions automatisées, à l'IA contextuelle et aux intégrations transparentes.",
    about: "Better i18n est un système de gestion de traductions (TMS) qui combine des traductions alimentées par l'IA avec des outils pensés pour les développeurs. Il prend en charge React, Next.js, Vue, Nuxt, Angular, Svelte et Expo (React Native) via des packages SDK officiels. La plateforme offre des environnements de traduction riches en contexte pour les traducteurs, une synchronisation automatique pour les développeurs et une gestion de localisation simplifiée pour les équipes produit.",
    headings: {
      keyPages: "Pages principales",
      solutionsByRole: "Solutions par rôle",
      solutionsByIndustry: "Solutions par secteur",
      frameworkGuides: "Guides des frameworks",
      comparisons: "Comparaisons",
      educationalContent: "Contenu éducatif",
      localizationGuides: "Guides de localisation",
      multilingualSeoGuides: "Guides SEO multilingue",
      developerTools: "Outils pour développeurs",
      blogPosts: "Articles de blog",
      externalLinks: "Liens externes",
    },
  },
  es: {
    tagline: "Plataforma de localización impulsada por IA para desarrolladores y equipos de producto. Lanza aplicaciones multilingües más rápido con traducciones automatizadas, IA contextual e integraciones de frameworks.",
    about: "Better i18n es un sistema de gestión de traducciones (TMS) que combina traducciones impulsadas por IA con herramientas orientadas al desarrollador. Es compatible con React, Next.js, Vue, Nuxt, Angular, Svelte y Expo (React Native) a través de paquetes SDK oficiales. La plataforma ofrece entornos de traducción ricos en contexto para traductores, sincronización automática para desarrolladores y gestión de localización sin complicaciones para equipos de producto.",
    headings: {
      keyPages: "Páginas principales",
      solutionsByRole: "Soluciones por rol",
      solutionsByIndustry: "Soluciones por sector",
      frameworkGuides: "Guías de frameworks",
      comparisons: "Comparaciones",
      educationalContent: "Contenido educativo",
      localizationGuides: "Guías de localización",
      multilingualSeoGuides: "Guías de SEO multilingüe",
      developerTools: "Herramientas para desarrolladores",
      blogPosts: "Artículos del blog",
      externalLinks: "Enlaces externos",
    },
  },
  pt: {
    tagline: "Plataforma de localização com IA para desenvolvedores e equipes de produto. Lance aplicativos multilíngues mais rápido com traduções automatizadas, IA contextual e integrações de frameworks.",
    about: "Better i18n é um sistema de gestão de traduções (TMS) que combina traduções com IA e ferramentas focadas no desenvolvedor. Suporta React, Next.js, Vue, Nuxt, Angular, Svelte e Expo (React Native) através de pacotes SDK oficiais. A plataforma oferece ambientes de tradução ricos em contexto para tradutores, sincronização automática para desenvolvedores e gestão de localização simplificada para equipes de produto.",
    headings: {
      keyPages: "Páginas principais",
      solutionsByRole: "Soluções por função",
      solutionsByIndustry: "Soluções por setor",
      frameworkGuides: "Guias de frameworks",
      comparisons: "Comparações",
      educationalContent: "Conteúdo educacional",
      localizationGuides: "Guias de localização",
      multilingualSeoGuides: "Guias de SEO multilíngue",
      developerTools: "Ferramentas para desenvolvedores",
      blogPosts: "Artigos do blog",
      externalLinks: "Links externos",
    },
  },
  it: {
    tagline: "Piattaforma di localizzazione basata su IA per sviluppatori e team di prodotto. Rilascia app multilingue più velocemente con traduzioni automatiche, IA contestuale e integrazioni di framework.",
    about: "Better i18n è un sistema di gestione delle traduzioni (TMS) che combina traduzioni basate su IA con strumenti pensati per gli sviluppatori. Supporta React, Next.js, Vue, Nuxt, Angular, Svelte ed Expo (React Native) tramite pacchetti SDK ufficiali. La piattaforma offre ambienti di traduzione ricchi di contesto per i traduttori, sincronizzazione automatica per gli sviluppatori e gestione della localizzazione semplificata per i team di prodotto.",
    headings: {
      keyPages: "Pagine principali",
      solutionsByRole: "Soluzioni per ruolo",
      solutionsByIndustry: "Soluzioni per settore",
      frameworkGuides: "Guide ai framework",
      comparisons: "Confronti",
      educationalContent: "Contenuti educativi",
      localizationGuides: "Guide alla localizzazione",
      multilingualSeoGuides: "Guide SEO multilingue",
      developerTools: "Strumenti per sviluppatori",
      blogPosts: "Articoli del blog",
      externalLinks: "Link esterni",
    },
  },
  nl: {
    tagline: "AI-gedreven lokalisatieplatform voor ontwikkelaars en productteams. Lever meertalige apps sneller op met geautomatiseerde vertalingen, contextbewuste AI en naadloze framework-integraties.",
    about: "Better i18n is een vertaalbeheersysteem (TMS) dat AI-vertalingen combineert met tools gericht op ontwikkelaars. Het ondersteunt React, Next.js, Vue, Nuxt, Angular, Svelte en Expo (React Native) via officiële SDK-pakketten. Het platform biedt contextrijke vertaalomgevingen voor vertalers, automatische synchronisatie voor ontwikkelaars en probleemloze lokalisatie voor productteams.",
    headings: {
      keyPages: "Belangrijke pagina's",
      solutionsByRole: "Oplossingen per rol",
      solutionsByIndustry: "Oplossingen per sector",
      frameworkGuides: "Framework-handleidingen",
      comparisons: "Vergelijkingen",
      educationalContent: "Educatieve inhoud",
      localizationGuides: "Lokalisatiegidsen",
      multilingualSeoGuides: "Meertalige SEO-gidsen",
      developerTools: "Ontwikkelaarstools",
      blogPosts: "Blogberichten",
      externalLinks: "Externe links",
    },
  },
  pl: {
    tagline: "Platforma lokalizacyjna oparta na AI dla programistów i zespołów produktowych. Wydawaj wielojęzyczne aplikacje szybciej dzięki automatycznym tłumaczeniom, kontekstowej AI i bezproblemowym integracjom z frameworkami.",
    about: "Better i18n to system zarządzania tłumaczeniami (TMS), który łączy tłumaczenia oparte na AI z narzędziami dla programistów. Obsługuje React, Next.js, Vue, Nuxt, Angular, Svelte i Expo (React Native) poprzez oficjalne pakiety SDK. Platforma zapewnia kontekstowe środowiska tłumaczeniowe dla tłumaczy, automatyczną synchronizację dla programistów i bezproblemowe zarządzanie lokalizacją dla zespołów produktowych.",
    headings: {
      keyPages: "Kluczowe strony",
      solutionsByRole: "Rozwiązania według roli",
      solutionsByIndustry: "Rozwiązania według branży",
      frameworkGuides: "Przewodniki po frameworkach",
      comparisons: "Porównania",
      educationalContent: "Treści edukacyjne",
      localizationGuides: "Przewodniki lokalizacji",
      multilingualSeoGuides: "Przewodniki wielojęzycznego SEO",
      developerTools: "Narzędzia deweloperskie",
      blogPosts: "Wpisy na blogu",
      externalLinks: "Linki zewnętrzne",
    },
  },
  cs: {
    tagline: "Lokalizační platforma poháněná AI pro vývojáře a produktové týmy. Dodávejte vícejazyčné aplikace rychleji s automatizovanými překlady, kontextovou AI a bezproblémovými integracemi frameworků.",
    about: "Better i18n je systém správy překladů (TMS), který kombinuje překlady poháněné AI s nástroji orientovanými na vývojáře. Podporuje React, Next.js, Vue, Nuxt, Angular, Svelte a Expo (React Native) prostřednictvím oficiálních SDK balíčků. Platforma poskytuje kontextově bohatá překladatelská prostředí pro překladatele, automatickou synchronizaci pro vývojáře a bezstarostnou správu lokalizace pro produktové týmy.",
    headings: {
      keyPages: "Klíčové stránky",
      solutionsByRole: "Řešení podle role",
      solutionsByIndustry: "Řešení podle odvětví",
      frameworkGuides: "Průvodci frameworky",
      comparisons: "Srovnání",
      educationalContent: "Vzdělávací obsah",
      localizationGuides: "Průvodci lokalizací",
      multilingualSeoGuides: "Průvodci vícejazyčným SEO",
      developerTools: "Vývojářské nástroje",
      blogPosts: "Blogové příspěvky",
      externalLinks: "Externí odkazy",
    },
  },
  ja: {
    tagline: "開発者とプロダクトチームのためのAI搭載ローカライゼーションプラットフォーム。自動翻訳、コンテキスト認識AI、シームレスなフレームワーク統合で多言語アプリをより速くリリース。",
    about: "Better i18nは、AI翻訳と開発者向けツールを組み合わせた翻訳管理システム（TMS）です。公式SDKパッケージを通じてReact、Next.js、Vue、Nuxt、Angular、Svelte、Expo（React Native）をサポートしています。翻訳者向けのコンテキスト豊富な翻訳環境、開発者向けの自動同期、プロダクトチーム向けの手間のかからないローカライゼーション管理を提供します。",
    headings: {
      keyPages: "主要ページ",
      solutionsByRole: "役割別ソリューション",
      solutionsByIndustry: "業種別ソリューション",
      frameworkGuides: "フレームワークガイド",
      comparisons: "比較",
      educationalContent: "教育コンテンツ",
      localizationGuides: "ローカライゼーションガイド",
      multilingualSeoGuides: "多言語SEOガイド",
      developerTools: "開発者ツール",
      blogPosts: "ブログ記事",
      externalLinks: "外部リンク",
    },
  },
  ko: {
    tagline: "개발자와 프로덕트 팀을 위한 AI 기반 현지화 플랫폼. 자동 번역, 컨텍스트 인식 AI, 원활한 프레임워크 통합으로 다국어 앱을 더 빠르게 출시하세요.",
    about: "Better i18n은 AI 번역과 개발자 중심 도구를 결합한 번역 관리 시스템(TMS)입니다. 공식 SDK 패키지를 통해 React, Next.js, Vue, Nuxt, Angular, Svelte, Expo(React Native)를 지원합니다. 번역가를 위한 컨텍스트가 풍부한 번역 환경, 개발자를 위한 자동 동기화, 프로덕트 팀을 위한 간편한 현지화 관리를 제공합니다.",
    headings: {
      keyPages: "주요 페이지",
      solutionsByRole: "역할별 솔루션",
      solutionsByIndustry: "산업별 솔루션",
      frameworkGuides: "프레임워크 가이드",
      comparisons: "비교",
      educationalContent: "교육 콘텐츠",
      localizationGuides: "현지화 가이드",
      multilingualSeoGuides: "다국어 SEO 가이드",
      developerTools: "개발자 도구",
      blogPosts: "블로그 포스트",
      externalLinks: "외부 링크",
    },
  },
  zh: {
    tagline: "面向开发者和产品团队的AI驱动本地化平台。通过自动翻译、上下文感知AI和无缝框架集成，更快地发布多语言应用。",
    about: "Better i18n是一个翻译管理系统（TMS），将AI翻译与面向开发者的工具相结合。通过官方SDK包支持React、Next.js、Vue、Nuxt、Angular、Svelte和Expo（React Native）。平台为翻译人员提供上下文丰富的翻译环境，为开发者提供自动同步，为产品团队提供便捷的本地化管理。",
    headings: {
      keyPages: "主要页面",
      solutionsByRole: "按角色分类的解决方案",
      solutionsByIndustry: "按行业分类的解决方案",
      frameworkGuides: "框架指南",
      comparisons: "对比",
      educationalContent: "教育内容",
      localizationGuides: "本地化指南",
      multilingualSeoGuides: "多语言SEO指南",
      developerTools: "开发者工具",
      blogPosts: "博客文章",
      externalLinks: "外部链接",
    },
  },
  ar: {
    tagline: "منصة توطين مدعومة بالذكاء الاصطناعي للمطورين وفرق المنتجات. أطلق التطبيقات متعددة اللغات بشكل أسرع مع الترجمات الآلية والذكاء الاصطناعي السياقي والتكاملات السلسة.",
    about: "Better i18n هو نظام إدارة الترجمة (TMS) يجمع بين الترجمات المدعومة بالذكاء الاصطناعي والأدوات الموجهة للمطورين. يدعم React وNext.js وVue وNuxt وAngular وSvelte وExpo (React Native) من خلال حزم SDK الرسمية. توفر المنصة بيئات ترجمة غنية بالسياق للمترجمين، ومزامنة آلية للمطورين، وإدارة توطين سهلة لفرق المنتجات.",
    headings: {
      keyPages: "الصفحات الرئيسية",
      solutionsByRole: "حلول حسب الدور",
      solutionsByIndustry: "حلول حسب القطاع",
      frameworkGuides: "أدلة أطر العمل",
      comparisons: "المقارنات",
      educationalContent: "المحتوى التعليمي",
      localizationGuides: "أدلة التوطين",
      multilingualSeoGuides: "أدلة SEO متعدد اللغات",
      developerTools: "أدوات المطورين",
      blogPosts: "مقالات المدونة",
      externalLinks: "روابط خارجية",
    },
  },
  hi: {
    tagline: "डेवलपर्स और प्रोडक्ट टीमों के लिए AI-संचालित स्थानीयकरण प्लेटफ़ॉर्म। स्वचालित अनुवाद, संदर्भ-जागरूक AI और सहज फ्रेमवर्क एकीकरण के साथ बहुभाषी ऐप्स तेज़ी से लॉन्च करें।",
    about: "Better i18n एक अनुवाद प्रबंधन प्रणाली (TMS) है जो AI-संचालित अनुवादों को डेवलपर-प्रथम टूलिंग के साथ जोड़ती है। यह आधिकारिक SDK पैकेज के माध्यम से React, Next.js, Vue, Nuxt, Angular, Svelte और Expo (React Native) का समर्थन करती है। प्लेटफ़ॉर्म अनुवादकों के लिए संदर्भ-समृद्ध अनुवाद वातावरण, डेवलपर्स के लिए स्वचालित सिंक्रनाइज़ेशन और प्रोडक्ट टीमों के लिए सहज स्थानीयकरण प्रबंधन प्रदान करता है।",
    headings: {
      keyPages: "मुख्य पृष्ठ",
      solutionsByRole: "भूमिका के अनुसार समाधान",
      solutionsByIndustry: "उद्योग के अनुसार समाधान",
      frameworkGuides: "फ्रेमवर्क गाइड",
      comparisons: "तुलनाएँ",
      educationalContent: "शैक्षिक सामग्री",
      localizationGuides: "स्थानीयकरण गाइड",
      multilingualSeoGuides: "बहुभाषी SEO गाइड",
      developerTools: "डेवलपर टूल्स",
      blogPosts: "ब्लॉग पोस्ट",
      externalLinks: "बाहरी लिंक",
    },
  },
  ru: {
    tagline: "Платформа локализации на базе ИИ для разработчиков и продуктовых команд. Выпускайте мультиязычные приложения быстрее с автоматизированными переводами, контекстным ИИ и бесшовными интеграциями фреймворков.",
    about: "Better i18n — это система управления переводами (TMS), объединяющая ИИ-переводы с инструментами для разработчиков. Поддерживает React, Next.js, Vue, Nuxt, Angular, Svelte и Expo (React Native) через официальные SDK-пакеты. Платформа предоставляет контекстно-богатые среды перевода для переводчиков, автоматическую синхронизацию для разработчиков и удобное управление локализацией для продуктовых команд.",
    headings: {
      keyPages: "Ключевые страницы",
      solutionsByRole: "Решения по ролям",
      solutionsByIndustry: "Решения по отраслям",
      frameworkGuides: "Руководства по фреймворкам",
      comparisons: "Сравнения",
      educationalContent: "Образовательный контент",
      localizationGuides: "Руководства по локализации",
      multilingualSeoGuides: "Руководства по мультиязычному SEO",
      developerTools: "Инструменты разработчика",
      blogPosts: "Статьи блога",
      externalLinks: "Внешние ссылки",
    },
  },
  uk: {
    tagline: "Платформа локалізації на базі ШІ для розробників і продуктових команд. Випускайте багатомовні додатки швидше з автоматизованими перекладами, контекстним ШІ та безшовними інтеграціями фреймворків.",
    about: "Better i18n — це система управління перекладами (TMS), що поєднує переклади на базі ШІ з інструментами для розробників. Підтримує React, Next.js, Vue, Nuxt, Angular, Svelte та Expo (React Native) через офіційні SDK-пакети. Платформа надає контекстно-багаті середовища перекладу для перекладачів, автоматичну синхронізацію для розробників та зручне управління локалізацією для продуктових команд.",
    headings: {
      keyPages: "Ключові сторінки",
      solutionsByRole: "Рішення за ролями",
      solutionsByIndustry: "Рішення за галузями",
      frameworkGuides: "Посібники з фреймворків",
      comparisons: "Порівняння",
      educationalContent: "Освітній контент",
      localizationGuides: "Посібники з локалізації",
      multilingualSeoGuides: "Посібники з багатомовного SEO",
      developerTools: "Інструменти розробника",
      blogPosts: "Статті блогу",
      externalLinks: "Зовнішні посилання",
    },
  },
  sv: {
    tagline: "AI-driven lokaliseringsplattform för utvecklare och produktteam. Leverera flerspråkiga appar snabbare med automatiserade översättningar, kontextmedveten AI och sömlösa ramverksintegrationer.",
    about: "Better i18n är ett översättningshanteringssystem (TMS) som kombinerar AI-drivna översättningar med utvecklarfokuserade verktyg. Det stödjer React, Next.js, Vue, Nuxt, Angular, Svelte och Expo (React Native) genom officiella SDK-paket. Plattformen erbjuder kontextrika översättningsmiljöer för översättare, automatisk synkronisering för utvecklare och smidig lokaliseringshantering för produktteam.",
    headings: {
      keyPages: "Viktiga sidor",
      solutionsByRole: "Lösningar per roll",
      solutionsByIndustry: "Lösningar per bransch",
      frameworkGuides: "Ramverksguider",
      comparisons: "Jämförelser",
      educationalContent: "Utbildningsinnehåll",
      localizationGuides: "Lokaliseringsguider",
      multilingualSeoGuides: "Flerspråkiga SEO-guider",
      developerTools: "Utvecklarverktyg",
      blogPosts: "Blogginlägg",
      externalLinks: "Externa länkar",
    },
  },
  da: {
    tagline: "AI-drevet lokaliseringsplatform til udviklere og produktteams. Lever flersprogede apps hurtigere med automatiserede oversættelser, kontekstbevidst AI og problemfri framework-integrationer.",
    about: "Better i18n er et oversættelsesstyringssystem (TMS), der kombinerer AI-drevne oversættelser med udviklerfokuserede værktøjer. Det understøtter React, Next.js, Vue, Nuxt, Angular, Svelte og Expo (React Native) gennem officielle SDK-pakker. Platformen tilbyder kontekstrige oversættelsesmiljøer til oversættere, automatisk synkronisering til udviklere og ubesværet lokaliseringsstyring til produktteams.",
    headings: {
      keyPages: "Vigtige sider",
      solutionsByRole: "Løsninger efter rolle",
      solutionsByIndustry: "Løsninger efter branche",
      frameworkGuides: "Framework-guider",
      comparisons: "Sammenligninger",
      educationalContent: "Uddannelsesindhold",
      localizationGuides: "Lokaliseringsguider",
      multilingualSeoGuides: "Flersprogede SEO-guider",
      developerTools: "Udviklerværktøjer",
      blogPosts: "Blogindlæg",
      externalLinks: "Eksterne links",
    },
  },
  fi: {
    tagline: "Tekoälykäyttöinen lokalisointialusta kehittäjille ja tuotetiimeille. Julkaise monikielisiä sovelluksia nopeammin automaattisten käännösten, kontekstitietoisen tekoälyn ja saumattomien kehysintegraatioiden avulla.",
    about: "Better i18n on käännöstenhallintajärjestelmä (TMS), joka yhdistää tekoälypohjaiset käännökset kehittäjäkeskeisiin työkaluihin. Se tukee Reactia, Next.js:ää, Vue:ta, Nuxtia, Angularia, Svelteä ja Expoa (React Native) virallisten SDK-pakettien kautta. Alusta tarjoaa kääntäjille kontekstirikkaat käännösympäristöt, kehittäjille automaattisen synkronoinnin ja tuotetiimeille vaivattoman lokalisoinnin hallinnan.",
    headings: {
      keyPages: "Tärkeimmät sivut",
      solutionsByRole: "Ratkaisut roolin mukaan",
      solutionsByIndustry: "Ratkaisut toimialan mukaan",
      frameworkGuides: "Kehysoppaat",
      comparisons: "Vertailut",
      educationalContent: "Koulutussisältö",
      localizationGuides: "Lokalisointioppaat",
      multilingualSeoGuides: "Monikieliset SEO-oppaat",
      developerTools: "Kehittäjätyökalut",
      blogPosts: "Blogikirjoitukset",
      externalLinks: "Ulkoiset linkit",
    },
  },
  nb: {
    tagline: "AI-drevet lokaliseringsplattform for utviklere og produktteam. Lever flerspråklige apper raskere med automatiserte oversettelser, kontekstbevisst AI og sømløse rammeverkintegrasjoner.",
    about: "Better i18n er et oversettelseshåndteringssystem (TMS) som kombinerer AI-drevne oversettelser med utviklerfokuserte verktøy. Det støtter React, Next.js, Vue, Nuxt, Angular, Svelte og Expo (React Native) gjennom offisielle SDK-pakker. Plattformen tilbyr kontekstrike oversettelsesmiljøer for oversettere, automatisk synkronisering for utviklere og problemfri lokaliseringshåndtering for produktteam.",
    headings: {
      keyPages: "Viktige sider",
      solutionsByRole: "Løsninger etter rolle",
      solutionsByIndustry: "Løsninger etter bransje",
      frameworkGuides: "Rammeverksguider",
      comparisons: "Sammenligninger",
      educationalContent: "Utdanningsinnhold",
      localizationGuides: "Lokaliseringsguider",
      multilingualSeoGuides: "Flerspråklige SEO-guider",
      developerTools: "Utviklerverktøy",
      blogPosts: "Blogginnlegg",
      externalLinks: "Eksterne lenker",
    },
  },
  el: {
    tagline: "Πλατφόρμα τοπικοποίησης με τεχνητή νοημοσύνη για προγραμματιστές και ομάδες προϊόντος. Κυκλοφορήστε πολύγλωσσες εφαρμογές πιο γρήγορα με αυτοματοποιημένες μεταφράσεις, AI με επίγνωση πλαισίου και απρόσκοπτες ενσωματώσεις.",
    about: "Το Better i18n είναι ένα σύστημα διαχείρισης μεταφράσεων (TMS) που συνδυάζει μεταφράσεις με τεχνητή νοημοσύνη και εργαλεία για προγραμματιστές. Υποστηρίζει React, Next.js, Vue, Nuxt, Angular, Svelte και Expo (React Native) μέσω επίσημων πακέτων SDK. Η πλατφόρμα παρέχει περιβάλλοντα μετάφρασης πλούσια σε πλαίσιο για μεταφραστές, αυτόματο συγχρονισμό για προγραμματιστές και εύκολη διαχείριση τοπικοποίησης για ομάδες προϊόντος.",
    headings: {
      keyPages: "Βασικές σελίδες",
      solutionsByRole: "Λύσεις ανά ρόλο",
      solutionsByIndustry: "Λύσεις ανά κλάδο",
      frameworkGuides: "Οδηγοί framework",
      comparisons: "Συγκρίσεις",
      educationalContent: "Εκπαιδευτικό περιεχόμενο",
      localizationGuides: "Οδηγοί τοπικοποίησης",
      multilingualSeoGuides: "Οδηγοί πολύγλωσσου SEO",
      developerTools: "Εργαλεία προγραμματιστών",
      blogPosts: "Άρθρα ιστολογίου",
      externalLinks: "Εξωτερικοί σύνδεσμοι",
    },
  },
  th: {
    tagline: "แพลตฟอร์มการแปลภาษาที่ขับเคลื่อนด้วย AI สำหรับนักพัฒนาและทีมผลิตภัณฑ์ เปิดตัวแอปหลายภาษาได้เร็วขึ้นด้วยการแปลอัตโนมัติ AI ที่เข้าใจบริบท และการเชื่อมต่อเฟรมเวิร์กอย่างไร้รอยต่อ",
    about: "Better i18n เป็นระบบจัดการการแปล (TMS) ที่ผสมผสานการแปลด้วย AI เข้ากับเครื่องมือสำหรับนักพัฒนา รองรับ React, Next.js, Vue, Nuxt, Angular, Svelte และ Expo (React Native) ผ่านแพ็กเกจ SDK อย่างเป็นทางการ แพลตฟอร์มมอบสภาพแวดล้อมการแปลที่อุดมด้วยบริบทสำหรับนักแปล การซิงค์อัตโนมัติสำหรับนักพัฒนา และการจัดการการแปลที่ง่ายดายสำหรับทีมผลิตภัณฑ์",
    headings: {
      keyPages: "หน้าสำคัญ",
      solutionsByRole: "โซลูชันตามบทบาท",
      solutionsByIndustry: "โซลูชันตามอุตสาหกรรม",
      frameworkGuides: "คู่มือเฟรมเวิร์ก",
      comparisons: "การเปรียบเทียบ",
      educationalContent: "เนื้อหาเพื่อการศึกษา",
      localizationGuides: "คู่มือการแปลภาษา",
      multilingualSeoGuides: "คู่มือ SEO หลายภาษา",
      developerTools: "เครื่องมือนักพัฒนา",
      blogPosts: "บทความบล็อก",
      externalLinks: "ลิงก์ภายนอก",
    },
  },
};

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Returns localized strings for the given locale, falling back to English.
 */
export function getLocaleStrings(locale: string): LlmsLocaleStrings {
  return LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en ?? en;
}
