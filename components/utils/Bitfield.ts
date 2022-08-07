//full credits to flags.lewistehminerz.dev

import flags from "../json/badges/index.json";

class BitField {
	/*
	 * @param {BigInt} flagNum
	 * @returns {string}
	 */
	static _checkFlags(flagNumber: bigint) {
		let results = [];

		for (let i = 0; i <= 64; i++) {
			const bitwise = BigInt("1") << BigInt(i);

			if (flagNumber & bitwise) {
				const flag =
					Object.entries(flags).find((f: any) => {
						return f[1].shift === i;
					})?.[0] || `UNKNOWN_FLAG_${i}`;
				results.push(flag);
			}
		}

		return results;
	}

	static calculate(n: number) {
		const flagNum = BigInt(n);
		return this._checkFlags(flagNum);
	}
}

export default BitField;
