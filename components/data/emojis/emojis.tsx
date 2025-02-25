import Tippy from "@tippyjs/react";
import copyToClipboard from "utils/copyToClipboard";
import { useEffect, useState } from "react";
import { SnackbarNotificationType, useSnackbarNotification } from "hooks/useSnackbarNotification";
import { toast } from "react-toastify";
import Card from "components/generic/card";
import Smile from "assets/icons/Smile";
import HeadSparkle from "assets/icons/HeadSparkle";
import Sparkle from "assets/icons/HeadSparkle copy";
import Emoji from "./emoji";

type EmojiProps = {
	data: any;
};

export default function Emojis({ data }: EmojiProps) {
	const snackbar = useSnackbarNotification();

	enum FilterOptions {
		TOP = "top",
		TOP_CUSTOM = "topCustom",
		RECENT = "recent",
	}

	const [filter, setFilter] = useState<FilterOptions>(FilterOptions.TOP);
	const [emojis, setEmojis] = useState<any>(data?.messages?.topEmojis);

	const [hasTopEmojis, setHasTopEmojis] = useState<boolean>(false);
	const [hasTopCustomEmojis, setHasTopCustomEmojis] = useState<boolean>(false);
	const [hasRecentEmojis, setHasRecentEmojis] = useState<boolean>(false);

	const [isOwner] = useState<boolean>(data?.dataFile ? false : true);

	const recentEmojis = data?.settings?.recentEmojis
		?.slice(0, 30)
		.sort((a: any, b: any) => {
			if (!a?.count || !b?.count) return;
			return b.count - a.count;
		});

	const topCustomEmojis = data?.messages?.topCustomEmojis?.slice(0, 30).sort((a: any, b: any) => {
		if (!a?.count || !b?.count) return;
		return b.count - a.count;
	});

	const topEmojis = data?.messages?.topEmojis
		?.slice(0, 29)
		.concat({
			emoji:
				"+ " +
				(data?.messages?.topEmojis?.length - 29) +
				" more",
			count: "ignore",
		});

	useEffect(() => {
		setHasTopEmojis(data?.messages?.topEmojis?.length > 0);
		setHasTopCustomEmojis(data?.messages?.topCustomEmojis?.length > 0);
		setHasRecentEmojis(data?.settings?.recentEmojis?.length > 0);
	}, [data]);

	const changeFilter = (filter: FilterOptions) => {
		switch (filter) {
			case FilterOptions.TOP:
				setEmojis(topEmojis);
				break;
			case FilterOptions.TOP_CUSTOM:
				setEmojis(topCustomEmojis);
				break;
			case FilterOptions.RECENT:
				setEmojis(recentEmojis);
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		changeFilter(filter);
		// eslint-disable-next-line
	}, [filter])


	const selectedFilterClass = 'bg-gray-400 dark:bg-[#232323] rounded-lg flex items-center p-2';
	const titleString = `${!isOwner ? "Their" : "Your"} ${filter === FilterOptions.TOP ? "Top" : filter === FilterOptions.TOP_CUSTOM ? "Top Custom" : filter === FilterOptions.RECENT ? "Recent" : "Top"} Emojis`;

	return (
		<Card>
			{/* Filters */}
			<div className="flex items-center gap-1">
				<Tippy
					content="Your Top Emojis"
					animation="scale"
				>
					<button onClick={() => setFilter(FilterOptions.TOP)} className={filter === FilterOptions.TOP ? selectedFilterClass : 'rounded-lg flex items-center p-2'}>
						<Smile />
					</button>
				</Tippy>
				<Tippy
					content="Your Top Custom Emojis"
					animation="scale"
				>
					<button onClick={() => setFilter(FilterOptions.TOP_CUSTOM)} className={filter === FilterOptions.TOP_CUSTOM ? selectedFilterClass : 'rounded-lg flex items-center p-2'}>
						<HeadSparkle />
					</button>
				</Tippy>
				<Tippy
					content="Your Recent Emojis"
					animation="scale"
				>
					<button onClick={() => setFilter(FilterOptions.RECENT)} className={filter === FilterOptions.RECENT ? selectedFilterClass : 'rounded-lg flex items-center p-2'}>
						<Sparkle />
					</button>
				</Tippy>
			</div>
			{/* Content */}
			<div className="flex flex-col lg:flex-row">
				{/* Title */}
				<h2
					className="lg:w-1/3 py-2 lg:my-auto ml-2 text-gray-900 dark:text-white max-w-sm font-bold xl:text-5xl lg:text-3xl text-xl uppercase"
					style={{
						fontFamily:
							"Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
					}}
				>
					{titleString}
				</h2>
				<div>
					{(!hasRecentEmojis && !hasTopCustomEmojis && !hasTopEmojis) || !emojis ? (
						<span className="text-gray-900 dark:text-white text-lg font-bold w-full">
							No Emojis Found or {isOwner ? "they " : "you "} disabled emoji and/or message options
						</span>
					) : (
						<div className="grid xl:grid-cols-10 xl:gap-1 gap-2 grid-cols-6 justify-items-center">
							{emojis
								.map((m: any, id: number) => {
									if (!m.count) return;

									if (m.count !== "ignore") return (
										<Tippy
											key={id}
											content={`:${(m.name ?? m.emoji)}: used ${m.count} time${m.count === 1 ? "" : "s"
												}`}
											animation="scale"
											className="shadow-xl"
										>
											<div
												onClick={async () => {
													if (await copyToClipboard(
														":" + (m.name ?? m.emoji) + ": - " + m.count + " times"
													)) {
														snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
													} else {
														snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
													}
												}}
												className="cursor-pointer opacity-90 hover:opacity-100 w-14 h-14"
											>
												<Emoji emoji={m} />
											</div>
										</Tippy>
									);

									if (m.count === "ignore") return (
										<Tippy
											key={id}
											content={`Click to view the rest`}
											animation="scale"
											className="shadow-xl"
										>
											<div
												onClick={() => {
													toast(
														<div className="Toastify__toast-body_">
															<span className="font-bold text-lg text-black dark:text-white">
																{data?.dataFile ? "Their" : "Your"}{" "}
																{data?.messages?.topEmojis?.length -
																	29}{" "}
																more Emoji
																{data?.messages?.topEmojis?.length -
																	29 ===
																	1
																	? " is"
																	: "s are"}
																:
															</span>
															<br />
															<ul className="list-disc ml-4">
																{data?.messages?.topEmojis
																	?.slice(
																		29,
																		data?.messages?.topEmojis
																			?.length
																	)
																	.map((f: any, i: number) => {
																		return (
																			<li key={i}>
																				{f.emoji}: {f.count} time
																				{f.count > 1 ? "s" : ""}
																			</li>
																		);
																	})}
															</ul>
														</div>
													);
												}}
												className="cursor-pointer flex justify-center items-center text-md p-1 mt-2 py-1 px-2 font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800"
											>
												+{data?.messages?.topEmojis?.length - 29}
											</div>
										</Tippy>
									)
								})}
						</div>
					)}
				</div>
			</div>
		</Card>
	)
}