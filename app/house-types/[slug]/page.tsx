import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getHouseTypeBySlug, houseTypesData } from "@/lib/house-types-data";
import { notFound } from "next/navigation";
import { HouseTypeDetailContent } from "@/components/house-type-detail-content";

export function generateStaticParams() {
  return houseTypesData.map((house) => ({
    slug: house.slug,
  }));
}

export default async function HouseTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const houseType = getHouseTypeBySlug(slug);

  if (!houseType) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HouseTypeDetailContent houseType={houseType} />
      <Footer />
    </main>
  );
}
