import chalk from "chalk";
import moment from "moment";

/**
 * Copies the specified text value to the user's clipboard.
 *
 * @param value - The string content to copy to the clipboard.
 * @returns A promise that resolves to true if the text was successfully copied; otherwise, it resolves to false.
 *
 * @example
 * ```typescript
 * const success = await copyToClipboard("Hello, world!");
 * if (success) {
 *   console.log("Text was copied to the clipboard.");
 * } else {
 *   console.error("Failed to copy text.");
 * }
 * ```
 */
export default async function copyToClipboard(value: string): Promise<boolean> {
	const isDebug = localStorage.getItem("debug") === "true";
	try {
		await navigator.clipboard.writeText(value);
		if (isDebug) {
			console.log(
				chalk.bold.blue(`[DEBUG] `) +
				chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
				`  ${chalk.yellow(`Content copied to clipboard`)}`
			);
		}
		return true;
	} catch (err) {
		if (isDebug) {
			console.error(
				chalk.bold.blue(`[DEBUG] `) +
				chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
				`  ${chalk.yellow(`Failed to copy: ${err}`)}`
			);
		}
		return false;
	}
}