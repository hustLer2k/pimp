"use client";
import { useState, useEffect } from "react";

export default function Slideshow({ icons }: { icons: JSX.Element[] }) {
	const [currentIcon, setCurrentIcon] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIcon((currentIcon + 1) % icons.length);
		}, 3333);

		return () => clearInterval(interval);
	}, [currentIcon, icons.length]);

	return <div className="animate-fadein">{icons[currentIcon]}</div>;
}
