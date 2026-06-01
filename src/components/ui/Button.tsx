import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 ease-warm focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-[0.95rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-b from-copper-bright to-copper text-bg-deep shadow-ember hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
  secondary:
    "border border-line-strong bg-surface/30 text-cream backdrop-blur-sm hover:border-copper hover:text-copper-bright hover:-translate-y-0.5",
  ghost: "text-cream/85 hover:text-copper-bright",
};

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 ease-warm group-hover:translate-x-1"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SharedProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = SharedProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = SharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: AnchorProps | ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    withArrow = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, sizes[size], variants[variant], className);
  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
