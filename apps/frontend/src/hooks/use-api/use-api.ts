import ky from "ky";
import { useMemo } from "react";

export default function useApi() {
  return useMemo(() => {
    return ky.create({
      prefixUrl: "/api/proxy",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
  }, []);
}
