'use client';
import { NftToken } from '@/types';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

interface CartState {
	cart: NftToken[];
}

export const useCart = create(
	combine({ cart: [] } as CartState, (set, get) => {
		return {};
	})
);
