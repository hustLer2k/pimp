"use client";
import { useState, useEffect } from "react";

export default function Slideshow({ icons }: { icons: JSX.Element[] }) {
	const [currentOffset, setCurrentOffset] = useState(0);
	const [backwards, setDirection] = useState(false);
	const maxOffset = (icons.length - 1) * 48;

	useEffect(() => {
		const interval = setInterval(() => {
			if (currentOffset === 0) setDirection(false);
			if (currentOffset >= maxOffset) setDirection(true);

			if (backwards) setCurrentOffset(currentOffset - 1);
			else setCurrentOffset(currentOffset + 1);
		}, 47);

		return () => clearInterval(interval);
	}, [currentOffset, icons.length, maxOffset, backwards]);

	return (
		<div className="h-12 overflow-hidden relative">
			<div
				style={{ transform: `translateX(-${currentOffset}px)` }}
				className="h-full flex items-center"
			>
				{icons}
			</div>
		</div>
	);
}
