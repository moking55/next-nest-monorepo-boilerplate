"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InlineIcon } from "@iconify/react";
import clsx from "clsx";
import { useImmer } from "use-immer";
import navItems from "./navigation.json";
import styles from "./sidebar.module.css";
import type { SidebarProps } from "./types";

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useImmer(false);
  const [expandedMenus, setExpandedMenus] = useImmer<Record<string, boolean>>(
    {},
  );

  const toggleSidebar = () => {
    setIsExpanded((draft) => !draft);
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((draft) => {
      draft[label] = !draft[label];
    });
    // Auto-expand sidebar if opening a submenu
    if (!isExpanded) {
      setIsExpanded(() => true);
    }
  };

  return (
    <aside
      className={clsx(
        styles.sidebar,
        isExpanded ? styles.expanded : styles.collapsed,
        className,
      )}
    >
      <div className={styles.header}>
        <div
          className={clsx(
            styles.logoContainer,
            !isExpanded && styles.logoHidden,
          )}
        >
          <span className={styles.logo}>ImmedaPOS Demo</span>
        </div>
        <button
          type="button"
          className={styles.expandButton}
          onClick={toggleSidebar}
        >
          <InlineIcon
            icon={
              isExpanded
                ? "heroicons:chevron-double-left"
                : "heroicons:chevron-double-right"
            }
          />
        </button>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.href ? pathname.startsWith(item.href) : false;
          const hasSubmenu = "submenus" in item && Array.isArray(item.submenus);
          const isSubmenuExpanded = expandedMenus[item.label];

          return (
            <div key={item.label} className={styles.navItemContainer}>
              {hasSubmenu ? (
                <button
                  type="button"
                  className={clsx(
                    styles.navItem,
                    isActive && styles.navItemActive,
                  )}
                  onClick={() => toggleSubmenu(item.label)}
                >
                  {item.icon && (
                    <InlineIcon icon={item.icon} className={styles.icon} />
                  )}
                  {isExpanded && (
                    <>
                      <span className={styles.label}>{item.label}</span>
                      <InlineIcon
                        icon={
                          isSubmenuExpanded
                            ? "heroicons:chevron-up"
                            : "heroicons:chevron-down"
                        }
                        className={styles.chevron}
                      />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={clsx(
                    styles.navItem,
                    isActive && styles.navItemActive,
                  )}
                  title={!isExpanded ? item.label : undefined}
                >
                  {item.icon && (
                    <InlineIcon icon={item.icon} className={styles.icon} />
                  )}
                  {isExpanded && (
                    <span className={styles.label}>{item.label}</span>
                  )}
                </Link>
              )}

              {hasSubmenu && isExpanded && isSubmenuExpanded && (
                <div className={styles.submenu}>
                  {item.submenus!.map((sub) => {
                    const isSubActive = pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          styles.submenuItem,
                          isSubActive && styles.submenuItemActive,
                        )}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
