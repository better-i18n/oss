import {
  Context,
  ContextContent,
  ContextContentHeader,
  ContextTrigger,
} from "@better-i18n/ui/components/ai/context";
import { AI_MODELS, type AIModelConfig } from "@better-i18n/schemas";
import { Button } from "@better-i18n/ui/components/button";
import { Checkbox } from "@better-i18n/ui/components/checkbox";
import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconArrowUp,
  IconChevronBottom,
  IconCircleDashed,
  IconFolder1,
  IconGlobe,
  IconMagicWand,
  IconMagnifyingGlass,
  IconSparklesSoft,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useEffect, useMemo, useRef, useState } from "react";
import { DemoModelSelector } from "./DemoModelSelector";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@better-i18n/ui/components/collapsible";
import { useTranslations, useLocale } from "@better-i18n/use-intl";

// Flag icon component with real flag images
function FlagIcon({
  countryCode,
  size = "md",
}: {
  countryCode: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-4 h-3" : "w-5 h-4";
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
      alt={countryCode}
      className={cn(sizeClass, "rounded-sm object-cover")}
    />
  );
}

// Mention types
interface MentionItem {
  id: string;
  label: string;
  type: "special" | "language" | "namespace";
  description?: string;
  countryCode?: string;
}

// Demo mention data - grouped by type
const DEMO_MENTIONS: MentionItem[] = [
  // Quick Actions
  {
    id: "missing",
    label: "missing",
    type: "special",
    description: "Missing translations",
  },
  // Languages
  {
    id: "lang:en",
    label: "English",
    type: "language",
    description: "en",
    countryCode: "gb",
  },
  {
    id: "lang:tr",
    label: "Turkish",
    type: "language",
    description: "tr",
    countryCode: "tr",
  },
  {
    id: "lang:de",
    label: "German",
    type: "language",
    description: "de",
    countryCode: "de",
  },
  {
    id: "lang:es",
    label: "Spanish",
    type: "language",
    description: "es",
    countryCode: "es",
  },
  {
    id: "lang:fr",
    label: "French",
    type: "language",
    description: "fr",
    countryCode: "fr",
  },
  // Namespaces
  {
    id: "ns:auth",
    label: "auth",
    type: "namespace",
    description: "auth namespace",
  },
  {
    id: "ns:common",
    label: "common",
    type: "namespace",
    description: "common namespace",
  },
  {
    id: "ns:dashboard",
    label: "dashboard",
    type: "namespace",
    description: "dashboard namespace",
  },
];

// ── Locale-aware demo typing content ──────────────────────────────
interface DemoSegment {
  type: "text" | "mention";
  value: string; // text content for "text", mention ID for "mention"
}

interface DemoPhaseContent {
  segments: DemoSegment[];
  userMessage: string;
}

interface DemoContent {
  phase1: DemoPhaseContent;
  phase2: DemoPhaseContent;
}

const DEMO_CONTENT: Record<string, DemoContent> = {
  en: {
    phase1: {
      segments: [
        { type: "text", value: "Translate " },
        { type: "mention", value: "lang:tr" },
        { type: "text", value: " keys in " },
        { type: "mention", value: "ns:auth" },
      ],
      userMessage: "Translate @Turkish keys in @auth",
    },
    phase2: {
      segments: [
        { type: "text", value: "Now add " },
        { type: "mention", value: "lang:de" },
        { type: "text", value: " and publish all" },
      ],
      userMessage: "Now add @German and publish all",
    },
  },
  tr: {
    phase1: {
      segments: [
        { type: "text", value: "Çevir " },
        { type: "mention", value: "lang:tr" },
        { type: "text", value: " anahtarları " },
        { type: "mention", value: "ns:auth" },
        { type: "text", value: " içinde" },
      ],
      userMessage: "Çevir @Turkish anahtarları @auth içinde",
    },
    phase2: {
      segments: [
        { type: "text", value: "Şimdi " },
        { type: "mention", value: "lang:de" },
        { type: "text", value: " ekle ve tümünü yayınla" },
      ],
      userMessage: "Şimdi @German ekle ve tümünü yayınla",
    },
  },
  zh: {
    phase1: {
      segments: [
        { type: "text", value: "翻译 " },
        { type: "mention", value: "ns:auth" },
        { type: "text", value: " 中的 " },
        { type: "mention", value: "lang:tr" },
        { type: "text", value: " 键" },
      ],
      userMessage: "翻译 @auth 中的 @Turkish 键",
    },
    phase2: {
      segments: [
        { type: "text", value: "现在添加 " },
        { type: "mention", value: "lang:de" },
        { type: "text", value: " 并发布全部" },
      ],
      userMessage: "现在添加 @German 并发布全部",
    },
  },
};

// Status icons logic matching real app
const StatusIcon = ({ status }: { status: "approved" | "published" }) => {
  // Always use green for completed/approved state
  console.log("StatusIcon status:", status);
  const color = "text-[#22C55E]";
  return (
    <IconCircleDashed
      className={cn("h-3 w-3 shrink-0", color)}
      strokeWidth={3}
    />
  );
};

// Message structure matching real drawer
interface Translation {
  k: string; // key
  n: string; // name (without namespace)
  ns: string; // namespace
  l: string; // language code
  ln: string; // language name
  cc: string; // country code
  t: string; // translation text
}

interface FileChange {
  path: string;
  lang: string;
  langCode: string;
  countryCode: string;
  added: number;
  modified: number;
}

interface ToolCall {
  id: string;
  name: string;
  state: "pending" | "output-available" | "completed";
  input?: Record<string, unknown>;
  translations?: Translation[];
  syncInfo?: {
    target: "cdn" | "github";
    files: FileChange[];
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCall?: ToolCall;
}

// Generate random tool call ID like production
function generateToolCallId() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "call_";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Render message content with mentions styled like the dropdown
function renderMessageWithMentions(content: string, mentions: MentionItem[]) {
  // Match @word patterns
  const parts = content.split(/(@\w+)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("@")) {
      const mentionLabel = part.slice(1); // Remove @
      // Find matching mention
      const mention = mentions.find(
        (m) =>
          m.label.toLowerCase() === mentionLabel.toLowerCase() ||
          m.id.toLowerCase().includes(mentionLabel.toLowerCase()),
      );

      if (mention) {
        return (
          <span
            key={idx}
            className="inline-flex items-center gap-1 text-gray-700 rounded font-medium px-1 py-0.5 whitespace-nowrap bg-gray-100 mx-0.5"
          >
            {mention.type === "language" && mention.countryCode ? (
              <img
                src={`https://flagcdn.com/w40/${mention.countryCode.toLowerCase()}.png`}
                alt={mention.countryCode}
                className="w-4 h-3 rounded-sm object-cover"
              />
            ) : mention.type === "namespace" ? (
              <IconFolder1 className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <IconSparklesSoft className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{mention.label}</span>
          </span>
        );
      }
    }
    return <span key={idx}>{part}</span>;
  });
}

interface ToolWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

const ToolWrapper = ({ children, header }: ToolWrapperProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="h-auto w-full px-3 py-1.5 bg-gray-100 text-gray-900 cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="flex items-center justify-between">
              {header}
              <IconChevronBottom
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Collapsible Input Component
function CollapsibleInput({ input, label }: { input: Record<string, unknown>; label: string }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!input) return null;

  return (
    <div className="px-3 pt-2 text-xs border-b border-gray-100 pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between mb-1.5 w-full hover:opacity-80 transition-opacity"
      >
        <h4 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </h4>
        <IconChevronBottom
          className={cn(
            "h-3.5 w-3.5 text-gray-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div className="rounded-lg bg-white border border-gray-200 p-2 font-mono text-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
          {Object.entries(input).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-gray-400 select-none shrink-0">{key}:</span>
              <span className="break-all">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// No initial messages - demo starts fresh with auto-typing
const INITIAL_MESSAGES: Message[] = [];

export function DemoAIDrawerStandalone() {
  const t = useTranslations("demo");
  const { locale } = useLocale();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModelConfig>(
    AI_MODELS[0],
  );
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [demoKey, setDemoKey] = useState(0); // Increment to trigger demo
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Localized suggestions
  const suggestions = useMemo(() => [
    {
      text: t("suggestions.findUntranslated"),
      icon: IconMagnifyingGlass,
      value: "Find all untranslated keys",
    },
    {
      text: t("suggestions.translateMissing"),
      icon: IconMagicWand,
      value: "Propose translations for all missing keys",
    },
    {
      text: t("suggestions.translateAuth"),
      icon: IconGlobe,
      value: "Translate all missing keys in @ns:auth",
    },
  ], [t]);

  // Get demo content for current locale (fallback to en).
  // Normalize zh-hans / zh-hant variants to the base "zh" key.
  const demoContent = useMemo(() => {
    const baseLocale = locale.startsWith("zh") ? "zh" : locale;
    return DEMO_CONTENT[baseLocale] || DEMO_CONTENT.en;
  }, [locale]);

  // Filter mentions based on query
  const filteredMentions = useMemo(() => {
    if (!mentionQuery) return DEMO_MENTIONS;
    const q = mentionQuery.toLowerCase();
    return DEMO_MENTIONS.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q),
    );
  }, [mentionQuery]);

  // Auto-scroll to bottom only when messages change - scroll container, not viewport
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Epic multi-step demo experience - runs on mount and when demoKey changes
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let cancelled = false;
    const timeouts: NodeJS.Timeout[] = [];
    let messagesState: Message[] = [];

    const scheduleNext = (fn: () => void, delay: number) => {
      const tid = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(tid);
    };

    // Helper to create mention chip
    const createMentionChip = (mention: MentionItem) => {
      const mentionSpan = document.createElement("span");
      mentionSpan.className =
        "inline-flex items-center gap-1 text-gray-700 rounded font-medium px-0.5 whitespace-nowrap bg-gray-100 mx-0.5";
      mentionSpan.contentEditable = "false";
      mentionSpan.setAttribute("data-mention", mention.id);

      if (mention.type === "language" && mention.countryCode) {
        const img = document.createElement("img");
        img.src = `https://flagcdn.com/w40/${mention.countryCode.toLowerCase()}.png`;
        img.className = "w-4 h-3 rounded-sm object-cover";
        img.alt = mention.countryCode;
        mentionSpan.appendChild(img);
      } else {
        const iconSpan = document.createElement("span");
        iconSpan.innerHTML =
          '<svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>';
        mentionSpan.appendChild(iconSpan.firstChild!);
      }

      const labelSpan = document.createElement("span");
      labelSpan.textContent = mention.label;
      mentionSpan.appendChild(labelSpan);
      return mentionSpan;
    };

    // ── Generic segment-based typing animation ──────────────────────
    const animateSegments = (
      segments: DemoSegment[],
      idx: number,
      onComplete: () => void,
    ) => {
      if (cancelled || idx >= segments.length) {
        if (!cancelled) scheduleNext(onComplete, 500);
        return;
      }

      const seg = segments[idx];

      if (seg.type === "text") {
        // Get or create trailing text node
        let textNode: Text;
        const lastChild = editor.childNodes[editor.childNodes.length - 1];
        if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
          textNode = lastChild as Text;
        } else {
          textNode = document.createTextNode("");
          editor.appendChild(textNode);
        }

        const existingText = textNode.textContent || "";
        let charIdx = 0;

        const typeNextChar = () => {
          if (cancelled) return;
          if (charIdx < seg.value.length) {
            charIdx++;
            textNode.textContent = existingText + seg.value.slice(0, charIdx);
            scheduleNext(typeNextChar, 50 + Math.random() * 30);
          } else {
            animateSegments(segments, idx + 1, onComplete);
          }
        };
        typeNextChar();
      } else if (seg.type === "mention") {
        const mention = DEMO_MENTIONS.find((m) => m.id === seg.value)!;
        const filterText = mention.label.slice(0, 2).toLowerCase();

        // Append "@" to editor
        const lastChild = editor.childNodes[editor.childNodes.length - 1];
        if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
          (lastChild as Text).textContent += "@";
        } else {
          editor.appendChild(document.createTextNode("@"));
        }

        setShowMentionDropdown(true);
        setMentionQuery("");

        scheduleNext(() => {
          if (cancelled) return;
          // Filter
          const textNode = editor.childNodes[editor.childNodes.length - 1];
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = textNode.textContent!.replace(/@\w*$/, `@${filterText}`);
          }
          setMentionQuery(filterText);
          setMentionIndex(0);

          scheduleNext(() => {
            if (cancelled) return;
            // Select - rebuild editor with all segments up to current
            setShowMentionDropdown(false);
            editor.innerHTML = "";

            for (let i = 0; i <= idx; i++) {
              const s = segments[i];
              if (s.type === "text") {
                editor.appendChild(document.createTextNode(s.value));
              } else {
                const m = DEMO_MENTIONS.find((mm) => mm.id === s.value)!;
                editor.appendChild(createMentionChip(m));
              }
            }
            editor.appendChild(document.createTextNode(""));

            scheduleNext(() => {
              animateSegments(segments, idx + 1, onComplete);
            }, 200);
          }, 400);
        }, 400);
      }
    };

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1: Type localized command with mentions
    // ═══════════════════════════════════════════════════════════════
    const phase1_type = () => {
      animateSegments(demoContent.phase1.segments, 0, phase1_send);
    };

    const phase1_send = () => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: demoContent.phase1.userMessage,
        timestamp: new Date(),
      };
      messagesState = [userMessage];
      setMessages(messagesState);
      editor.innerHTML = "";
      setInput("");
      setIsTyping(true);
      scheduleNext(phase1_aiResponse, 1200);
    };

    const phase1_aiResponse = () => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: t("phase1.aiResponse"),
        timestamp: new Date(),
        toolCall: {
          id: generateToolCallId(),
          name: "proposeTranslations",
          state: "output-available",
          input: {
            keys: [
              "auth.login.title",
              "auth.login.submit",
              "auth.signup.title",
            ],
            language: "tr",
          },
          translations: [
            {
              k: "auth.login.title",
              n: "login.title",
              ns: "auth",
              l: "tr",
              ln: "Turkish",
              cc: "tr",
              t: "Giriş Yap",
            },
            {
              k: "auth.login.submit",
              n: "login.submit",
              ns: "auth",
              l: "tr",
              ln: "Turkish",
              cc: "tr",
              t: "Giriş",
            },
            {
              k: "auth.signup.title",
              n: "signup.title",
              ns: "auth",
              l: "tr",
              ln: "Turkish",
              cc: "tr",
              t: "Hesap Oluştur",
            },
          ],
        },
      };
      messagesState = [...messagesState, aiResponse];
      setMessages(messagesState);
      setIsTyping(false);
      setShowApprovalButtons(true);
      scheduleNext(phase1_approve, 1500);
    };

    const phase1_approve = () => {
      setSelectedRows(
        new Set(["auth.login.title", "auth.login.submit", "auth.signup.title"]),
      );
      scheduleNext(() => {
        setShowApprovalButtons(false);
        messagesState = messagesState.map((msg, idx) =>
          idx === messagesState.length - 1 && msg.toolCall
            ? {
                ...msg,
                toolCall: { ...msg.toolCall, state: "completed" as const },
              }
            : msg,
        );
        setMessages(messagesState);
        scheduleNext(() => {
          setSelectedRows(new Set());
          phase2_type();
        }, 800);
      }, 1000);
    };

    // ═══════════════════════════════════════════════════════════════
    // PHASE 2: Type localized "add German and publish"
    // ═══════════════════════════════════════════════════════════════
    const phase2_type = () => {
      animateSegments(demoContent.phase2.segments, 0, phase2_send);
    };

    const phase2_send = () => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: demoContent.phase2.userMessage,
        timestamp: new Date(),
      };
      messagesState = [...messagesState, userMessage];
      setMessages(messagesState);
      editor.innerHTML = "";
      setInput("");
      setIsTyping(true);
      scheduleNext(phase2_aiResponse, 1200);
    };

    const phase2_aiResponse = () => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: t("phase2.aiResponse"),
        timestamp: new Date(),
        toolCall: {
          id: generateToolCallId(),
          name: "proposeTranslations",
          state: "output-available",
          input: {
            keys: [
              "auth.login.title",
              "auth.login.submit",
              "auth.signup.title",
            ],
            language: "de",
          },
          translations: [
            {
              k: "auth.login.title",
              n: "login.title",
              ns: "auth",
              l: "de",
              ln: "German",
              cc: "de",
              t: "Anmelden",
            },
            {
              k: "auth.login.submit",
              n: "login.submit",
              ns: "auth",
              l: "de",
              ln: "German",
              cc: "de",
              t: "Einloggen",
            },
            {
              k: "auth.signup.title",
              n: "signup.title",
              ns: "auth",
              l: "de",
              ln: "German",
              cc: "de",
              t: "Konto erstellen",
            },
          ],
        },
      };
      messagesState = [...messagesState, aiResponse];
      setMessages(messagesState);
      setIsTyping(false);
      setShowApprovalButtons(true);
      scheduleNext(phase2_approve, 1500);
    };

    const phase2_approve = () => {
      setSelectedRows(
        new Set(["auth.login.title", "auth.login.submit", "auth.signup.title"]),
      );
      scheduleNext(() => {
        setShowApprovalButtons(false);
        messagesState = messagesState.map((msg, idx) =>
          idx === messagesState.length - 1 && msg.toolCall
            ? {
                ...msg,
                toolCall: { ...msg.toolCall, state: "completed" as const },
              }
            : msg,
        );
        setMessages(messagesState);
        scheduleNext(() => {
          setSelectedRows(new Set());
          phase3_publish();
        }, 600);
      }, 1000);
    };

    // ═══════════════════════════════════════════════════════════════
    // PHASE 3: Publish all translations to CDN
    // ═══════════════════════════════════════════════════════════════
    const phase3_publish = () => {
      setIsTyping(true);
      scheduleNext(() => {
        const syncMessage: Message = {
          id: `msg-${Date.now()}-sync`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          toolCall: {
            id: generateToolCallId(),
            name: "publishTranslations",
            state: "pending",
            input: {
              target: "cdn",
              files: ["locales/tr.json", "locales/de.json"],
            },
            syncInfo: {
              target: "cdn",
              files: [
                {
                  path: "locales/tr.json",
                  lang: "Turkish",
                  langCode: "tr",
                  countryCode: "tr",
                  added: 3,
                  modified: 0,
                },
                {
                  path: "locales/de.json",
                  lang: "German",
                  langCode: "de",
                  countryCode: "de",
                  added: 3,
                  modified: 0,
                },
              ],
            },
          },
        };
        messagesState = [...messagesState, syncMessage];
        setMessages(messagesState);
        setIsTyping(false);
        scheduleNext(() => {
          messagesState = messagesState.map((msg, idx) =>
            idx === messagesState.length - 1 && msg.toolCall
              ? {
                  ...msg,
                  toolCall: { ...msg.toolCall, state: "completed" as const },
                }
              : msg,
          );
          setMessages(messagesState);
          scheduleNext(phase3_celebration, 800);
        }, 1200);
      }, 500);
    };

    // ═══════════════════════════════════════════════════════════════
    // PHASE 4: AI celebrates success
    // ═══════════════════════════════════════════════════════════════
    const phase3_celebration = () => {
      setIsTyping(true);
      scheduleNext(() => {
        const successMessage: Message = {
          id: `msg-${Date.now()}-success`,
          role: "assistant",
          content: t("celebration"),
          timestamp: new Date(),
        };
        messagesState = [...messagesState, successMessage];
        setMessages(messagesState);
        setIsTyping(false);
      }, 800);
    };

    // Start the epic demo!
    scheduleNext(phase1_type, 600);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [demoKey, demoContent, t]);

  // Handle contenteditable input with @ mention detection
  const handleEditorInput = () => {
    const editor = editorRef.current;
    if (!editor) return;

    // Get text content (excluding mention chip text for now - we track mentions separately)
    const textContent = editor.textContent || "";
    setInput(textContent);

    // Get cursor position using selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowMentionDropdown(false);
      return;
    }

    // Get text before cursor in the current text node
    const range = selection.getRangeAt(0);
    const container = range.startContainer;

    // Only check for @ in text nodes
    if (container.nodeType === Node.TEXT_NODE) {
      const textBeforeCursor =
        container.textContent?.slice(0, range.startOffset) || "";
      const atMatch = textBeforeCursor.match(/@(\w*)$/);

      if (atMatch) {
        setShowMentionDropdown(true);
        setMentionQuery(atMatch[1]);
        setMentionIndex(0);
        return;
      }
    }

    setShowMentionDropdown(false);
    setMentionQuery("");
  };

  // Handle mention selection - insert styled mention into contenteditable
  // This preserves existing mentions by working with the current text node only
  const handleMentionSelect = (mention: MentionItem) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    // Only work with text nodes - this preserves existing mention spans
    if (textNode.nodeType !== Node.TEXT_NODE) {
      setShowMentionDropdown(false);
      setMentionQuery("");
      return;
    }

    const text = textNode.textContent || "";
    const cursorPos = range.startOffset;

    // Find @ symbol before cursor in THIS text node only
    const textBeforeCursor = text.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex === -1) {
      setShowMentionDropdown(false);
      setMentionQuery("");
      return;
    }

    // Split the text: before @, and after the query
    const beforeAt = text.slice(0, atIndex);
    const afterQuery = text.slice(atIndex + 1 + mentionQuery.length);

    // Create mention element
    const mentionSpan = document.createElement("span");
    mentionSpan.className =
      "inline-flex items-center gap-1 text-gray-700 rounded font-medium px-0.5 whitespace-nowrap bg-gray-100 mx-0.5";
    mentionSpan.contentEditable = "false";
    mentionSpan.setAttribute("data-mention", mention.id);

    // Add icon based on type
    if (mention.type === "language" && mention.countryCode) {
      const img = document.createElement("img");
      img.src = `https://flagcdn.com/w40/${mention.countryCode.toLowerCase()}.png`;
      img.className = "w-4 h-3 rounded-sm object-cover";
      img.alt = mention.countryCode;
      mentionSpan.appendChild(img);
    } else {
      const iconSpan = document.createElement("span");
      iconSpan.innerHTML =
        mention.type === "special"
          ? '<svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>'
          : '<svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>';
      mentionSpan.appendChild(iconSpan.firstChild!);
    }

    const labelSpan = document.createElement("span");
    labelSpan.textContent = mention.label;
    mentionSpan.appendChild(labelSpan);

    // Replace only the current text node, preserving siblings (existing mentions)
    const parent = textNode.parentNode;
    if (!parent) return;

    // Insert new nodes before the text node
    if (beforeAt) {
      parent.insertBefore(document.createTextNode(beforeAt), textNode);
    }
    parent.insertBefore(mentionSpan, textNode);
    const afterTextNode = document.createTextNode(" " + afterQuery);
    parent.insertBefore(afterTextNode, textNode);

    // Remove the original text node
    parent.removeChild(textNode);

    // Set cursor after the space following mention
    const newRange = document.createRange();
    newRange.setStart(afterTextNode, 1); // Position after the space
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowMentionDropdown(false);
    setMentionQuery("");
    editor.focus();
  };

  // Handle keyboard navigation in mention dropdown (contenteditable)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showMentionDropdown && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % filteredMentions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((prev) =>
          prev === 0 ? filteredMentions.length - 1 : prev - 1,
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleMentionSelect(filteredMentions[mentionIndex]);
      } else if (e.key === "Escape") {
        setShowMentionDropdown(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get icon for mention type - using production icons
  const getMentionIcon = (type: MentionItem["type"]) => {
    switch (type) {
      case "special":
        return IconSparklesSoft;
      case "language":
        return IconGlobe;
      case "namespace":
        return IconFolder1;
    }
  };

  const handleSend = () => {
    const editor = editorRef.current;
    if (!editor) return;

    // Extract text content preserving @ for mentions
    // Parse DOM to find mention spans and reconstruct with @ prefix
    let messageContent = "";
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        messageContent += node.textContent || "";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.hasAttribute("data-mention")) {
          // This is a mention span - extract the label and prefix with @
          const mentionId = el.getAttribute("data-mention") || "";
          const mention = DEMO_MENTIONS.find((m) => m.id === mentionId);
          messageContent += `@${mention?.label || mentionId}`;
        } else {
          // Recurse into children
          node.childNodes.forEach(walk);
        }
      }
    };
    editor.childNodes.forEach(walk);

    const textContent = messageContent.trim();
    if (!textContent) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    editor.innerHTML = ""; // Clear contenteditable
    setIsTyping(true);

    // Simulate AI response with translation proposals
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: "I'll translate these keys for you.",
        timestamp: new Date(),
        toolCall: {
          id: generateToolCallId(),
          name: "proposeTranslations",
          state: "output-available",
          translations: [
            {
              k: "auth.signup.submit",
              n: "signup.submit",
              ns: "auth",
              l: "tr",
              ln: "Turkish",
              cc: "tr",
              t: "Kaydol",
            },
            {
              k: "common.delete",
              n: "delete",
              ns: "common",
              l: "tr",
              ln: "Turkish",
              cc: "tr",
              t: "Sil",
            },
          ],
        },
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      setShowApprovalButtons(true);
    }, 1500);
  };

  const handleApprove = () => {
    setShowApprovalButtons(false);

    // Update the last message to show completed status
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === prev.length - 1 && msg.toolCall
          ? { ...msg, toolCall: { ...msg.toolCall, state: "completed" } }
          : msg,
      ),
    );
  };

  const inputParametersLabel = t("inputParameters");

  return (
    <div className="static h-full w-full bg-white border-l border-gray-200 flex flex-col overflow-hidden rounded-tl-xl">
      {/* Messages Area - Scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto relative"
      >
        {/* Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  alt="better-i18n"
                  className="h-10 w-10"
                  src="https://dash.better-i18n.com/logo/dark.png"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("emptyState.title")}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {t("emptyState.description")}
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-center w-full">
            <div className="px-4 py-2 w-full max-w-3xl">
              <div
                className={cn(
                  "flex flex-col gap-2",
                  msg.role === "assistant" ? "items-start" : "items-end",
                )}
              >
                {/* Message content */}
                {msg.content && (
                  <div
                    className={cn(
                      msg.role === "user"
                        ? "bg-gray-200 w-full text-gray-700 text-sm rounded-2xl px-3 py-1.5 whitespace-pre-wrap"
                        : "text-sm text-gray-700 whitespace-pre-wrap",
                    )}
                  >
                    {msg.role === "user"
                      ? renderMessageWithMentions(msg.content, DEMO_MENTIONS)
                      : msg.content}
                  </div>
                )}

                {/* Sync tool */}
                {msg.toolCall && msg.toolCall.syncInfo && (
                  <div className="w-full">
                    <ToolWrapper
                      header={
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm border bg-white border-gray-200",
                            )}
                          >
                            {msg.toolCall.state === "pending" ? (
                              <svg
                                className="h-4 w-4 text-blue-500 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            ) : (
                              <IconCircleDashed
                                className="h-4 w-4 text-emerald-500"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold">
                              {msg.toolCall.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {msg.toolCall.id}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mr-2",
                              msg.toolCall.state === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700",
                            )}
                          >
                            {msg.toolCall.state === "pending"
                              ? t("status.publishing")
                              : t("status.published")}
                          </span>
                        </div>
                      }
                    >
                      {/* Input Parameters - Collapsible */}
                      {msg.toolCall.input && (
                        <CollapsibleInput input={msg.toolCall.input} label={inputParametersLabel} />
                      )}
                      {/* Sync Content - File Changes */}
                      <div className="px-3 py-1.5 space-y-2">
                        {msg.toolCall.syncInfo.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all bg-white border-gray-200"
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Country flag icon */}
                              <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 overflow-hidden">
                                <img
                                  src={`https://flagcdn.com/w40/${file.countryCode.toLowerCase()}.png`}
                                  alt={file.countryCode}
                                  className="w-5 h-4 rounded-sm object-cover"
                                />
                              </div>
                              {/* File path */}
                              <div className="flex flex-col">
                                <span className="text-sm font-mono text-gray-800">
                                  {file.path}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {file.lang}
                                </span>
                              </div>
                            </div>
                            {/* Changes indicator */}
                            <div className="flex items-center gap-2">
                              {file.added > 0 && (
                                <span className="text-xs font-medium text-emerald-600">
                                  +{file.added} {t("keys")}
                                </span>
                              )}
                              {file.modified > 0 && (
                                <span className="text-xs font-medium text-amber-600">
                                  ~{file.modified}
                                </span>
                              )}
                              {msg.toolCall?.state === "pending" && (
                                <svg
                                  className="w-4 h-4 text-blue-500 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ToolWrapper>
                  </div>
                )}

                {/* Tool call with translation table */}
                {msg.toolCall && msg.toolCall.translations && (
                  <div className="w-full space-y-4">
                    {/* Tool Container */}
                    <ToolWrapper
                      header={
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm border bg-white border-gray-200",
                            )}
                          >
                            {msg.toolCall.state === "completed" ? (
                              <div className="flex items-center gap-1.5 text-[#22C55E]">
                                <StatusIcon status="approved" />
                              </div>
                            ) : (
                              <IconCircleDashed
                                className="h-4 w-4 text-[#22C55E]"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold">
                              {msg.toolCall.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {msg.toolCall.id}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mr-2",
                              msg.toolCall.state === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-700",
                            )}
                          >
                            {msg.toolCall.state === "completed"
                              ? t("status.completed")
                              : t("status.ready")}
                          </span>
                        </div>
                      }
                    >
                      {/* Input Parameters - Collapsible */}
                      {msg.toolCall.input && (
                        <CollapsibleInput input={msg.toolCall.input} label={inputParametersLabel} />
                      )}

                      {/* Tool Content */}
                      <div className="px-4 pb-3 pt-2 space-y-4">
                        {/* Approve Button - Top Right */}
                        {msg.toolCall.state === "output-available" &&
                          showApprovalButtons && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                {t("translationProposals")} (
                                {msg.toolCall.translations.length})
                              </span>
                              <Button
                                onClick={handleApprove}
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                {t("approveAll")}
                              </Button>
                            </div>
                          )}
                        {/* Group by language */}
                        {(() => {
                          const byLang: Record<string, Translation[]> = {};
                          msg.toolCall.translations!.forEach((tr) => {
                            if (!byLang[tr.l]) byLang[tr.l] = [];
                            byLang[tr.l].push(tr);
                          });

                          return Object.entries(byLang).map(
                            ([langCode, items]) => (
                              <div key={langCode} className="space-y-2">
                                {/* Language Header */}
                                <div className="flex items-center gap-2 px-1">
                                  <FlagIcon countryCode={items[0].cc} />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {items[0].ln}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({items.length}{" "}
                                    {items.length === 1
                                      ? t("translationSingular")
                                      : t("translationPlural")}
                                    )
                                  </span>
                                </div>

                                {/* Translation Table */}
                                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                                  <table className="w-full text-xs table-fixed">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-2 py-1.5 w-8">
                                          <div>
                                            <Checkbox
                                              checked={
                                                msg.toolCall?.state ===
                                                  "completed" ||
                                                selectedRows.size ===
                                                  items.length
                                              }
                                              disabled={
                                                msg.toolCall?.state ===
                                                "completed"
                                              }
                                              onChange={(checked) => {
                                                if (checked) {
                                                  setSelectedRows(
                                                    new Set(
                                                      items.map((i) => i.k),
                                                    ),
                                                  );
                                                } else {
                                                  setSelectedRows(new Set());
                                                }
                                              }}
                                            />
                                          </div>
                                        </th>
                                        <th className="px-2 py-1.5 text-left text-gray-600 font-semibold w-[30%]">
                                          {t("table.key")}
                                        </th>
                                        <th className="px-2 py-1.5 text-left text-gray-600 font-semibold">
                                          {t("table.translation")}
                                        </th>
                                        <th className="px-2 py-1.5 text-right text-gray-600 font-semibold w-20">
                                          {t("table.action")}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {items.map((item, idx) => (
                                        <tr
                                          key={idx}
                                          className={cn(
                                            "transition-colors",
                                            msg.toolCall?.state ===
                                              "completed" && "bg-emerald-50",
                                          )}
                                        >
                                          <td className="px-2 py-1.5">
                                            <div>
                                              <Checkbox
                                                checked={
                                                  msg.toolCall?.state ===
                                                    "completed" ||
                                                  selectedRows.has(item.k)
                                                }
                                                onChange={(
                                                  checked: boolean,
                                                ) => {
                                                  if (
                                                    msg.toolCall?.state ===
                                                    "completed"
                                                  )
                                                    return; // Don't allow changes after approval
                                                  const newSelected = new Set(
                                                    selectedRows,
                                                  );
                                                  if (checked) {
                                                    newSelected.add(item.k);
                                                  } else {
                                                    newSelected.delete(item.k);
                                                  }
                                                  setSelectedRows(newSelected);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td className="px-2 py-1.5 font-mono text-gray-800">
                                            <div className="truncate">
                                              {item.ns && (
                                                <span className="text-gray-400">
                                                  {item.ns}.
                                                </span>
                                              )}
                                              {item.n}
                                            </div>
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-800 font-medium">
                                            {item.t}
                                          </td>
                                          <td className="px-2 py-1.5 text-right">
                                            {msg.toolCall?.state ===
                                            "completed" ? (
                                              <div className="flex justify-end">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-medium">
                                                  {t("approved")}
                                                </span>
                                              </div>
                                            ) : null}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ),
                          );
                        })()}
                      </div>
                    </ToolWrapper>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-center w-full">
            <div className="px-4 py-2 w-full max-w-3xl">
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section - Fixed at bottom */}
      <div className="shrink-0 rounded-tl-xl rounded-bl-xl py-3 px-5">
        {/* Prompt Suggestions - Always visible */}
        <div className="mb-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 pb-2">
            {suggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    // Set value in contenteditable editor
                    if (editorRef.current) {
                      editorRef.current.textContent = item.value;
                      setInput(item.value);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                  <span className="whitespace-nowrap">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white shadow-sm overflow-visible">
          {/* Contenteditable editor with mention dropdown */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable={!isTyping}
              onInput={handleEditorInput}
              onKeyDown={handleEditorKeyDown}
              data-placeholder={t("placeholder")}
              className={cn(
                "flex-1 w-full px-3 py-1.5 text-sm bg-transparent border-none focus:outline-none min-h-[100px] max-h-[120px] text-gray-900 overflow-y-auto",
                "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none",
              )}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            />

            {/* Mention Dropdown - Production style from mention-list.tsx */}
            {showMentionDropdown && filteredMentions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-3 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto py-1 min-w-56 z-50"
              >
                {/* Quick Actions */}
                {filteredMentions.some((m) => m.type === "special") && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-medium text-gray-400">
                      {t("dropdown.quickActions")}
                    </div>
                    {filteredMentions
                      .filter((m) => m.type === "special")
                      .map((mention) => {
                        const Icon = getMentionIcon(mention.type);
                        const globalIdx = filteredMentions.indexOf(mention);
                        return (
                          <button
                            key={mention.id}
                            type="button"
                            onClick={() => handleMentionSelect(mention)}
                            className={cn(
                              "flex items-center gap-2 w-full px-2 py-1 rounded text-left text-sm",
                              globalIdx === mentionIndex
                                ? "bg-gray-100"
                                : "hover:bg-gray-50",
                            )}
                          >
                            <span className="shrink-0 w-4 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                            <span className="text-gray-700 truncate flex-1">
                              {mention.label}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate max-w-24">
                              {mention.description}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}

                {/* Languages */}
                {filteredMentions.some((m) => m.type === "language") && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-medium text-gray-400">
                      {t("dropdown.languages")}
                    </div>
                    {filteredMentions
                      .filter((m) => m.type === "language")
                      .map((mention) => {
                        const globalIdx = filteredMentions.indexOf(mention);
                        return (
                          <button
                            key={mention.id}
                            type="button"
                            onClick={() => handleMentionSelect(mention)}
                            className={cn(
                              "flex items-center gap-2 w-full px-2 py-1 rounded text-left text-sm",
                              globalIdx === mentionIndex
                                ? "bg-gray-100"
                                : "hover:bg-gray-50",
                            )}
                          >
                            <span className="shrink-0 w-4 flex items-center justify-center">
                              {mention.countryCode && (
                                <FlagIcon
                                  countryCode={mention.countryCode}
                                  size="sm"
                                />
                              )}
                            </span>
                            <span className="text-gray-700 truncate flex-1">
                              {mention.label}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {mention.description}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}

                {/* Namespaces */}
                {filteredMentions.some((m) => m.type === "namespace") && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-medium text-gray-400">
                      {t("dropdown.namespaces")}
                    </div>
                    {filteredMentions
                      .filter((m) => m.type === "namespace")
                      .map((mention) => {
                        const Icon = getMentionIcon(mention.type);
                        const globalIdx = filteredMentions.indexOf(mention);
                        return (
                          <button
                            key={mention.id}
                            type="button"
                            onClick={() => handleMentionSelect(mention)}
                            className={cn(
                              "flex items-center gap-2 w-full px-2 py-1 rounded text-left text-sm",
                              globalIdx === mentionIndex
                                ? "bg-gray-100"
                                : "hover:bg-gray-50",
                            )}
                          >
                            <span className="shrink-0 w-4 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                            <span className="text-gray-700 truncate flex-1">
                              {mention.label}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate max-w-24">
                              {mention.description}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center rounded-b-xl justify-between px-3 py-1.5 gap-2">
            <div className="flex items-center gap-1">
              {/* Model Selector */}
              <DemoModelSelector
                selectedModel={selectedModel}
                onModelChange={(modelId) => {
                  const model = AI_MODELS.find((m) => m.id === modelId);
                  if (model) setSelectedModel(model);
                }}
                disabled={messages.length > 1}
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-2xl transition-all",
                input.trim() && !isTyping
                  ? "bg-blue-400 hover:bg-blue-500 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 hover:bg-gray-200",
              )}
            >
              <IconArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-2 flex items-center justify-between gap-2 px-3">
          <button
            onClick={() => {
              setMessages(INITIAL_MESSAGES);
              setInput("");
              setIsTyping(false);
              setShowApprovalButtons(false);
              setSelectedRows(new Set());
              setSelectedModel(AI_MODELS[0]);
              if (editorRef.current) editorRef.current.innerHTML = "";
              setDemoKey((k) => k + 1); // Increment to replay demo
            }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            {t("restartDemo")}
          </button>

          <Context
            usedTokens={1250}
            maxTokens={8192}
            modelId={selectedModel.apiModelId}
            inputTokens={850}
            outputTokens={400}
          >
            <ContextTrigger>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent gap-0"
              >
                <svg
                  aria-label="Model context usage"
                  height="16"
                  role="img"
                  viewBox="0 0 24 24"
                  width="16"
                  className="text-gray-400"
                >
                  <circle
                    cx="12"
                    cy="12"
                    fill="none"
                    opacity="0.25"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    fill="none"
                    opacity="0.7"
                    r="10"
                    stroke="currentColor"
                    strokeDasharray={`${2 * Math.PI * 10} ${2 * Math.PI * 10}`}
                    strokeDashoffset={2 * Math.PI * 10 * (1 - 1250 / 8192)}
                    strokeLinecap="round"
                    strokeWidth="2"
                    style={{
                      transformOrigin: "center",
                      transform: "rotate(-90deg)",
                    }}
                  />
                </svg>
              </Button>
            </ContextTrigger>
            <ContextContent>
              <ContextContentHeader />
            </ContextContent>
          </Context>
        </div>
      </div>
    </div>
  );
}
