import BadgeData from "../json/badges.json";
import Tippy from "@tippyjs/react";
import Image from "next/image";

type BadgeDataType = {
	[key: string]: Badge;
};

type Badge = {
	description: string;
	icon: string;
}

const badgeData = BadgeData as BadgeDataType;

type BadgesProps = {
	data: string[];
	nitroUntil: string;
};

export default function Badges({ data, nitroUntil }: BadgesProps) {
	// Ideally there's a better way to do this, but with the current setup this will have to do. If more placeholders are needed in badges, we can update this.
	const fillPlaceholder = (description: string): string => {
		if (description.includes("{nitroExpiry}")) {
			const date = new Date(nitroUntil);
			const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
			const formattedDate = date.toLocaleDateString("en-US", options);
			return description.replace("{nitroExpiry}", formattedDate);
		}

		return description;
	};

	return (
		<div className="flex flex-wrap items-center gap-1">
			{data.map((badgeKey: any) => {
				if (!badgeData[badgeKey]) return null;

				return (
					<Tippy
						key={badgeKey}
						content={fillPlaceholder(badgeData[badgeKey]?.description)}
					>
						<div className="opacity-90 hover:opacity-100 relative w-6 h-6 sm:w-8 sm:h-8">
							<Image src={badgeData[badgeKey]?.icon} alt={badgeData[badgeKey]?.description} layout="fill" />
						</div>
					</Tippy>
				);
			})}
		</div>
	);
}
