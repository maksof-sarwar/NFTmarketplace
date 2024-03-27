export const Countdown = () => {
	return (
		<div className="flex gap-4 ">
			<div className="flex flex-col gap-2">
				<div className="px-4 py-2 text-2xl text-center border rounded-md border-primary bg-white text-primary">
					0
				</div>
				<span className="capitalize">Hours </span>
			</div>
			<span className="text-4xl inline-block">:</span>
			<div className="flex flex-col gap-2">
				<div className="px-4 py-2 text-2xl  text-center border rounded-md border-primary bg-white text-primary">
					0
				</div>
				<span className="capitalize">Minutes</span>
			</div>
			<span className="text-4xl inline-block">:</span>
			<div className="flex flex-col gap-2">
				<div className="px-4 py-2 text-2xl  text-center border rounded-md border-primary bg-white text-primary">
					0
				</div>
				<span className="capitalize">Seconds</span>
			</div>
		</div>
	);
};
