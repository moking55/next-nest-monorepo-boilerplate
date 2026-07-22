import type { ReactNode } from "react";

export interface TabViewItem {
  content: ReactNode;
  icon?: string;
  key: string;
  label: string;
}

export interface TabViewsProps {
  defaultTab?: string;
  tabs: TabViewItem[];
}
