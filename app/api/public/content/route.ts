import { NextResponse } from "next/server"
import { getAdminDatabase } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const snapshot = await getAdminDatabase().collection("website_content").get()
    const content = snapshot.docs
      .filter((document) => document.data().published === true)
      .map((document) => ({
        id: document.id,
        type: document.data().type,
        title: document.data().title,
        body: document.data().body,
        imageUrl: typeof document.data().imageUrl === "string" ? document.data().imageUrl : "",
      }))
      .filter((entry) => ["announcement", "banner", "testimonial"].includes(entry.type) && typeof entry.title === "string" && typeof entry.body === "string")
    return NextResponse.json(
      { content },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    )
  } catch {
    return NextResponse.json({ content: [] })
  }
}
