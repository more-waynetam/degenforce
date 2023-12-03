<template>
  <v-col v-if="!pending && !error" cols="12">
    <v-sheet class="mb-5 mx-auto text-center" max-width="400" color="transparent">
      <p>Total value</p>
      <h1 class="text-h3 text-md-2 text-primary font-weight-black">
        ${{ $localNumber(totalPoolValue) }}
      </h1>
      <p :class="$numberColor(totalProfit)" >Profit {{ $percent(totalProfitPercent) }}</p>
    </v-sheet>
  </v-col>
  <v-col v-if="error">
    <p>{{ error }}</p>
  </v-col>
  <MayaMemberItem
    v-if="!pending"
    v-for="(member, index) in pools"
    :member="member"
    :key="index"
    cols="12"
    md="4"
  ></MayaMemberItem>
  <v-sheet v-if="pending" class="bg-transparent mx-auto my-10">
    <h2 class="my-5">loading</h2>
    <v-progress-circular
      size="x-large"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-sheet>
</template>
<script setup lang="ts">
import moment from "moment";
const mayaStore = useMayaStore();

const unixDate = (date: number, format: string = "YYYY-MM-DD HH:mm:ss") => {
  return moment.unix(Number(date)).format(format);
};

const holdValue = (pool: MayaPool, newPool: MayaPool) => {
  return (
    pool.assetDepth * newPool.assetPriceUSD +
    pool.cacaoDepth * newPool.cacaoPriceUSD
  );
};

const totalPoolValue = ref(0);
const totalHoldValue = ref(0);
const totalAddedValue = ref(0);
const totalProfit = ref(0);
const totalProfitPercent = ref(0);

const {
  data: pools,
  pending,
  refresh,
  error
} = useAsyncData(
  "member",
  async () => {
    let pattern = /^maya1[a-z0-9]{38}$/;
    const address = mayaStore.mayaAddress.toLowerCase().trim();
    let isValid = pattern.test(address);
    if (isValid) {
      const result = await mayaStore.getMember();
      totalPoolValue.value = result
        .map((member) => member.newMemberPoolDetail.totalPoolValue)
        .reduce((a, b) => a + b, 0);
      totalHoldValue.value = result
        .map((member) => member.impermanentLossProtection.holdValue)
        .reduce((a, b) => a + b, 0);
      totalAddedValue.value = result
        .map((member) => member.memberPoolDetail.totalPoolValue)
        .reduce((a, b) => a + b, 0);
      totalProfit.value = totalPoolValue.value - totalAddedValue.value;
      totalProfitPercent.value = totalProfit.value / totalAddedValue.value;
      return result;
    }
  },
  { watch: [mayaStore] }
);
</script>
