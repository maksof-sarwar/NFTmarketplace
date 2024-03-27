'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Currency } from '@/components/currency';
import { Icons } from '@/components/icons';
import { Owner } from '@/components/token-owner';
import { Autoplay, EffectFade, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

type Data = {
	floor: number | string;
	name: string;
	'1DVolume': number | string;
	address: string;
	supply: number;
	chain: 'VITRUVEO';
	banner: string;
	logo: string;
	released: boolean;
	slug: string;
};

interface ShowcaseProps {
	slideData: Data[];
}

export const Showcase = ({ slideData }: ShowcaseProps) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

	return (
		<Fragment>
			<Swiper
				modules={[EffectFade, Thumbs, Autoplay]}
				effect="fade"
				simulateTouch={false}
				thumbs={{ swiper: thumbsSwiper }}
				loop={true}
				spaceBetween={10}
				navigation={false}
				autoplay={{
					delay: 250000,
				}}
				className="swiper__main "
			>
				{slideData.map((slide, index) => (
					<SwiperSlide key={index}>
						<Card
							style={{
								backgroundImage: `url(${slide.banner})`,
							}}
							className={cn(
								'2xl:max-h-[450px] aspect-video w-full max-h-[418px]  relative  h-screen block   overflow-hidden   bg-cover bg-no-repeat bg-center'
							)}
						>
							<CardContent
								className={cn(
									'rounded-md overflow-hidden  relative object-cover h-full p-4'
								)}
							>
								<Component data={slide} />
							</CardContent>
						</Card>
					</SwiperSlide>
				))}
			</Swiper>
			<Swiper
				onSwiper={setThumbsSwiper}
				loop={true}
				spaceBetween={10}
				breakpoints={{
					'@0.00': {
						slidesPerView: 2,
						spaceBetween: 10,
					},
					'@0.75': {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					'@1.00': {
						slidesPerView: 4,
						spaceBetween: 10,
					},
					'@1.50': {
						slidesPerView: 4,
						spaceBetween: 15,
					},
				}}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[Thumbs]}
				className="swiper__thumb "
			>
				{slideData.map((slide, index) => (
					<SwiperSlide key={index}>
						<div
							style={{ backgroundImage: `url(${slide.banner})` }}
							className={cn(
								'2xl:max-h-[200px] w-full max-h-[160px] aspect-video relative   block rounded-md  overflow-hidden   bg-cover bg-no-repeat bg-center'
							)}
						>
							<div className="fixed flex  overlay top-0 left-0 w-full h-full bg-white bg-opacity-70 z-40  justify-center items-center rounded-md"></div>
							<h3 className="font-heading gap-1  pt-3 pl-4 uppercase text-white inline-flex justify-center items-center">
								<Icons.dot />
								{slide.name}
							</h3>
							<div className="absolute left-3 bottom-3 z-50  rounded-md 2xl:size-[80px] size-[65px] overflow-hidden ">
								<Image src={slide.logo} alt="logo" height={150} width={150} />
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<style>{`
				.swiper__main {
					height: 80%;
					width: 100%;
				}
      
        .swiper__thumb {
          height: 20%;
          box-sizing: border-box;
          padding: 10px 0;
        }
        
        .swiper__thumb .swiper-slide {
          width: 25%;
          height: 100%;
          opacity: 1;
					// border: 2px solid transparent;
					// border-radius: calc(var(--radius) - 2px) !important;
        }
        
        .swiper__thumb .swiper-slide-thumb-active {
          border-color: hsl(var(--primary));
        }
        .swiper__thumb .swiper-slide-thumb-active .overlay {
					display: none !important;
        }
				
        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
		</Fragment>
	);
};

function Component({ data }: { data: Data }) {
	return (
		<Card className="bg-black/50 xl:max-w-[220px] max-w-[212px]">
			<CardContent className="p-0  relative object-cover h-full">
				<Icons.dot className="text-xl absolute left-3 top-3"></Icons.dot>
				<Image
					src={data.logo}
					alt="logo"
					className="overflow-hidden aspect-square 2xl:max-h-[204px] xl:max-h-[172px] max-h-[176px] rounded-md w-full"
					quality={100}
					width={200}
					height={200}
				/>
				<div className="flex flex-col  uppercase text-white text-sm">
					<section className="flex flex-col p-3 gap-y-3">
						<div className="flex justify-between">
							<h3 className="font-heading ">FLOOR</h3>
							<Currency
								value={data.floor}
								iconClassName="text-white"
								className="text-gray-300"
							/>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading ">1D Volume</h3>
							<Currency
								value={data['1DVolume']}
								iconClassName="text-white"
								className="text-gray-300"
							/>
						</div>

						<div className="flex justify-between">
							<h3 className="font-heading ">Owners</h3>
							<Owner
								address={data.address}
								className="text-gray-300  font-sans"
							/>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading ">Supply</h3>
							<span className="text-gray-300  font-sans">{data.supply}</span>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading ">Chain</h3>
							<span className="text-gray-300  font-sans">{data.chain}</span>
						</div>
					</section>
					{data.released ? (
						<Link
							href={{
								pathname: `collection/${data.slug}`,
							}}
							className={cn(
								buttonVariants({
									variant: 'default',
									className: ' text-white uppercase font-heading px-10',
								})
							)}
						>
							View Collection
						</Link>
					) : (
						<Button
							disabled
							variant="outline"
							className="hover:bg-primary  text-white bg-transparent backdrop-filter backdrop-blur-lg px-10"
						>
							Coming Soon
						</Button>
					)}
				</div>
				{/* <Card className="bg-transparent text-white ">
				</Card> */}
			</CardContent>
		</Card>
	);
}
