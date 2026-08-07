// utils/option-value.util.ts
//
// Shared helper for deriving an option's stable `value` key from its label
// as the admin types it. Used by every canvas/config editor that lets an
// admin edit MCQ/MaxDiff/Matrix option labels (McqCanvasEditor,
// MaxDiffCanvasEditor, ChoiceConfig, MatrixConfig).

const ASCII_KEY = /[a-z0-9]/;

const slugifyKey = (v: string) =>
  v.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 30);

// A slug carries real content only if it has an actual a-z0-9 character.
// Non-Latin-script labels (Tamil, etc.) strip down to '' under the ASCII
// rule above — or, if the label has internal whitespace, to a bare run of
// "_" (the space-to-underscore substitution survives even though every
// letter is stripped). Treating either as "no content" is what stops two
// differently-worded Tamil options from silently colliding on the same
// value.
const hasSlugContent = (s: string | undefined | null): s is string =>
  !!s && ASCII_KEY.test(s);

/**
 * Resolve the `value` to store for an option whose label just changed.
 * Order of preference: a fresh slug of the new label -> the option's
 * previous value (if it still carries real content) -> an index-based
 * `optN` key. The result is then forced unique against `siblingValues` —
 * this is what prevents e.g. two Tamil options with the same word count
 * from both landing on the same fallback.
 */
export function resolveOptionValue(
  label: string,
  previousValue: string | undefined | null,
  index: number,
  siblingValues: string[] = [],
): string {
  const slug = slugifyKey(label);
  let value = hasSlugContent(slug)
    ? slug
    : hasSlugContent(previousValue)
      ? previousValue
      : `opt${index + 1}`;

  if (siblingValues.includes(value)) {
    value = `opt${index + 1}`;
  }
  return value;
}
