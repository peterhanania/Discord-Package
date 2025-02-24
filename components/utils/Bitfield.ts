//full credits to flags.lewistehminerz.dev

import BadgeData from "../json/badges.json";
import AccountFlagData from "../json/account_flags.json";

const badgeData = BadgeData as BadgeDataType;
const flagData = AccountFlagData as BadgeDataType;

type BadgeDataType = {
	[key: string]: Badge;
};

type Badge = {
	description: string;
	icon: string;
	internalName?: string | null;
	shift?: number | null;
}

class BitField {
    /*
     * @param {BigInt} flagNum
     * @returns {string}
     */
    static _checkFlags(flagNumber: bigint) {
        let results = [];
        const shiftMap = new Map<number, string>();
        const flagShiftMap = new Map<number, string>();

        Object.entries(badgeData).forEach(([key, value]: [string, Badge]) => {
            if (value.shift !== undefined && value.shift !== null) {
                shiftMap.set(value.shift, key);
            }
        });
        Object.entries(flagData).forEach(([key, value]: [string, Badge]) => {
            if (value.shift !== undefined && value.shift !== null) {
                shiftMap.set(value.shift, key);
            }
        });

        for (let i = 0; i <= 64; i++) {
            const bitwise = BigInt("1") << BigInt(i);

            if (flagNumber & bitwise) {
                const flag = shiftMap.get(i) || flagShiftMap.get(i) || `UNKNOWN_FLAG_${i}`;
                results.push(flag);
            }
        }

        return results;
    }

    static calculate(n: number) {
        const flagNum = BigInt(n);
        return this._checkFlags(flagNum);
    }

	static getBadgesFromNames(names: string[]) {
        return names.map(name => {
            let badge = Object.entries(badgeData).find(([key, _]) => key === name);
            if (badge === undefined) {
                badge = Object.entries(badgeData).find(([_, value]) => value.internalName === name);
            }
            return badge ? badge[0] : name;
        });
    }
}

export default BitField;
