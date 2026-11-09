import { NextResponse } from "next/server"
import { getAdminDatabase } from "@/lib/firebase-admin"
import { properties as fallbackProperties, type Property } from "@/lib/properties"

function publicProperty(id: string, data: Record<string, unknown>): Property {
  const fallback = fallbackProperties.find((property) => property.id === id)
  const media = Array.isArray(data.media) ? data.media.filter((item): item is string => typeof item === "string" && item.startsWith("https://")) : []
  const priceNgn = typeof data.priceNgn === "number" ? data.priceNgn : fallback?.priceNgn || 0
  return {
    id,
    name: typeof data.name === "string" ? data.name : fallback?.name || "TONMAG Residence",
    location: typeof data.location === "string" ? data.location : fallback?.location || "Nigeria",
    area: fallback?.area || (typeof data.location === "string" ? data.location.split(",")[0] : "Nigeria"),
    type: fallback?.type || "Apartment",
    status: fallback?.status || "Off-plan",
    image: media[0] || fallback?.image || "/placeholder.jpg",
    images: media.length ? media : fallback?.images || ["/placeholder.jpg"],
    priceNgn,
    priceForeign: fallback?.priceForeign || new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(priceNgn),
    foreignCurrency: fallback?.foreignCurrency || "USD",
    beds: fallback?.beds || 0,
    baths: fallback?.baths || 0,
    sqm: fallback?.sqm || 0,
    badge: fallback?.badge || "New",
    verifiedBy: fallback?.verifiedBy || "TONMAG",
    verifiedDate: fallback?.verifiedDate || "Pending verification",
    permit: fallback?.permit || "Contact TONMAG",
    inspection: fallback?.inspection || "Both",
    coordinates: fallback?.coordinates || { x: 50, y: 50 },
    description: typeof data.description === "string" ? data.description : fallback?.description || "Contact TONMAG for details.",
    titleType: fallback?.titleType || "Contact TONMAG",
    year: fallback?.year || "Available now",
    parking: fallback?.parking || 0,
    serviceChargeNgn: fallback?.serviceChargeNgn || 0,
    amenities: fallback?.amenities || [],
    highlights: fallback?.highlights || [],
    nearby: fallback?.nearby || [],
  }
}

export async function GET() {
  try {
    const snapshot = await getAdminDatabase().collection("properties").get()
    const managed = snapshot.docs
      .filter((document) => document.data().status === "published" && typeof document.data().name === "string")
      .map((document) => publicProperty(document.id, document.data()))
    return NextResponse.json(
      { properties: managed.length || process.env.NODE_ENV === "production" ? managed : fallbackProperties },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    )
  } catch {
    return NextResponse.json({ properties: process.env.NODE_ENV === "production" ? [] : fallbackProperties })
  }
}
