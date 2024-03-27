'use client';
import ApexCharts, { type ApexOptions } from 'apexcharts';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { ComponentPropsWithoutRef, ElementRef, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { RouterOutputs } from '@marketplace/api';
import { api } from '@/trpc/react';

interface ChartProps extends ComponentPropsWithoutRef<'div'> {
	options: ApexOptions;
}

export const Chart = ({ options }: ChartProps) => {
	const chartRef = useRef<ElementRef<'div'>>(null);
	useEffect(() => {
		const chartContainer = chartRef.current;
		if (!chartContainer) return;

		const chart = new ApexCharts(chartContainer, options);
		chart.render();
	}, []);
	return (
		<Card
			children={
				<div
					ref={chartRef}
					className="w-full bg-white rounded overflow-hidden p-8"
				/>
			}
		/>
	);
};

interface ActivityChartProps {
	slug: string;
}
const formatDate = (date: Date): string => {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'numeric',
		day: 'numeric',
		year: 'numeric',
	});
};
export const ActivityChart = ({ slug }: ActivityChartProps) => {
	const chartRef = useRef<ElementRef<'div'>>(null);
	const { data: activityChartData = [], isPending } =
		api.collection.getChartData.useQuery<any[]>({
			slug,
		});
	useEffect(() => {
		if (chartRef.current) {
			renderChart();
		}
	}, [activityChartData]);

	const renderChart = () => {
		const chartContainer = chartRef.current;
		if (!chartContainer) return;
		const options: ApexOptions = {
			series: [
				{
					name: 'Volume',
					data: activityChartData.map((a) => a.volume),
				},
			],
			chart: {
				height: 300,
				width: '100%',
				type: 'line',
				toolbar: {
					show: false,
				},
				fontFamily: 'var(--font-sans)',
				foreColor: '#8b3cff',
			},
			grid: {
				show: false,
			},
			stroke: {
				width: 1,
			},
			xaxis: {
				axisBorder: {
					show: false, // Set to false to hide the x-axis line
				},
				type: 'datetime',
				categories: activityChartData.map((a) => a.hour),
				tickAmount: 10,
				labels: {
					formatter: function (value: any, timestamp: any, opts: any) {
						return (
							timestamp && opts.dateFormatter(new Date(timestamp), 'dd MMM')
						);
					},
				},
			},
			yaxis: {
				// labels: {
				// 	formatter: function (value) {
				// 		return value / 1000000 + 'M'; // Format values in millions
				// 	},
				// },
			},
			colors: ['#8b3cff'],
		};
		const chart = new ApexCharts(chartContainer, options);
		chart.render();
	};
	return (
		<Card className="bg-white p-4">
			<h1 className="text-end mr-8 font-heading uppercase">Volume (VTRU)</h1>
			<div ref={chartRef} className="w-full  rounded overflow-hidden px-4" />
		</Card>
	);
};
export const MockChart = () => {
	return (
		<Chart
			options={{
				series: [
					{
						name: 'Sales',
						data: [
							4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5,
						],
					},
				],
				chart: {
					height: 300,
					width: '100%',
					type: 'line',
					toolbar: {
						show: false,
					},
				},
				stroke: {
					width: 2,
					curve: 'smooth',
				},
				xaxis: {
					type: 'datetime',
					categories: [
						'1/11/2000',
						'2/11/2000',
						'3/11/2000',
						'4/11/2000',
						'5/11/2000',
						'6/11/2000',
						'7/11/2000',
						'8/11/2000',
						'9/11/2000',
						'10/11/2000',
						'11/11/2000',
						'12/11/2000',
						'1/11/2001',
						'2/11/2001',
						'3/11/2001',
						'4/11/2001',
						'5/11/2001',
						'6/11/2001',
					],
					tickAmount: 10,
					labels: {
						formatter: function (value, timestamp, opts) {
							return (
								timestamp && opts.dateFormatter(new Date(timestamp), 'dd MMM')
							);
						},
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						shade: 'light',
						type: 'horizontal',
						shadeIntensity: 0.5,
						gradientToColors: ['#FFD700', '#6495ED', '#663399', '#FF6347'],
						inverseColors: false,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [0, 50, 100],
						colorStops: [],
					},
				},
				yaxis: {
					min: -10,
					max: 40,
				},
			}}
		/>
	);
};
