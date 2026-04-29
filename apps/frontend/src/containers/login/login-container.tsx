"use client";

import Image from "next/image";
import LoginForm from "@/components/login-form";
import styles from "./login-container.module.css";
import useLogin from "@/hooks/use-login";

export default function LoginContainer() {
  const { error, loading, login, onFieldChange, password, username } =
    useLogin();

  return (
    <main className={styles.container}>
      <div className={styles.imageColumn}>
        <Image
          src="/pos_login_background.png"
          alt="POS System Background"
          fill
          priority
          className="object-cover"
        />
        <div className={styles.overlay}>
          <div className={styles.brandInfo}>
            <h1 className="text-4xl font-bold text-white mb-2">My Application</h1>
            <p className="text-lg text-white/80">
              Welcome back! Please sign in to continue.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.formColumn}>
        <div className={styles.formWrapper}>
          <LoginForm
            error={error}
            loading={loading}
            onLogin={login}
            onPasswordChange={(val: string) => onFieldChange("password", val)}
            onUsernameChange={(val: string) => onFieldChange("username", val)}
            password={password}
            username={username}
          />
        </div>
        <div className={styles.footer}>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} My Application. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
