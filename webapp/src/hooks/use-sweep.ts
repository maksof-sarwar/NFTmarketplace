'use client'
import { RouterOutputs } from '@marketplace/api';
import { Activity, CollectionToken } from '@marketplace/db';
import React, { useState } from 'react';
import { create } from 'zustand';

export type Sweep = Pick<Activity, 'listingId' | 'price' | 'tokenId'>;
interface UseSweep {
	sweepItems: Sweep[];
	setSweep: (sweepItems: Sweep[]) => void
}
// export const useSweep = ({ collectionTokens }: UseSweep) => {
// 	const [sweep, setSweep] = useState<
// 		Array<Pick<Activity, 'listingId' | 'price' | 'tokenId'>>
// 	>([]);

// 	const onNumberInput = (e) => {
// 		// const _value = Number(e);
// 		// if (_value <= collectionTokens?.length) {
// 		// 	return setSweep(activeTokens.slice(0, _value));
// 		// }
// 		// setSweep(activeTokens.slice(0, collectionTokens.length));
// 	}
// 	return {}
// };



export const useSweep = create<UseSweep>((set, get) => ({
	sweepItems: [],
	setSweep: (sweepItems: Sweep[]) => {
		set({
			sweepItems
		})
	},
}))
