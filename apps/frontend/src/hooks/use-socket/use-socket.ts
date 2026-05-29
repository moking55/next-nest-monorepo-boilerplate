"use client";

import { useContext } from "react";
import { SocketContext, SocketContextType } from "@/contexts/socket-context";

export default function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  return context;
}
