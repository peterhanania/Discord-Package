import BadgeData from "../json/badges.json";
import Tippy from "@tippyjs/react";
import Image from "next/image";

type BadgeDataType = {
	[key: string]: Badge;
};

type Badge = {
	description: string;
	icon: string;
	undocumented?: boolean;
}

const badgeData = BadgeData as BadgeDataType;

export default function Badges({ data }: { data: any }) {
	return (
		<div className="flex flex-wrap items-center gap-1">
			{data.map((badgeKey: any) => {
				if (!badgeData[badgeKey]) return null;

				return (
					<Tippy
						key={badgeKey}
						content={badgeData[badgeKey]?.description}
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
