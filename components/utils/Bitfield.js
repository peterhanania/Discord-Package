//full credits to flags.lewistehminerz.dev

const flags = require("../json/badges/index.json");

class BitField {
  static _checkFlags(flagNumber) {
    let results = [];

    for (let i = 0; i <= 64; i++) {
      const bitwise = 1n << BigInt(i);

      if (flagNumber & bitwise) {
        const flag =
          Object.entries(flags).find((f) => f[1].shift === i)?.[0] ||
          `UNKNOWN_FLAG_${i}`;
        results.push(flag);
      }
    }

    return results
  }

  static calculate(n) {
    const flagNum = BigInt(n);
    return this._checkFlags(flagNum);
  }
}

module.exports = BitField;
