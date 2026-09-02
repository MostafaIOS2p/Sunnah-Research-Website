import { Link } from 'wouter';
import type { LucideIcon } from 'lucide-react';
import { Clock } from 'lucide-react';

type ComingSoonProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

/**
 * Shared empty-state for any page/feature the Figma design shows but that
 * has no working endpoint yet. Reused across milestones as more screens are
 * matched against real APIs.
 */
export function ComingSoon({
  icon: Icon = Clock,
  title,
  description,
  backHref = '/',
  backLabel = 'العودة للرئيسية',
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-5 py-14">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70">
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-thin text-foreground md:text-4xl">{title}</h1>
        <p className="text-lg font-light leading-relaxed text-muted-foreground">{description}</p>
        <Link
          href={backHref}
          className="mt-4 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
