import type { PropsWithChildren } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import styles from "./layout.module.css";

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContainer}>{children}</main>
      </div>
    </div>
  );
}
