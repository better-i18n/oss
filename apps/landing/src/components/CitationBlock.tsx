import type { ReactNode } from "react";

interface CitationBlockProps {
  /** Unique ID for this citation (used as HTML id and citation reference) */
  readonly id: string;
  /** The main statement — rendered bold as the first sentence */
  readonly statement: string;
  /** Expanded explanation following the statement */
  readonly explanation?: string;
  /** Optional children for more complex content */
  readonly children?: ReactNode;
}

/**
 * AI-extraction-optimized content block.
 *
 * Uses `data-citation` attribute for structured identification by AI crawlers.
 * Renders with bold lead sentence pattern that AI models weight for extraction.
 * Compatible with schema.org SpeakableSpecification via CSS selector `[data-citation]`.
 */
export function CitationBlock({
  id,
  statement,
  explanation,
  children,
}: CitationBlockProps) {
  return (
    <section data-citation="true" id={id} className="my-6">
      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <strong>{statement}</strong>
        {explanation && ` ${explanation}`}
      </p>
      {children}
    </section>
  );
}

interface CitationFAQProps {
  /** The question text, rendered as an h3 heading */
  readonly question: string;
  /** The answer text — first sentence is bolded for AI extraction */
  readonly answer: string;
  /** Optional custom ID (defaults to slugified question) */
  readonly id?: string;
}

/**
 * FAQ-style citation block optimized for AI extraction and FAQ rich results.
 *
 * The question is wrapped in an h3 for semantic structure.
 * The first sentence of the answer is bolded to signal importance to AI crawlers.
 */
export function CitationFAQ({ question, answer, id }: CitationFAQProps) {
  const safeId =
    id ||
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "");

  const sentences = answer.split(". ");
  const firstSentence = `${sentences[0]}.`;
  const restSentences =
    sentences.length > 1 ? ` ${sentences.slice(1).join(". ")}` : "";

  return (
    <section
      data-citation="true"
      data-citation-type="faq"
      id={`faq-${safeId}`}
      className="my-4"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {question}
      </h3>
      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <strong>{firstSentence}</strong>
        {restSentences}
      </p>
    </section>
  );
}
