import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const max =
    size === "wide"
      ? "max-w-7xl"
      : size === "narrow"
        ? "max-w-3xl"
        : "max-w-6xl";
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", max, className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  containerClassName,
  size,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-28 lg:py-32", className)}
    >
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
