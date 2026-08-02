export { LocaleFlag, LocaleChip } from "@/components/ui/locale-flag";

/**
 * Shared bits for the hero product replica.
 *
 * Two things the preview was missing and that make it read as a real workspace:
 * faces and flags. A locale row labelled "TR" is a code; a locale row with the
 * flag next to it is a language. Same for the signed-in user: initials read as a
 * placeholder, a photo reads as an account.
 *
 * Flags come from the platform's own asset host (`s3.better-i18n.com/flags/{cc}`),
 * which is the same source the dashboard's language picker uses — so the preview
 * cannot drift from the product it depicts. Note the host keys flags by COUNTRY
 * code, not language: `ja` and `ko` 404, the files are `jp` and `kr`.
 */

/**
 * Avatar. Falls back to initials when there is no image — the fallback is the
 * same shape and size, so a missing photo never changes the layout.
 */
export function Avatar({
  src,
  initials,
  size = 24,
  title,
}: {
  src?: string;
  initials: string;
  size?: number;
  title?: string;
}) {
  if (!src) {
    return (
      <span
        title={title}
        className="flex shrink-0 items-center justify-center rounded-md border border-black/[0.07] bg-mist-50 font-medium text-mist-700"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      >
        {initials}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      title={title}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className="shrink-0 rounded-md object-cover"
      style={{ width: size, height: size }}
    />
  );
}
