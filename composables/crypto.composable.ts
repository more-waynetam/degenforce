
const decimals: { [key: string]: number } = {
    "ETH.ETH": 100000000,
    "KUJI.KUJI": 100000000,
    "THOR.RUNE": 100000000,
}

const defaultDecimal= 10000000000

export const useCrypto = (pool: string, value: number) => {
    const decimal = decimals[pool] || defaultDecimal
    const valueInCrypto = value / decimal
    return valueInCrypto
}
