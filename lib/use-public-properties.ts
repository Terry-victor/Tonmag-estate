"use client"

import { useEffect, useState } from "react"
import { properties as fallbackProperties, type Property } from "@/lib/properties"

export function usePublicProperties() {
  const allowFallback = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SAAS_DEMO_MODE === "true"
  const [properties, setProperties] = useState<Property[]>(allowFallback ? fallbackProperties : [])
  useEffect(() => {
    const controller = new AbortController()
    void fetch("/api/public/properties", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (Array.isArray(result?.properties)) setProperties(result.properties) })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])
  return properties
}
