const fs = require("fs");
const path = require("path");

const searchDirectory = (dir) => {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			searchDirectory(filePath);
		} else if (stat.isFile()) {
			if (file.endsWith(".js") || file.endsWith(".json")) {
				const content = fs.readFileSync(filePath, "utf-8");
				const newContent = content.replace(
					/@dicebear\/core/g,
					"dicebear-core"
				);

				if (newContent !== content) {
					fs.writeFileSync(filePath, newContent);
					console.log(`Replaced @dicebear in ${filePath}`);
				}
			}
		}
	});
};

searchDirectory("./node_modules");
