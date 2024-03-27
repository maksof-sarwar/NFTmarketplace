import { Table } from './_component/table';

export default () => {
	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-x-4 my-10">
				<h1 className="text-3xl font-sans dark:text-white">Collection Stats</h1>
			</div>
			<main className="space-y-4">
				<Table />
			</main>
		</div>
	);
};
