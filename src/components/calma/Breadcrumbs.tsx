import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-calma-taupe"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="no-underline transition-colors hover:text-calma-terracotta"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "text-calma-ink" : ""}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 shrink-0" />}
          </span>
        );
      })}
    </nav>
  );
}
