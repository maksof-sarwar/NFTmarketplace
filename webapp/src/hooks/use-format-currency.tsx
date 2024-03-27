import { formatCurrency as _formatCurrency } from '@/lib/utils';
import { useCallback } from 'react';

type Currency = Parameters<typeof _formatCurrency>;
export const useFormatCurrency = () => {
	return useCallback((...args: Currency) => _formatCurrency(...args), []);
};
