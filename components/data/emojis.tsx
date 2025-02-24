import Tippy from "@tippyjs/react";
import copyToClipboard from "utils/copyToClipboard";
import emojis from "../json/demo/emojis.json";
import { useState } from "react";
import Image from "next/image";
import Twemoji from "react-twemoji";
import { SnackbarNotificationType, useSnackbarNotification } from "hooks/useSnackbarNotification";
import { toast } from "react-toastify";
import Utils from "components/utils";
import Card from "components/generic/card";

type EmojiProps = {
	data: any;
};

export default function Emojis({ data }: EmojiProps) {
	const snackbar = useSnackbarNotification();

	const [emojiType, setEmojiType] = useState<String | null>(
		data?.messages?.topEmojis && data?.messages?.topEmojis.length
			? "topEmojis"
			: data?.messages?.topCustomEmojis &&
				data?.messages?.topCustomEmojis.length
				? "topCustomEmojis"
				: data?.settings?.recentEmojis && data?.settings?.recentEmojis.length
					? "recentEmojis"
					: null
	);

	return (
		<Card>
			<div>
				{" "}
				<div>
					{emojiType ? (
						<ul className="flex items-center rounded-lg mb-1">
							<li className="flex gap-2">
								{data?.messages?.topEmojis &&
									data?.messages?.topEmojis?.length > 0 ? (
									<div
										className={
											"p-2 rounded-lg" +
											(emojiType !== "topEmojis"
												? ""
												: " bg-gray-400 dark:bg-[#232323]")
										}
										onClick={() => {
											setEmojiType("topEmojis");
										}}
									>
										<Tippy
											zIndex={99999999999999}
											content="Your Top Emojis"
											animation="scale"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												width="24"
												className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
											>
												<path d="M15.7 11.2q.75 0 1.25-.5t.5-1.25q0-.75-.5-1.25t-1.25-.5q-.75 0-1.25.5t-.5 1.25q0 .75.5 1.25t1.25.5Zm-7.4 0q.75 0 1.25-.5t.5-1.25q0-.75-.5-1.25T8.3 7.7q-.75 0-1.25.5t-.5 1.25q0 .75.5 1.25t1.25.5ZM12 18q2.075 0 3.55-1.163 1.475-1.162 2.05-2.787H6.4q.575 1.625 2.05 2.787Q9.925 18 12 18Zm0 4.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Z" />
											</svg>
										</Tippy>
									</div>
								) : (
									""
								)}
								{data?.messages?.topCustomEmojis &&
									data?.messages?.topCustomEmojis?.length > 0 ? (
									<div
										className={
											"p-2 rounded-lg" +
											(emojiType !== "topCustomEmojis"
												? ""
												: " bg-gray-400 dark:bg-[#232323]")
										}
										onClick={() => {
											setEmojiType("topCustomEmojis");
										}}
									>
										<Tippy
											zIndex={99999999999999}
											content="Your Top Custom Emojis"
											animation="scale"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												width="24"
												className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
											>
												<path d="M12 22.8q-2.225 0-4.2-.85t-3.437-2.312Q2.9 18.175 2.05 16.2 1.2 14.225 1.2 12t.85-4.2q.85-1.975 2.313-3.45Q5.825 2.875 7.8 2.025q1.975-.85 4.2-.825 1.175.025 2.163.212Q15.15 1.6 16.1 2l-4.375 1.9 5.2 3.15 1.325 2.875q-2.2.125-4.438-.675-2.237-.8-4.112-3.05-.85 2-2.338 3.462-1.487 1.463-3.512 2.188 0 3.55 2.375 5.925T12 20.15q3.4 0 5.775-2.375Q20.15 15.4 20.15 12v-.175L21.975 7.9q.425.875.625 1.95t.2 2.15q0 2.225-.85 4.2t-2.312 3.438Q18.175 21.1 16.2 21.95q-1.975.85-4.2.85Zm-3.05-8.5q-.55 0-.925-.375T7.65 13q0-.55.375-.925t.925-.375q.55 0 .925.375t.375.925q0 .55-.375.925t-.925.375Zm6.1 0q-.55 0-.925-.375T13.75 13q0-.55.375-.925t.925-.375q.55 0 .925.375t.375.925q0 .55-.375.925t-.925.375Zm4.5-6.325-1.1-2.425L16 4.425 18.45 3.3l1.1-2.425 1.1 2.425 2.45 1.125-2.45 1.125Z" />
											</svg>
										</Tippy>
									</div>
								) : (
									""
								)}
								{data?.settings?.recentEmojis &&
									data?.settings?.recentEmojis?.length > 0 ? (
									<div
										className={
											"p-2 rounded-lg" +
											(emojiType !== "recentEmojis"
												? ""
												: " bg-gray-400 dark:bg-[#232323]")
										}
										onClick={() => {
											setEmojiType("recentEmojis");
										}}
									>
										<Tippy
											zIndex={99999999999999}
											content="Your Recent Emojis"
											animation="scale"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												width="24"
												className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
											>
												<path d="m19 9-1.25-2.75L15 5l2.75-1.25L19 1l1.25 2.75L23 5l-2.75 1.25Zm0 14-1.25-2.75L15 19l2.75-1.25L19 15l1.25 2.75L23 19l-2.75 1.25ZM9 20l-2.5-5.5L1 12l5.5-2.5L9 4l2.5 5.5L17 12l-5.5 2.5Z" />
											</svg>
										</Tippy>
									</div>
								) : (
									""
								)}
							</li>
						</ul>
					) : (
						""
					)}
					<div className="lg:flex items-center justify-center">
						<div className="lg:mr-14 lg:mb-0 mb-2">
							<div
								className="text-gray-900 dark:text-white max-w-sm font-bold xl:text-5xl lg:text-3xl text-xl hidden lg:block uppercase"
								style={{
									fontFamily:
										"Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
								}}
							>
								{data?.dataFile ? "Their" : "Your"}
								<br />
								{emojiType === "topEmojis"
									? "Top"
									: emojiType === "topCustomEmojis"
										? "Top Custom"
										: emojiType === "recentEmojis"
											? "Recent"
											: "Top"}
								<br />
								Emojis
							</div>
							<div className="text-gray-900 dark:text-white max-w-sm font-bold lg:hidden text-2xl ">
								{data?.dataFile ? "Their" : "Your "}
								{emojiType === "topEmojis"
									? " Top  "
									: emojiType === "topCustomEmojis"
										? " Top Custom "
										: emojiType === "recentEmojis"
											? " Recent "
											: null}{" "}
								Emojis
							</div>
						</div>

						{!emojiType ? (
							<span className="text-gray-900 dark:text-white text-lg font-bold w-full">
								No Emojis Found or {data?.dataFile ? "they " : "you "}
								disabled all emoji options
							</span>
						) : (
							""
						)}
						<div className="grid xl:grid-cols-10 xl:gap-1 gap-2 grid-cols-6 justify-items-center ">
							{emojiType === "recentEmojis" ? (
								<>
									{data?.settings?.recentEmojis
										?.slice(0, 30)
										.sort((a: any, b: any) => {
											if (!a?.count || !b?.count) return;
											return b.count - a.count;
										})
										.map((m: any, id: number) => {
											if (!m.name) return;
											if (!m.count) return;
											const isCustomEmoji =
												!isNaN(m.name) && m.name.length > 7;

											if (isCustomEmoji) {
												return (
													(<Tippy
														zIndex={99999999999999}
														key={id}
														content={`used ${m.count} time${m.count === 1 ? "" : "s"
															}`}
														animation="scale"
														className="shadow-xl"
													>
														<div
															className="cursor-pointer text-4xl opacity-90 hover:opacity-100"
															onClick={async () => {
																if (await copyToClipboard(
																	m.name + ": " + m.count + " times"
																)) {
																	snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																} else {
																	snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																}
															}}
														>
															<Image
																unoptimized={true}
																key={id}
																src={
																	"https://cdn.Discordapp.com/emojis/" +
																	m.name +
																	".png"
																}
																alt="emoji"
																height={50}
																width={50}
																draggable={false}
																style={{
																	maxWidth: "100%",
																	height: "auto"
																}} />
														</div>
													</Tippy>)
												);
											} else {
												return (
													<Tippy
														zIndex={99999999999999}
														key={id}
														content={`:${m.name}: used ${m.count} time${m.count === 1 ? "" : "s"
															}`}
														animation="scale"
														className="shadow-xl"
													>
														<div
															onClick={async () => {
																if (await copyToClipboard(
																	":" + m.name + ": - " + m.count + " times"
																)) {
																	snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																} else {
																	snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																}
															}}
															className="cursor-pointer opacity-90 hover:opacity-100 w-14 h-14"
														>
															{/* @ts-ignore */}
															<Twemoji>
																{(emojis as any)[m.name]
																	? (emojis as any)[m.name]
																	: m.name as any}
															</Twemoji>
														</div>
													</Tippy>
												);
											}
										})}
								</>
							) : (
								""
							)}
							{emojiType === "topEmojis" ? (
								<>
									{data?.messages?.topEmojis?.length > 29
										? data?.messages?.topEmojis
											?.slice(0, 29)
											.concat({
												emoji:
													"+ " +
													(data?.messages?.topEmojis?.length - 29) +
													" more",
												count: "ignore",
											})
											.map((m: any, id: number) => {
												if (!m) return;
												if (!m.emoji) return;
												if (!m.count) return;

												return m.count !== "ignore" ? (
													<Tippy
														zIndex={99999999999999}
														key={id}
														content={`${m.emoji} used ${m.count} time${m.count === 1 ? "" : "s"
															}`}
														animation="scale"
														className="shadow-xl"
													>
														<div
															onClick={async () => {
																if (await copyToClipboard(
																	m.emoji + ": " + m.count + " times"
																)) {
																	snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																} else {
																	snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																}
															}}
															className="cursor-pointer opacity-90 hover:opacity-100 w-14 h-14"
														>
															{/* @ts-ignore */}
															<Twemoji options={{ className: 'twemoji' }}>
																<div>
																	{m.emoji}
																</div>
															</Twemoji>
														</div>
													</Tippy>

												) : (
													<Tippy
														zIndex={99999999999999}
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
												);
											})
										: data?.messages?.topEmojis
											?.slice(0, 30)
											.map((m: any, id: number) => {
												if (!m) return;
												if (!m.emoji) return;
												if (!m.count) return;

												return (
													<Tippy
														zIndex={99999999999999}
														key={id}
														content={`${m.emoji} used ${m.count} time${m.count === 1 ? "" : "s"
															}`}
														animation="scale"
														className="shadow-xl"
													>
														<div
															onClick={async () => {
																if (await copyToClipboard(
																	m.emoji + ": " + m.count + " times"
																)) {
																	snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																} else {
																	snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																}
															}}
															className="cursor-pointer lg:text-5xl text-4xl opacity-90 hover:opacity-100"
														>
															{m.emoji}
														</div>
													</Tippy>
												);
											})}
								</>
							) : (
								""
							)}
							{emojiType === "topCustomEmojis" ? (
								<>
									{data?.messages?.topCustomEmojis?.length > 29
										? data?.messages?.topCustomEmojis
											?.slice(0, 29)
											.concat({
												emoji:
													"+ " +
													(data?.messages?.topCustomEmojis?.length - 29) +
													" more",
												count: "ignore",
											})
											.map((m: any, id: number) => {
												if (!m) return;
												if (!m.emoji) return;
												if (!m.count) return;

												return m.count !== "ignore" ? (
													<>
														{/<:.*?:(\d+)>/g.exec(m.emoji) ? (
															<Tippy
																zIndex={99999999999999}
																key={id}
																content={`${m.emoji} used ${m.count
																	} time${m.count === 1 ? "" : "s"}`}
																animation="scale"
																className="shadow-xl"
															>
																<div
																	className="cursor-pointer text-4xl opacity-90 hover:opacity-100"
																	onClick={async () => {
																		if (await copyToClipboard(
																			m.emoji + ": " + m.count + " times"
																		)) {
																			snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																		} else {
																			snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																		}
																	}}
																>
																	<Image
																		unoptimized={true}
																		key={id}
																		src={Utils.createEmoji(m.emoji)}
																		alt="emoji"
																		height={50}
																		width={50}
																		draggable={false}
																		style={{
																			maxWidth: "100%",
																			height: "auto"
																		}} />
																</div>
															</Tippy>
														) : (
															<>
																{/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
																	m.emoji
																) ? (
																	<Tippy
																		zIndex={99999999999999}
																		key={id}
																		content={`${m.emoji} used ${m.count
																			} time${m.count === 1 ? "" : "s"}`}
																		animation="scale"
																		className="shadow-xl"
																	>
																		<div
																			className="cursor-pointer text-4xl opacity-90 hover:opacity-100 m-2"
																			onClick={async () => {
																				if (await copyToClipboard(
																					m.emoji +
																					": " +
																					m.count +
																					" times"
																				)) {
																					snackbar.showSnackbar("Copied emoji to Clipboard", SnackbarNotificationType.SUCCESS);
																				} else {
																					snackbar.showSnackbar("Could not copy emoji to Clipboard", SnackbarNotificationType.ERROR);
																				}
																			}}
																		>
																			<Image
																				unoptimized={true}
																				key={id}
																				src={Utils.createCustomEmoji(
																					m.emoji
																				)}
																				alt="emoji"
																				height={50}
																				width={50}
																				draggable={false}
																				style={{
																					maxWidth: "100%",
																					height: "auto"
																				}} />
																		</div>
																	</Tippy>
																) : (
																	""
																)}
															</>
														)}
													</>
												) : (
													<Tippy
														zIndex={99999999999999}
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
																			{data?.messages?.topCustomEmojis
																				?.length - 29}{" "}
																			more Custom Emoji
																			{data?.messages?.topCustomEmojis
																				?.length -
																				29 ===
																				1
																				? " is"
																				: "s are"}
																			:
																		</span>
																		<br />
																		<ul className="list-disc ml-4">
																			{data?.messages?.topCustomEmojis
																				?.slice(
																					29,
																					data?.messages?.topCustomEmojis
																						?.length
																				)
																				.map((f: any, i: number) => {
																					return (
																						(<li key={i}>
																							{/<:.*?:(\d+)>/g.exec(
																								f.emoji
																							) ? (
																								<Tippy
																									zIndex={99999999999999}
																									key={id}
																									content={`${f.emoji
																										} used ${f.count} time${f.count === 1
																											? ""
																											: "s"
																										}`}
																									animation="scale"
																									className="shadow-xl"
																								>
																									<div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
																										<Image
																											unoptimized={true}
																											key={id}
																											src={Utils.createEmoji(
																												f.emoji
																											)}
																											alt="emoji"
																											height={50}
																											width={50}
																											draggable={false}
																											style={{
																												maxWidth: "100%",
																												height: "auto"
																											}} />
																									</div>
																								</Tippy>
																							) : (
																								<>
																									{/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
																										f.emoji
																									) ? (
																										<Tippy
																											zIndex={
																												99999999999999
																											}
																											key={id}
																											content={`${f.emoji
																												} used ${f.count
																												} time${f.count === 1
																													? ""
																													: "s"
																												}`}
																											animation="scale"
																											className="shadow-xl"
																										>
																											<div className="cursor-pointer text-4xl opacity-90 hover:opacity-100 m-2">
																												<Image
																													unoptimized={
																														true
																													}
																													key={id}
																													src={Utils.createCustomEmoji(
																														f.emoji
																													)}
																													alt="emoji"
																													height={50}
																													width={50}
																													draggable={
																														false
																													}
																													style={{
																														maxWidth: "100%",
																														height: "auto"
																													}} />
																											</div>
																										</Tippy>
																									) : (
																										""
																									)}
																								</>
																							)}: {f.count}time
																							{f.count > 1 ? "s" : ""}
																						</li>)
																					);
																				})}
																		</ul>
																	</div>
																);
															}}
															className="cursor-pointer flex justify-center items-center text-md p-1 py-2 px-2 font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800"
														>
															+
															{data?.messages?.topCustomEmojis?.length -
																29}
														</div>
													</Tippy>
												);
											})
										: data?.messages?.topCustomEmojis
											?.slice(0, 30)
											.map((m: any, id: number) => {
												if (!m) return;
												if (!m.emoji) return;
												if (!m.count) return;

												return (<>
													{/<:.*?:(\d+)>/g.exec(m.emoji) ? (
														<Tippy
															zIndex={99999999999999}
															key={id}
															content={`${m.emoji} used ${m.count
																} time${m.count === 1 ? "" : "s"}`}
															animation="scale"
															className="shadow-xl"
														>
															<div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
																<Image
																	unoptimized={true}
																	key={id}
																	src={Utils.createEmoji(m.emoji)}
																	alt="emoji"
																	height={50}
																	width={50}
																	draggable={false}
																	style={{
																		maxWidth: "100%",
																		height: "auto"
																	}} />
															</div>
														</Tippy>
													) : (
														<>
															{/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
																m.emoji
															) ? (
																<Tippy
																	zIndex={99999999999999}
																	key={id}
																	content={`${m.emoji} used ${m.count
																		} time${m.count === 1 ? "" : "s"}`}
																	animation="scale"
																	className="shadow-xl"
																>
																	<div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
																		<Image
																			unoptimized={true}
																			key={id}
																			src={Utils.createCustomEmoji(
																				m.emoji
																			)}
																			alt="emoji"
																			height={50}
																			width={50}
																			draggable={false}
																			style={{
																				maxWidth: "100%",
																				height: "auto"
																			}} />
																	</div>
																</Tippy>
															) : (
																""
															)}
														</>
													)}
												</>);
											})}
								</>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}