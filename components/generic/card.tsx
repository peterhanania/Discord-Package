import Eye from "assets/icons/Eye";
import EyeSlash from "assets/icons/EyeSlash";
import { useState, ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
	const [hidden, setHidden] = useState(false);
	const blurClass = hidden ? "blur-xl pointer-events-none select-none" : "";

	return (
		<div className="px-4 py-2 mb-2 lg:mb-0 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg row-span-3 relative group overflow-hidden">
			<div
				className="absolute z-10 absolute right-2 top-2 lg:hidden md:hidden group-hover:block"
				onClick={() => {
					setHidden(!hidden);
				}}
			>
				{hidden ? <EyeSlash /> : <Eye />}
			</div>
			<div className={blurClass}>
				{children}
			</div>
		</div>
	)
}