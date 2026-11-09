export type Property = {
  id: string
  name: string
  location: string
  area: string
  type: "Apartment" | "Villa" | "Terrace"
  status: "Ready" | "Off-plan" | "Under construction"
  image: string
  images: string[]
  priceNgn: number
  priceForeign: string
  foreignCurrency: "USD" | "GBP" | "CAD"
  beds: number
  baths: number
  sqm: number
  badge: "Signature" | "New" | "Virtual Tour"
  verifiedBy: string
  verifiedDate: string
  permit: string
  inspection: "Virtual" | "In-person" | "Both"
  coordinates: { x: number; y: number }
  description: string
  titleType: string
  year: string
  parking: number
  serviceChargeNgn: number
  amenities: string[]
  highlights: string[]
  nearby: { name: string; time: string; type: "airport" | "school" | "health" | "leisure" }[]
}

export const properties: Property[] = [
  {
    id: "1",
    name: "The Nouveau Residence",
    location: "Maitama, Abuja",
    area: "Maitama",
    type: "Villa",
    status: "Ready",
    image: "/M1.JPG",
    images: ["/M1.JPG", "/M2.JPG", "/M4.JPG", "/M6.JPG"],
    priceNgn: 485000000,
    priceForeign: "$303,125",
    foreignCurrency: "USD",
    beds: 5,
    baths: 6,
    sqm: 740,
    badge: "Signature",
    verifiedBy: "TONMAG Legal",
    verifiedDate: "18 Oct 2026",
    permit: "FCT DLA/MT/1842",
    inspection: "Both",
    coordinates: { x: 56, y: 28 },
    description: "A landmark five-bedroom residence shaped around privacy, natural light, and effortless indoor-outdoor living. The home pairs generous entertaining rooms with a quieter family wing, a private study, and considered staff accommodation. Every system can be monitored through TONMAG's remote ownership service.",
    titleType: "Certificate of Occupancy",
    year: "2026",
    parking: 4,
    serviceChargeNgn: 6800000,
    amenities: ["Private pool", "Home automation", "Solar-ready power", "Cinema room", "Staff quarters", "Private garden", "CCTV perimeter", "Treated water"],
    highlights: ["Double-height arrival gallery", "Italian kitchen and back kitchen", "Primary suite with private terrace", "Managed estate security"],
    nearby: [{ name: "Transcorp Hilton", time: "7 min", type: "leisure" }, { name: "Nnamdi Azikiwe Airport", time: "34 min", type: "airport" }, { name: "British International School", time: "12 min", type: "school" }, { name: "Maitama District Hospital", time: "8 min", type: "health" }],
  },
  {
    id: "2",
    name: "Canopy House",
    location: "Ikoyi, Lagos",
    area: "Ikoyi",
    type: "Apartment",
    status: "Under construction",
    image: "/high-rise-luxury-apartment-building.jpg",
    images: [
      "/high-rise-luxury-apartment-building.jpg",
      "/luxury-apartment-interior-showcase.jpg",
      "/premium-residential-tower-victoria-island.jpg",
      "/modern-office-and-residential-tower.jpg",
    ],
    priceNgn: 320000000,
    priceForeign: "£158,400",
    foreignCurrency: "GBP",
    beds: 4,
    baths: 4,
    sqm: 312,
    badge: "New",
    verifiedBy: "Lagos State Lands Bureau",
    verifiedDate: "02 Sep 2026",
    permit: "LASPPPA/IKY/0921",
    inspection: "Virtual",
    coordinates: { x: 35, y: 58 },
    description: "A composed high-rise address with expansive Lagos views, resident-only amenities, and hotel-level arrival. Canopy House is designed for lock-up-and-leave ownership, with professional facilities management and construction reporting available inside your portfolio.",
    titleType: "Governor's Consent",
    year: "Q3 2027",
    parking: 2,
    serviceChargeNgn: 5200000,
    amenities: ["Residents' lounge", "Infinity pool", "Fitness studio", "Concierge", "Backup power", "Two lifts", "Access control", "Visitor parking"],
    highlights: ["Private lift lobby", "Full-height city glazing", "Bespoke joinery package", "Managed rental option"],
    nearby: [{ name: "Ikoyi Club", time: "6 min", type: "leisure" }, { name: "Murtala Muhammed Airport", time: "35 min", type: "airport" }, { name: "Greenwood House School", time: "9 min", type: "school" }, { name: "Lagoon Hospital", time: "11 min", type: "health" }],
  },
  {
    id: "3",
    name: "Ocean House Penthouse",
    location: "Victoria Island, Lagos",
    area: "Victoria Island",
    type: "Apartment",
    status: "Ready",
    image: "/premium-residential-tower-victoria-island.jpg",
    images: [
      "/premium-residential-tower-victoria-island.jpg",
      "/luxury-apartment-interior-showcase.jpg",
      "/luxury-villa-pool.png",
      "/residential-complex-with-landscaping.jpg",
    ],
    priceNgn: 265000000,
    priceForeign: "C$231,875",
    foreignCurrency: "CAD",
    beds: 3,
    baths: 4,
    sqm: 284,
    badge: "Virtual Tour",
    verifiedBy: "Olaniwun Ajayi LP",
    verifiedDate: "27 Aug 2026",
    permit: "GOV/CONSENT/VI/7714",
    inspection: "Both",
    coordinates: { x: 70, y: 66 },
    description: "An elevated three-bedroom penthouse balancing panoramic water views with quiet, deeply considered interiors. A private arrival, wraparound terrace, and resident concierge make it particularly suited to owners who divide their time between Lagos and abroad.",
    titleType: "Governor's Consent",
    year: "2025",
    parking: 3,
    serviceChargeNgn: 4600000,
    amenities: ["Ocean terrace", "Private lift", "Rooftop pool", "Concierge", "Gym", "Backup power", "Treated water", "24-hour security"],
    highlights: ["270-degree water views", "Private entertaining terrace", "Natural stone bathrooms", "Turnkey furniture option"],
    nearby: [{ name: "Eko Atlantic", time: "5 min", type: "leisure" }, { name: "Murtala Muhammed Airport", time: "32 min", type: "airport" }, { name: "American International School", time: "16 min", type: "school" }, { name: "Reddington Hospital", time: "7 min", type: "health" }],
  },
  {
    id: "4",
    name: "Palm Court Terraces",
    location: "Lekki Phase 1, Lagos",
    area: "Lekki",
    type: "Terrace",
    status: "Off-plan",
    image: "/luxury-residential-complex-with-gardens.jpg",
    images: [
      "/luxury-residential-complex-with-gardens.jpg",
      "/luxury-villa-pool.png",
      "/modern-luxury-apartment-building-exterior.jpg",
      "/luxury-apartment-interior-showcase.jpg",
    ],
    priceNgn: 185000000,
    priceForeign: "$115,625",
    foreignCurrency: "USD",
    beds: 4,
    baths: 5,
    sqm: 360,
    badge: "New",
    verifiedBy: "Lagos State Lands Bureau",
    verifiedDate: "11 Oct 2026",
    permit: "LASPPPA/LK1/6680",
    inspection: "In-person",
    coordinates: { x: 78, y: 38 },
    description: "A collection of modern four-bedroom terraces set behind a calm landscaped court in Lekki Phase 1. Flexible milestone payments, visible construction reporting, and a dedicated handover team make the path from reservation to move-in unusually clear.",
    titleType: "Governor's Consent",
    year: "Q4 2027",
    parking: 2,
    serviceChargeNgn: 3400000,
    amenities: ["Landscaped court", "Children's play area", "Smart access", "Backup power", "Solar provision", "Staff room", "Visitor parking", "Estate management"],
    highlights: ["Open-plan garden level", "Four en-suite bedrooms", "Rooftop family lounge", "Flexible construction payments"],
    nearby: [{ name: "Nike Art Gallery", time: "8 min", type: "leisure" }, { name: "Murtala Muhammed Airport", time: "40 min", type: "airport" }, { name: "Children's International School", time: "10 min", type: "school" }, { name: "Evercare Hospital", time: "14 min", type: "health" }],
  },
]

export const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)

