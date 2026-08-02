import { languageColor } from "@/lib/format";
import type { Language } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageDotProps {
  language: Language | string;
  size?: number;
  className?: string;
}

export function LanguageDot({ language, size = 12, className }: LanguageDotProps) {
  return (
    <span
      className={cn("inline-block rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: languageColor(language),
      }}
      aria-hidden
    />
  );
}

interface LanguageLabelProps {
  language: Language | string;
  className?: string;
}

export function LanguageLabel({ language, className }: LanguageLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-soft", className)}>
      <LanguageDot language={language} size={10} />
      {language}
    </span>
  );
}
