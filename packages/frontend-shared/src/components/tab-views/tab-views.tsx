"use client";

import { memo, useState } from "react";
import { InlineIcon } from "@iconify/react";
import clsx from "clsx";
import styles from "./tab-views.module.css";
import type { TabViewsProps } from "./types";

function TabViews({ defaultTab, tabs }: TabViewsProps) {
  const [activeKey, setActiveKey] = useState<string>(
    defaultTab ?? tabs[0]?.key ?? "",
  );

  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabBar} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            aria-selected={activeKey === tab.key}
            className={clsx(styles.tab, {
              [styles.tabActive]: activeKey === tab.key,
            })}
            role="tab"
            type="button"
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.icon && (
              <InlineIcon
                className={styles.tabIcon}
                height={16}
                icon={tab.icon}
                width={16}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent} role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  );
}

export default memo(TabViews);
