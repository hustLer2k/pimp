export default function getExtension(filename: string) {
	const matches = filename.match(/\w+(\.\w+)$/);
	const extension = matches ? matches[1] : "";

	return extension;
}
