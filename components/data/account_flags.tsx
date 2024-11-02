import AccountFlagData from "../json/account_flags.json";
import Tippy from "@tippyjs/react";
import Image from "next/image";

type AccountFlagDataType = {
	[key: string]: Flag;
};

type Flag = {
	description: string;
	icon: string;
}

const flagData = AccountFlagData as AccountFlagDataType;

export default function AccountFlags({ data }: { data: string[] }) {
	return (
		<div className="flex flex-wrap items-center gap-1.5">
			{data.map((flagKey: any) => {
				if (!flagData[flagKey]) return null;

				return (
					<Tippy
						key={flagKey}
						content={flagData[flagKey]?.description
							.replace(/{p_2}/g, data?.dataFile ? 'Their' : 'Your')
							.replace(/{p_1}/g, data?.dataFile ? 'They' : 'You')}>
						<div className="opacity-90 hover:opacity-100 relative w-6 h-6 sm:w-8 sm:h-8">
							<Image src={flagData[flagKey]?.icon} alt={flagData[flagKey]?.description} layout="fill" />
						</div>
					</Tippy>
				);
			})}
		</div>
	);
}
