import Twemoji from "react-twemoji";
import emojisJson from "../../json/demo/emojis.json";

export default function Emoji({ emoji }: { emoji: any }) {
	const isCustomEmoji =
		(emoji.emoji && emoji.emoji.startsWith("<") && emoji.emoji.endsWith(">")) || (/^\d+$/.test(emoji.name) && emoji.name.length > 12);

	let emojiId = '';

	if (isCustomEmoji) {
		if (emoji.emoji) {
			emojiId = emoji.emoji.match(/\d+/)?.[0] || '';
		} else {
			emojiId = emoji.name;
		}
	}

	if (isCustomEmoji) {
		return (
			<img
				src={`https://cdn.discordapp.com/emojis/${emojiId}.webp?size=80`}
				alt="emoji"
				height={50}
				width={50}
				draggable={false}
				style={{
					maxWidth: "100%",
					height: "auto"
				}} />
		)
	} else if (emoji.name) {
		return (
			<Twemoji>
				{(emojisJson as any)[emoji.name]
					? (emojisJson as any)[emoji.name]
					: emoji.name as any}
			</Twemoji>
		)
	} else {
		return (
			<Twemoji options={{ className: 'twemoji' }}>
				<div>
					{emoji.emoji}
				</div>
			</Twemoji>
		)
	}
}