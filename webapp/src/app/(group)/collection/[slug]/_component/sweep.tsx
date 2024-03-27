"use client";
import { Icons } from "@/components/icons";
import React, { Fragment, useCallback, useState } from "react";
import { SweepButton } from "./sweep-button";
import { Button } from "@/components/ui/button";
import { useSweep } from "@/hooks/use-sweep";
import { CollectionTokens } from "@/types";
import { useContract } from "@/hooks/use-contract";
import { toast } from "@/lib/toast";

interface SweepProps {
  tokens: CollectionTokens[];
}
export const Sweep = ({ tokens }: SweepProps) => {
  const { loading, sweepBuy, sweepItemsLength } = useBuySweepItems({ tokens });
  return (
    <div className="flex gap-x-4 items-center">
      <span className="text-primary  font-heading uppercase gap-2 inline-flex items-center">
        <span className="gap-2 inline-flex items-center">
          <Icons.dot className="text-base" />
          <span>{tokens.length}</span>
        </span>
        <span className="font-thin font-sans">Results</span>
      </span>
      <div className="flex gap-x-2">
        <SweepButton tokens={tokens} />
        <Button disabled={sweepItemsLength === 0} onClick={sweepBuy} isLoading={loading} className="px-8 font-heading text-xs">
          Buy Sweep Items
        </Button>
      </div>
    </div>
  );
};

function useBuySweepItems({ tokens }: SweepProps) {
  const { sweepItems } = useSweep();
  const { exec, web3 } = useContract();
  const [loading, setLoading] = useState(false);
  const sweepBuy = useCallback(async () => {
    setLoading(true);
    try {
      const address = tokens[0].address;
      const listingIds = sweepItems.map((token) => token.listingId);
      const totalPrice = sweepItems.reduce((p, c) => p + Number(c.price), 0).toString();
      const firstListingId = listingIds[0];
      const firstListing = await exec("listings", "call", {}, firstListingId);
      if (!firstListing.active) {
        throw new Error("At least one of the listed NFTs is not active.");
      }
      const tx = await exec(
        "sweepNFT",
        "send",
        {
          value: web3?.utils.toWei(totalPrice, "ether"),
        },
        address,
        listingIds
      );
      if (tx) {
        toast({
          status: "success",
          description: "Successfully buy: tx is" + tx?.transactionHash,
        });
      }
    } catch (error: any) {
      toast({
        status: "error",
        description: "Error sweeping NFTs:" + error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [sweepItems, tokens]);

  return {
    loading,
    sweepBuy,
    sweepItemsLength: sweepItems.length,
  };
}
