import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-copper",
        className,
      )}
    >
      <span className="h-px w-7 bg-copper/60" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Стандартная «шапка» секции: надзаголовок + крупный display-заголовок + интро. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.04] sm:text-5xl lg:text-[3.4rem]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
