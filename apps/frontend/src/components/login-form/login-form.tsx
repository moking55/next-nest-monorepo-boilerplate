"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoginFormProps } from "./types";

export default function LoginForm({
  error,
  loading,
  onLogin,
  onPasswordChange,
  onUsernameChange,
  password,
  username,
}: LoginFormProps) {
  return (
    <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
      <CardHeader className="space-y-2 px-0 mb-4">
        <CardTitle className="text-4xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
          Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 px-0">
        <div className="grid gap-2.5">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            placeholder="e.g. admin"
            type="text"
            className="h-12 bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all duration-200"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
          />
        </div>
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Button
              variant="link"
              size="sm"
              className="px-0 h-auto font-medium text-primary/70 hover:text-primary transition-colors"
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all duration-200"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-0 pt-6">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          disabled={loading}
          onClick={onLogin}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
