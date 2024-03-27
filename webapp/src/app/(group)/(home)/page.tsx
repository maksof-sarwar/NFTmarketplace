import { Showcase } from "./_components/showcase";
import { api } from "@/trpc/server";
import { Table } from "./_components/table";

export default async function Home() {
  const collections = await api.collection.getTopCollections({
    duration: "24H",
  });
  return (
    <main className="flex flex-col">
      <Showcase
        slideData={collections.map((collection) => ({
          "1DVolume": collection.sold_activity_count,
          address: collection.address,
          banner: collection.banner,
          chain: "VITRUVEO",
          floor: collection.floorPrice,
          logo: collection.logo,
          name: collection.metadata.name,
          released: true,
          slug: collection.slug,
          supply: collection.metadata.totalSupply,
        }))}
      />
      <Table />
    </main>
  );
}
