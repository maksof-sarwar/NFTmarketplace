"use client";
import { Icons } from "@/components/icons";
import { RouterOutputs } from "@marketplace/api";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { CollectionMetadata } from "@/types";
interface Props {
  token: RouterOutputs["collectionToken"]["getCollectionTokensByTokenId"];
  metadata: CollectionMetadata;
}
export const CollectionName = ({ token, metadata }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      <Image src={token!.collection.logoMedia.url} width={70} height={70} alt="" className="rounded-xl" />
      <h1 className="flex items-center gap-x-2 dark:text-white uppercase font-heading">
        <Icons.dot />
        <Link href={`/collection/${token!.collection.slug}`} className="text-xl font-medium hover:underline">
          {metadata.name}
        </Link>
      </h1>
    </div>
  );
};
