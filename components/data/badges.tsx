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
};

export default function Badges({ data }: BadgesProps) {
	return (
        (<div className="flex flex-wrap items-center gap-1">
            {data.map((badgeKey: any) => {
				if (!badgeData[badgeKey]) return null;

				return (
                    (<Tippy
						key={badgeKey}
						content={badgeData[badgeKey]?.description}
					>
                        <div className="opacity-90 hover:opacity-100 relative w-6 h-6 sm:w-8 sm:h-8">
							<Image
                                src={badgeData[badgeKey]?.icon}
                                alt={badgeData[badgeKey]?.description}
                                fill
                                sizes="100vw" />
						</div>
                    </Tippy>)
                );
			})}
        </div>)
    );
}
