import { cn } from '@/lib/utils';
import React from 'react';
import ReactTimeAgo, { TimeAgoProps as ReactTimeAgoProps } from 'timeago-react';

interface TimeAgoProps extends ReactTimeAgoProps {}
export const TimeAgo = ({ datetime, className }: TimeAgoProps) => {
	return <ReactTimeAgo datetime={datetime} className={cn(className)} />;
};
