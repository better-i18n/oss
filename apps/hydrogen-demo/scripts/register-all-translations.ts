/**
 * Registers all translations (product, collection, option names) in Shopify via Admin API.
 * Run: bun scripts/register-all-translations.ts
 */
export {};

const SHOP = "better-i18n.myshopify.com";
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API = `https://${SHOP}/admin/api/2026-01/graphql.json`;

// ─── Resource IDs ────────────────────────────────────────────────────────────
const PRODUCT_ID = "gid://shopify/Product/9209744621783";
const COLLECTION_ID = "gid://shopify/Collection/484709957847";
const OPTION_BOYUT_ID = "gid://shopify/ProductOption/11584327155927";
const OPTION_RENK_ID = "gid://shopify/ProductOption/11584327188695";

// ─── Digests (from translatableContent API) ──────────────────────────────────
const PRODUCT_TITLE_DIGEST = "9d2fa515e0bb022c50bded45c895c2f9bcfaf28140c6a294d736730546b3693e";
const PRODUCT_BODY_DIGEST = "07988c1230e13bfc343a0dd833b1ad714d62bda11c37b090f13770bbdf597429";
const COLLECTION_TITLE_DIGEST = "11d58b08de98e05930a7f73b5f5d75367e4a58ac27335a420d55583cb16ad1ff";
const OPTION_BOYUT_DIGEST = "983d544e867b77ab3cb36c427dd4d9b5d3882cab009d4c3f24d20d045f1b347d";
const OPTION_RENK_DIGEST = "708170f044f8c653d15ed37546676c645f03ba05fa1d73cc761b1fefeaa1c821";

// ─── Translation data ─────────────────────────────────────────────────────────

const productTranslations: Record<string, { title: string; body_html: string }> = {
  tr: {
    title: "Nomad Basic Tişört",
    body_html: `<p>Uzaktan çalışanlar için tasarlanmış rahat günlük tişört.</p>
<p>• Yumuşak pamuklu kumaş<br>• Minimal göçebe tasarımı<br>• Nefes alabilen malzeme<br>• Seyahat ve ortak çalışma alanları için ideal</p>
<p>Malzeme: %100 pamuk &nbsp;<br>Kalıp: Regular fit &nbsp;<br>Dijital göçebeler için üretildi.</p>`,
  },
  de: {
    title: "Nomad Basic T-Shirt",
    body_html: `<p>Bequemes Alltags-T-Shirt, designed für Remote-Worker.</p>
<p>• Weiches Baumwollgewebe<br>• Minimalistisches Nomaden-Design<br>• Atmungsaktives Material<br>• Perfekt für Reisen und Coworking</p>
<p>Material: 100% Baumwolle &nbsp;<br>Passform: Regular Fit &nbsp;<br>Gemacht für digitale Nomaden.</p>`,
  },
  es: {
    title: "Camiseta Básica Nomad",
    body_html: `<p>Camiseta cómoda para el día a día, diseñada para trabajadores remotos.</p>
<p>• Tejido de algodón suave<br>• Diseño nómada minimalista<br>• Material transpirable<br>• Perfecta para viajes y coworking</p>
<p>Material: 100% algodón &nbsp;<br>Corte: Regular fit &nbsp;<br>Hecha para nómadas digitales.</p>`,
  },
  fr: {
    title: "T-shirt Basique Nomad",
    body_html: `<p>T-shirt confortable pour tous les jours, conçu pour les télétravailleurs.</p>
<p>• Tissu en coton doux<br>• Design nomade minimaliste<br>• Matière respirante<br>• Parfait pour les voyages et le coworking</p>
<p>Matière : 100 % coton &nbsp;<br>Coupe : Regular fit &nbsp;<br>Fait pour les nomades numériques.</p>`,
  },
  id: {
    title: "Kaos Basic Nomad",
    body_html: `<p>Kaos harian yang nyaman, dirancang untuk pekerja jarak jauh.</p>
<p>• Bahan katun lembut<br>• Desain nomad minimalis<br>• Material bernapas<br>• Sempurna untuk perjalanan dan coworking</p>
<p>Material: 100% katun &nbsp;<br>Potongan: Regular fit &nbsp;<br>Dibuat untuk nomad digital.</p>`,
  },
  it: {
    title: "T-shirt Basic Nomad",
    body_html: `<p>T-shirt comoda per tutti i giorni, progettata per chi lavora da remoto.</p>
<p>• Tessuto in cotone morbido<br>• Design nomade minimale<br>• Materiale traspirante<br>• Perfetta per viaggi e coworking</p>
<p>Materiale: 100% cotone &nbsp;<br>Vestibilità: Regular fit &nbsp;<br>Fatta per i nomadi digitali.</p>`,
  },
  ja: {
    title: "ノマドベーシックTシャツ",
    body_html: `<p>リモートワーカーのために設計された、快適な日常使いのTシャツ。</p>
<p>• 柔らかいコットン素材<br>• ミニマルなノマドデザイン<br>• 通気性の高い素材<br>• 旅行やコワーキングに最適</p>
<p>素材：コットン100% &nbsp;<br>フィット：レギュラーフィット &nbsp;<br>デジタルノマドのために作られました。</p>`,
  },
  ko: {
    title: "노마드 베이직 티셔츠",
    body_html: `<p>원격 근무자를 위해 설계된 편안한 일상 티셔츠.</p>
<p>• 부드러운 면 소재<br>• 미니멀한 노마드 디자인<br>• 통기성 소재<br>• 여행 및 코워킹에 적합</p>
<p>소재: 면 100% &nbsp;<br>핏: 레귤러 핏 &nbsp;<br>디지털 노마드를 위해 제작.</p>`,
  },
  "pt-br": {
    title: "Camiseta Básica Nomad",
    body_html: `<p>Camiseta confortável para o dia a dia, projetada para trabalhadores remotos.</p>
<p>• Tecido de algodão macio<br>• Design nômade minimalista<br>• Material respirável<br>• Perfeita para viagens e coworking</p>
<p>Material: 100% algodão &nbsp;<br>Caimento: Regular fit &nbsp;<br>Feita para nômades digitais.</p>`,
  },
  "zh-cn": {
    title: "游牧基础T恤",
    body_html: `<p>专为远程工作者设计的舒适日常T恤。</p>
<p>• 柔软棉质面料<br>• 简约游牧风格设计<br>• 透气材质<br>• 非常适合旅行和共享办公</p>
<p>材质：100%纯棉 &nbsp;<br>版型：常规版型 &nbsp;<br>专为数字游牧民族打造。</p>`,
  },
};

// Collection "Home page" translations
const collectionTranslations: Record<string, string> = {
  tr: "Ana Sayfa",
  de: "Startseite",
  es: "Página de inicio",
  fr: "Page d'accueil",
  id: "Halaman Utama",
  it: "Pagina principale",
  ja: "ホームページ",
  ko: "홈페이지",
  "pt-br": "Página inicial",
  "zh-cn": "首页",
};

// Option name "Boyut" (Size) translations
const boyutTranslations: Record<string, string> = {
  tr: "Boyut",
  de: "Größe",
  es: "Talla",
  fr: "Taille",
  id: "Ukuran",
  it: "Taglia",
  ja: "サイズ",
  ko: "사이즈",
  "pt-br": "Tamanho",
  "zh-cn": "尺寸",
};

// Option name "Renk" (Color) translations
const renkTranslations: Record<string, string> = {
  tr: "Renk",
  de: "Farbe",
  es: "Color",
  fr: "Couleur",
  id: "Warna",
  it: "Colore",
  ja: "カラー",
  ko: "색상",
  "pt-br": "Cor",
  "zh-cn": "颜色",
};

// ─── GraphQL helpers ──────────────────────────────────────────────────────────

const MUTATION = `
  mutation RegisterTranslations($id: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $id, translations: $translations) {
      userErrors { field message }
      translations { locale key value }
    }
  }
`;

async function gql(query: string, variables: object) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json() as Promise<{ data: Record<string, unknown>; errors?: unknown[] }>;
}

async function registerTranslations(
  resourceId: string,
  label: string,
  entries: { locale: string; key: string; value: string; digest: string }[],
) {
  const result = await gql(MUTATION, {
    id: resourceId,
    translations: entries.map(({ locale, key, value, digest }) => ({
      locale,
      key,
      value,
      translatableContentDigest: digest,
    })),
  });

  const { translationsRegister } = result.data as {
    translationsRegister: {
      userErrors: { message: string }[];
      translations: { locale: string; key: string }[];
    };
  };

  if (translationsRegister.userErrors.length > 0) {
    console.error(`❌ ${label}:`, translationsRegister.userErrors);
  } else {
    const summary = translationsRegister.translations
      .map((t) => t.locale)
      .join(", ");
    console.log(`✅ ${label}: ${summary}`);
  }
}

// ─── Run registrations ────────────────────────────────────────────────────────

console.log("=== Product (title + body_html) ===");
for (const [locale, { title, body_html }] of Object.entries(productTranslations)) {
  await registerTranslations(PRODUCT_ID, `product/${locale}`, [
    { locale, key: "title", value: title, digest: PRODUCT_TITLE_DIGEST },
    { locale, key: "body_html", value: body_html, digest: PRODUCT_BODY_DIGEST },
  ]);
}

console.log("\n=== Collection title ===");
const collectionEntries = Object.entries(collectionTranslations).map(([locale, value]) => ({
  locale,
  key: "title",
  value,
  digest: COLLECTION_TITLE_DIGEST,
}));
await registerTranslations(COLLECTION_ID, "collection/all-locales", collectionEntries);

console.log("\n=== Option: Boyut (Size) ===");
const boyutEntries = Object.entries(boyutTranslations).map(([locale, value]) => ({
  locale,
  key: "name",
  value,
  digest: OPTION_BOYUT_DIGEST,
}));
await registerTranslations(OPTION_BOYUT_ID, "option-boyut/all-locales", boyutEntries);

console.log("\n=== Option: Renk (Color) ===");
const renkEntries = Object.entries(renkTranslations).map(([locale, value]) => ({
  locale,
  key: "name",
  value,
  digest: OPTION_RENK_DIGEST,
}));
await registerTranslations(OPTION_RENK_ID, "option-renk/all-locales", renkEntries);

console.log("\n✓ All translations registered.");
