import { Suspense } from "react"
import { Header } from "@/components/header"
import { SearchExperience } from "@/components/search-experience"

export default function SearchPage() {
  return <><Header /><Suspense fallback={<div className="min-h-screen bg-background" />}><SearchExperience /></Suspense></>
}
