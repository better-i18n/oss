// Mock translation data for the landing page demo
// Mimics the structure from apps/app

export type TranslationStatus = "draft" | "published" | "pending" | "untranslated";

export interface MockTranslation {
  id: string;
  key: string;
  namespace: string;
  sourceText: string;
  sourceStatus: TranslationStatus;
  translations: {
    [languageCode: string]: { text: string; status: TranslationStatus };
  };
}

export interface MockNamespace {
  id: string;
  name: string;
  keys: MockTranslation[];
  progress: number;
  missingCount: number;
}

export const MOCK_NAMESPACES: MockNamespace[] = [
  {
    id: "ns-auth",
    name: "auth",
    progress: 80,
    missingCount: 1,
    keys: [
      {
        id: "key-1",
        key: "auth.signup.title",
        namespace: "auth",
        sourceText: "Create your account",
        sourceStatus: "published",
        translations: {
          tr: { text: "Hesabınızı oluşturun", status: "published" },
        },
      },
      {
        id: "key-2",
        key: "auth.signup.subtitle",
        namespace: "auth",
        sourceText: "Start your free trial today",
        sourceStatus: "published",
        translations: {
          tr: { text: "Ücretsiz denemenizi bugün başlatın", status: "published" },
        },
      },
      {
        id: "key-3",
        key: "auth.signup.email_label",
        namespace: "auth",
        sourceText: "Email address",
        sourceStatus: "published",
        translations: {
          tr: { text: "E-posta adresi", status: "published" },
        },
      },
      {
        id: "key-4",
        key: "auth.signup.password_label",
        namespace: "auth",
        sourceText: "Password",
        sourceStatus: "published",
        translations: {
          tr: { text: "Şifre", status: "published" },
        },
      },
      {
        id: "key-5",
        key: "auth.signup.submit",
        namespace: "auth",
        sourceText: "Sign up",
        sourceStatus: "published",
        translations: {
          tr: { text: "", status: "untranslated" },
        },
      },
    ],
  },
  {
    id: "ns-dashboard",
    name: "dashboard",
    progress: 100,
    missingCount: 0,
    keys: [
      {
        id: "key-6",
        key: "dashboard.welcome",
        namespace: "dashboard",
        sourceText: "Welcome back, {{name}}",
        sourceStatus: "published",
        translations: {
          tr: { text: "Tekrar hoş geldiniz, {{name}}", status: "published" },
        },
      },
      {
        id: "key-7",
        key: "dashboard.projects.title",
        namespace: "dashboard",
        sourceText: "Your Projects",
        sourceStatus: "published",
        translations: {
          tr: { text: "Projeleriniz", status: "published" },
        },
      },
      {
        id: "key-8",
        key: "dashboard.projects.empty",
        namespace: "dashboard",
        sourceText: "No projects yet. Create your first one!",
        sourceStatus: "published",
        translations: {
          tr: { text: "Henüz proje yok. İlk projenizi oluşturun!", status: "published" },
        },
      },
    ],
  },
  {
    id: "ns-common",
    name: "common",
    progress: 60,
    missingCount: 2,
    keys: [
      {
        id: "key-9",
        key: "common.save",
        namespace: "common",
        sourceText: "Save",
        sourceStatus: "published",
        translations: {
          tr: { text: "Kaydet", status: "published" },
        },
      },
      {
        id: "key-10",
        key: "common.cancel",
        namespace: "common",
        sourceText: "Cancel",
        sourceStatus: "published",
        translations: {
          tr: { text: "İptal", status: "published" },
        },
      },
      {
        id: "key-11",
        key: "common.delete",
        namespace: "common",
        sourceText: "Delete",
        sourceStatus: "published",
        translations: {
          tr: { text: "", status: "untranslated" },
        },
      },
      {
        id: "key-12",
        key: "common.loading",
        namespace: "common",
        sourceText: "Loading...",
        sourceStatus: "draft",
        translations: {
          tr: { text: "", status: "untranslated" },
        },
      },
      {
        id: "key-13",
        key: "common.error",
        namespace: "common",
        sourceText: "Something went wrong",
        sourceStatus: "published",
        translations: {
          tr: { text: "Bir şeyler ters gitti", status: "published" },
        },
      },
    ],
  },
];

// Mock AI chat messages for the drawer demo
export interface MockChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCall?: {
    name: string;
    status: "pending" | "approved" | "completed";
    translations?: Array<{
      key: string;
      translation: string;
    }>;
  };
}

export const MOCK_CHAT_MESSAGES: MockChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Translate the auth.signup keys to Turkish",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "I'll translate the auth.signup keys to Turkish. Let me analyze the context and provide accurate translations.",
    timestamp: new Date(Date.now() - 55000),
    toolCall: {
      name: "proposeTranslations",
      status: "completed",
      translations: [
        { key: "auth.signup.title", translation: "Hesabınızı oluşturun" },
        { key: "auth.signup.subtitle", translation: "Ücretsiz denemenizi bugün başlatın" },
        { key: "auth.signup.submit", translation: "Kaydol" },
      ],
    },
  },
];

// Languages configuration
export const SOURCE_LANGUAGE = {
  code: "en",
  name: "English",
  countryCode: "US",
};

export const TARGET_LANGUAGES = [
  { code: "tr", name: "Turkish", countryCode: "TR" },
];
