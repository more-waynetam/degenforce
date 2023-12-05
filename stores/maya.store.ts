import moment from "moment";
import { defineStore } from "pinia";
import { useCrypto } from "~/composables/crypto.composable";

const mayaBaseUrl = "https://midgard.mayachain.info/v2";

export interface MayaMember {
  pool: string;
  poolDetail: MayaPool;
  newPoolDetail: MayaPool;
  memberPoolDetail: MayaPool;
  newMemberPoolDetail: MayaPool;
  impermanentLossProtection: ILP;
  dateFirstAdded: number;
  dateLastAdded: number;
  profit: number;
}

export interface ILP {
  impermanentLoss: number;
  impermanentLossPercent: number;
  outPerformanceAsset: string;
  ILPCoverDate: number;
  ILPDays: number;
  ILPCacao: number;
  ILPValue: number;
  ILPDaysLeft: number;
  lastAdded: number;
  coverage: number;
  coverValue: number;
  coverCacao: number;
  withdrawValue: number;
  holdValue: number;
  assetChangePercent: number;
  cacaoChangePercent: number;
}

export interface MayaPool {
  totalPoolValue: number;
  assetValue: number;
  assetDepth: number;
  cacaoValue: number;
  cacaoPriceUSD: number;
  cacaoDepth: number;
  assetPriceUSD: number;
  assetCacaoRatio: number;
  liquidityUnits: number;
}

export interface PoolInfo {
  assetDepth: string; // String representation of a large number
  assetPrice: string; // Price of asset in terms of rune
  assetPriceUSD: string; // Price of asset in USD
  runeDepth: string; // Depth of rune in the pool
  liquidityUnits: string; // Total liquidity units in the pool
  // Other fields can be added if needed
}

export const useMayaStore = defineStore("mayaStore", {
  state: () => ({
    mayaAddress: "",
    mayaAddressList: [],
  }),
  actions: {
    extractSymbol(input: string): string {
      // Split the string by '.' and take the second part (after 'PREFIX.')
      const parts = input.split(".");
      if (parts.length < 2) {
        // If the input doesn't contain a '.', return the original input
        return input;
      }

      // Further split the second part by '-' and take the first part (before '-EXTRA')
      const symbolParts = parts[1].split("-");

      return symbolParts[0];
    },
    calculatePoolValues(poolInfo: PoolInfo): MayaPool {
      const assetDepth = parseInt(poolInfo.assetDepth) / 100000000; // Adjusting for decimal places
      const cacaoDepth = parseInt(poolInfo.runeDepth) / 10000000000; // Adjusting for decimal places
      const assetPriceUSD = parseFloat(poolInfo.assetPriceUSD);
      const assetPrice = parseFloat(poolInfo.assetPrice);
      const liquidityUnits = parseInt(poolInfo.liquidityUnits);

      const assetValue = assetDepth * assetPriceUSD;

      // Calculating the price of cacao in USD
      const cacaoPriceUSD = assetPriceUSD / assetPrice;
      const cacaoValue = cacaoDepth * cacaoPriceUSD;

      // Assuming the cacao value must be the same as the asset value
      const totalPoolValue = assetValue + cacaoValue;

      const assetCacaoRatio = assetDepth / cacaoDepth;

      return {
        totalPoolValue,
        assetDepth,
        assetValue,
        cacaoValue,
        cacaoDepth,
        cacaoPriceUSD,
        assetPriceUSD,
        assetCacaoRatio,
        liquidityUnits,
      };
    },
    calculatePoolValuesFromUnits(pool: MayaPool, units: number): MayaPool {
      const share = units / pool.liquidityUnits;
      const assetDepth = pool.assetDepth * share;
      const cacaoDepth = pool.cacaoDepth * share;
      const assetPriceUSD = pool.assetPriceUSD;
      const cacaoPriceUSD = pool.cacaoPriceUSD;
      const assetValue = assetDepth * assetPriceUSD;
      const cacaoValue = cacaoDepth * cacaoPriceUSD;
      const totalPoolValue = assetValue + cacaoValue;
      const assetCacaoRatio = assetDepth / cacaoDepth;
      return {
        totalPoolValue,
        assetDepth,
        assetValue,
        cacaoValue,
        cacaoDepth,
        cacaoPriceUSD,
        assetPriceUSD,
        assetCacaoRatio,
        liquidityUnits: units,
      };
    },
    calculateImpermanentLoss(
      pool: MayaPool,
      newPool: MayaPool,
      dateLastAdded: number
    ): ILP {
      const holdValue =
        pool.assetDepth * newPool.assetPriceUSD +
        pool.cacaoDepth * newPool.cacaoPriceUSD;
      const impermanentLoss = holdValue - newPool.totalPoolValue;
      const impermanentLossPercent = impermanentLoss / newPool.totalPoolValue;
      const assetChangePercent =
        (newPool.assetPriceUSD - pool.assetPriceUSD) / pool.assetPriceUSD;
      const cacaoChangePercent =
        (newPool.cacaoPriceUSD - pool.cacaoPriceUSD) / pool.cacaoPriceUSD;
      const outPerformanceAsset =
        assetChangePercent > cacaoChangePercent ? "asset" : "cacao";
      const ILPDays = outPerformanceAsset == "asset" ? 100 : 400;
      const ILPValue = impermanentLoss > 0 ? Math.abs(impermanentLoss) : 0;
      const ILPCacao = ILPValue / newPool.cacaoPriceUSD;
      const lastAdded = dateLastAdded;
      const ILPCoverDate = moment
        .unix(dateLastAdded)
        .add(ILPDays + 50, "days")
        .unix();
      const ILPDaysLeft = Math.max(
        moment
          .unix(dateLastAdded)
          .add(ILPDays + 50, "days")
          .diff(moment(), "days"),
        0
      );
      const coverage = Math.max(1 - ILPDaysLeft / ILPDays, 0);
      const coverValue = coverage * ILPValue;
      const coverCacao = coverValue / newPool.cacaoPriceUSD;
      const withdrawValue = coverValue + newPool.totalPoolValue;

      return {
        holdValue,
        impermanentLoss,
        impermanentLossPercent,
        outPerformanceAsset,
        ILPCoverDate,
        ILPDays,
        ILPCacao,
        ILPValue,
        ILPDaysLeft,
        lastAdded,
        coverage,
        coverValue,
        coverCacao,
        withdrawValue,
        assetChangePercent,
        cacaoChangePercent,
      };
    },
    async getHistory(pool: string, from?: number, to?: number) {
      const query = [];
      if (from && from != 0) query.push(`from=${from}`);
      if (to && from != 0) query.push(`to=${to}`);
      const queryString = query.join("&");
      const url = `${mayaBaseUrl}/history/depths/${pool}?${queryString}`;
      const response = await fetch(url);
      if (response.status == 400) return { intervals: [] };
      return await response.json();
    },
    async getBalance() {
      const url = `${mayaBaseUrl}/balance/${this.getAddress()}`;
      const response = await fetch(url);
      return await response.json();
    },
    getAddress() {
      const address = this.mayaAddress.toLowerCase().trim();
      return address;
    },
    async getMember() {
      const url = `${mayaBaseUrl}/member/${this.getAddress()}`;
      const response = await fetch(url);
      if (response.status == 404) {
        console.log("Member not found");
        return [];
      }
      const member = await response.json();
      const pools: MayaMember[] = [];
      for (const p of member.pools) {
        if(p.pool!='ETH.WSTETH-0X7FEC9ED4FD76621BA8BFF928DC4AE2C3C8AFAC82'){
          const {
            pool,
            assetAdded,
            runeAdded: cacaoAdded,
            dateFirstAdded,
            dateLastAdded,
            liquidityUnits,
          } = p;
          const assetHistory = await this.getHistory(
            pool,
            dateFirstAdded,
            dateLastAdded
          );
          const poolDetail = this.calculatePoolValues(
            assetHistory.intervals[0]
          );
          const memberPoolDetail = this.calculatePoolValues({
            assetDepth: assetAdded,
            assetPrice: assetHistory.intervals[0].assetPrice,
            assetPriceUSD: assetHistory.intervals[0].assetPriceUSD,
            runeDepth: cacaoAdded,
            liquidityUnits: liquidityUnits.toString(),
          });

          const newAssetHistory = await this.getHistory(pool);
          const newPoolDetail = this.calculatePoolValues(
            newAssetHistory.intervals[0]
          );
          const newMemberPoolDetail = this.calculatePoolValuesFromUnits(
            newPoolDetail,
            liquidityUnits
          );

          const impermanentLossProtection = this.calculateImpermanentLoss(
            memberPoolDetail,
            newMemberPoolDetail,
            dateLastAdded
          );

          const profit =
            newMemberPoolDetail.totalPoolValue -
            memberPoolDetail.totalPoolValue;

          pools.push({
            profit,
            pool: this.extractSymbol(pool),
            poolDetail,
            newPoolDetail,
            dateFirstAdded,
            dateLastAdded,
            memberPoolDetail,
            newMemberPoolDetail,
            impermanentLossProtection,
          });
        }
      }
      return pools;
    },
    async getPools() {
      const url = `${mayaBaseUrl}/pools`;
      const response = await fetch(url);
      return await response.json();
    },
  },
  persist: true,
});
