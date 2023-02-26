"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useSupabase } from "@/components/store/supa-provider";
import Link from "next/link";
import { roboto_mono } from "@/components/ui/fonts";

const Search = () => {
	const { supabase } = useSupabase();
	const [searchResults, setSearchResults] = useState<
		null | { username: string }[]
	>(null);
	const [expanded, setExpanded] = useState(false);
	const [searchQuery, setQuery] = useState("");

	function inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
		const query = e.target.value.trim();
		if (!query) return;

		setQuery(query);
	}

	useEffect(() => {
		let timer = setTimeout(async () => {
			if (!searchQuery) return;

			const { data, error } = await supabase
				.from("profiles")
				.select("username")
				.ilike("username", `%${searchQuery}%`);

			error && console.error(error);

			if (!error && data.length !== 0) {
				setSearchResults(data);
				focusHandler();
			} else {
				setSearchResults(null);
			}
		}, 250);

		return () => clearTimeout(timer);
	}, [searchQuery, supabase]);

	const blurHandler = (e: React.FocusEvent<HTMLDivElement>) => {
		// console.log(e.target.tagName);

		setTimeout(() => setExpanded(false), 300); // to do: find a better solution
		// without the timeout clicks on search results will not be processed
	};
	const focusHandler = () => {
		setExpanded(true);
	};

	return (
		<div className="relative" onFocus={focusHandler} onBlur={blurHandler}>
			<div className="search hover:ring-4 hover:ring-purple-600 peer w-[20vw] h-10">
				<input
					className="search-input"
					type="text"
					placeholder="Search..."
					onChange={inputChangeHandler}
				/>
				<FaSearch size="18" className="text-secondary my-auto" />
			</div>
			{expanded && (
				<div className="rounded-md shadow dark:bg-gray-800 bg-gray-400 z-10 overflow-auto absolute top-10 left-0 w-full max-h-60">
					{searchResults?.map(({ username }) => (
						<Link
							key={username}
							href={`/${username}`}
							className={`${roboto_mono.className} block border-b border-purple-100 py-2 px-1 dark:text-white text-gray-700 text-md hover:bg-purple-200 dark:hover:bg-purple-800`}
						>
							{username}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Search;
