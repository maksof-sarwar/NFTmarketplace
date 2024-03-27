import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import React, { Fragment, Suspense } from "react";
import { Statstics1, Statstics2 } from "./_component/statstics";
import { redirect } from "next/navigation";
import { Button, RefreshButton } from "@/components/ui/button";
import Image from "next/image";
import { ChakraTab, ChakraTabs, TabList } from "@/components/chakra-tabs";
import { TokenList } from "./_component/token-list";
type Props = {
  params: any;
  searchParams: any;
};
export default async ({ params }: Props) => {
  const address = params.slug as string;
  const collection = await api.collection.getCollectionStats({
    slug: address,
  });

  if (!collection) {
    return redirect("/collection");
  }
  return (
    <div className="space-y-8">
      <Card
        style={{
          backgroundImage: `url(${collection.banner})`,
        }}
        className={cn("2xl:max-h-[450px] aspect-video w-full max-h-[418px]  relative  h-screen block   overflow-hidden   bg-cover bg-no-repeat bg-center p-4")}
      >
        <CardContent className={cn("rounded-md overflow-hidden p-0  gap-x-4 relative object-cover flex items-end   h-full w-full")}>
          <Statstics1 collection={collection} />

          <Statstics2 collection={collection} />
        </CardContent>
      </Card>
      <TokenList slug={collection.slug} traits={collection.traits} />
    </div>
  );
};
