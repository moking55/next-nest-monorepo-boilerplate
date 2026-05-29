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
import type { HelloFormProps } from "./types";

export default function HelloForm({
  connected,
  error,
  name,
  onNameChange,
  onSend,
  response,
}: HelloFormProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Socket.io Hello</CardTitle>
        <CardDescription>
          {connected ? "Connected to server" : "Connecting..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm text-muted-foreground">
            {connected ? "Online" : "Offline"}
          </span>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        {response && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-700">{response}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!connected}
          onClick={onSend}
        >
          Send Hello
        </Button>
      </CardFooter>
    </Card>
  );
}
