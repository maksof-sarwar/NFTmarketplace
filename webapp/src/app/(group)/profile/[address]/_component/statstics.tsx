"use client";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { Currency } from "@/components/currency";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/pending";
import { SocialGrid } from "@/components/social-grid";
import { Owner } from "@/components/token-owner";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { useContract } from "@/hooks/use-contract";
import { toast } from "@/lib/toast";
import { deleteCollectionImage, uploadCollectionImage } from "@/lib/upload-image";
import { cn, shortenAddress } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@marketplace/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useMemo } from "react";
import { data } from "tailwindcss/defaultTheme";
interface StatsticsProps {
  userAddress: string;
}
export const Statstics = ({ userAddress }: StatsticsProps) => {
  const {
    data: userNfts = [],
    isFetching,
    refetch,
  } = api.userProfile.getUserNfts.useQuery({
    userAddress,
  });
  const { data: profileImage, isLoading } = api.userProfile.getUserProfileImage.useQuery(
    {
      userAddress,
    },
    { refetchOnWindowFocus: false }
  );
  const { account } = useContract();

  const stats = useMemo(() => {
    return {
      ownedNfts: userNfts.reduce<number>((p, c) => p + c.length, 0),
      onSale: userNfts.reduce<number>(
        (p, c) =>
          p +
          // @ts-ignore
          c.map((cc) => cc.latestActivity?.activity?.type === "LISTING").length,
        0
      ),
      estValue: userNfts.reduce<number>(
        (p, c) =>
          p +
          c.reduce<number>((pp, cc) => {
            // @ts-ignore
            const activity = cc.latestActivity?.activity;
            if (activity?.type === "LISTING") {
              pp += Number(activity.price);
            }
            return pp;
          }, 0),
        0
      ),
    };
  }, [userNfts]);
  return (
    <Card className="bg-black/50 relative w-full max-w-56 ml-3 ">
      <div className="relative w-56 h-36  group">
        <div className="absolute -top-28	 size-56 flex flex-col  justify-center items-center">
          {userAddress === account && <ChangeAvatar userAddress={userAddress} path={profileImage?.image?.path ?? undefined} />}
          {isLoading ? (
            <Spinner className="text-white" />
          ) : (
            <div className="rounded-full w-full h-full overflow-hidden border-8 border-white">
              <Image src={profileImage?.image?.url ?? `https://static-assets.pallet.exchange/pfp/user3.jpg`} className="object-cover w-full h-full" alt="logo" width={250} height={250} />
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-0">
        <div className="flex flex-col  uppercase  text-white">
          <section className="flex flex-col p-3 gap-y-4">
            <div className="inline-flex gap-2 my-4 items-center justify-center uppercase w-full">
              <span className="text-2xl">{shortenAddress(userAddress)} </span>
              <CopyToClipboard iconClassName="text-white" text={userAddress} />
            </div>
            <div className="flex justify-between">
              <h3 className="font-heading text-xs">Owned</h3>
              <span className="text-gray-300 text-xs font-sans">{stats.ownedNfts}</span>
            </div>
            <div className="flex justify-between">
              <h3 className="font-heading text-xs">On Sale</h3>
              <span className="text-gray-300 text-xs font-sans">{stats.onSale}</span>
            </div>
            <div className="flex justify-between">
              <h3 className="font-heading text-xs">Offers</h3>
              <span className="text-gray-300 text-xs font-sans">0</span>
            </div>

            <div className="flex justify-between">
              <h3 className="font-heading text-xs">Est val</h3>
              <Currency value={stats.estValue} className="text-gray-300 text-xs font-sans" iconClassName="text-gray-300" />
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

function ChangeAvatar({ userAddress, path }: { userAddress: string; path?: string }) {
  const utils = api.useUtils();
  const { mutateAsync } = api.userProfile.updateUserProfileImage.useMutation();
  const pickImage = useCallback(
    async (files: FileList | null) => {
      if (files && files.length > 0) {
        const file = files[0];
        path && deleteCollectionImage(path);
        const { path: newPath, url } = await uploadCollectionImage(file);
        await mutateAsync({
          image: {
            path: newPath,
            url,
          },
          userAddress,
        });
        await utils.userProfile.getUserProfileImage.invalidate();
      }
      toast({
        status: "info",
        description: "Avatar update successfully",
      });
    },
    [userAddress, path]
  );
  return (
    <div className="hidden group-hover:block absolute top-6 right-6   ">
      <label htmlFor="change-avatar">
        <span className="icon-[mdi--pencil] cursor-pointer text-2xl    mix-blend-difference z-10"></span>
      </label>

      <input
        hidden
        type="file"
        id="change-avatar"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          pickImage(e.target.files);
        }}
      />
    </div>
  );
}
