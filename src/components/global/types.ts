// Shared types for the global components.

export interface NavItem {
  label: string;
  href: string;
  /** Superscript count (e.g. number of projects). */
  count?: number;
  /** Screen-reader suffix for the count, e.g. "projects". */
  countLabel?: string;
}
