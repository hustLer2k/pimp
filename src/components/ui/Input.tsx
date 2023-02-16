"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

interface Props {
	label: string;
	predicate: (value: string) => readonly [boolean, string];
	labelVisible?: boolean;
	inputOptions?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Input = forwardRef(function Input(
	{ label, predicate, labelVisible = false, inputOptions = {} }: Props,
	inputRef
) {
	inputOptions = {
		id: label.trim().replace(/\s+/, "-"),
		placeholder: label,
		type: "text",
		required: true,
		...inputOptions,
	};
	const [value, setValue] = useState("");
	const [error, setError] = useState("");
	const [touched, setTouched] = useState(false);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		inputOptions?.onChange?.(e);
	};
	const blurHandler = (e: React.FocusEvent<HTMLInputElement>) =>
		setTouched(true);

	useEffect(() => {
		let val = value.trim();

		const [validity, error] = predicate(val);
		const invalidity = !validity && touched;

		if (invalidity) {
			setError(error);
		} else {
			setError("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, touched]); // don't force importers to wrap validator functions in useCallback

	useImperativeHandle(
		inputRef,
		() => {
			let valueTrimmed = value.trim();
			let validity = predicate(valueTrimmed)[0];

			return {
				value: valueTrimmed,
				isValid: validity,
				isInvalid: !validity && touched,
				touch: () => setTouched(true),
				reset: () => {
					setValue("");
					setError("");
					setTouched(false);
				},
			};
		}, // eslint-disable-next-line react-hooks/exhaustive-deps
		[value, error, touched] // don't force importers to wrap validator functions in useCallback
	);

	return (
		<div className="-space-y-px shadow-sm">
			<label
				htmlFor={inputOptions.id}
				className={`block text-sm font-medium text-gray-700 mb-2 ${
					labelVisible ? "" : "sr-only"
				}`}
			>
				{label}
			</label>
			{error && (
				<p
					className="border-red-500 text-grey-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500 relative block w-full appearance-none rounded-none
                              rounded-t-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm"
				>
					{error}
				</p>
			)}
			<input
				{...inputOptions}
				className={
					"relative block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm " +
					inputOptions.className
				}
				onChange={changeHandler}
				onBlur={blurHandler}
			/>
		</div>
	);
});

export default Input;

interface InputRef {
	value: string;
	isValid: boolean;
	isInvalid: boolean;

	touch: () => void;
	reset: () => void;
}
export type { InputRef };
