<template>
  <MayaMemberItem v-if="!pending" v-for="(member, index) in pools" :member="member" :key="index" col="12" md="4"></MayaMemberItem>
  <v-sheet v-if="pending" class="bg-transparent mx-auto my-10" >
    <h2 class="my-5">loading</h2>
    <v-progress-circular size="x-large" indeterminate color="primary"></v-progress-circular>
  </v-sheet>
</template>
<script setup lang="ts">
import moment from "moment";
const mayaStore = useMayaStore();

const unixDate = (date: number, format: string = "YYYY-MM-DD HH:mm:ss") => {
  return moment.unix(Number(date)).format(format);
};

const holdValue=(pool:MayaPool,newPool:MayaPool)=>{
  return pool.assetDepth*newPool.assetPriceUSD + pool.cacaoDepth*newPool.cacaoPriceUSD
}

const { data: pools,pending,refresh } = useAsyncData(
  "member",
  async () => {
    let pattern = /^maya1[a-z0-9]{38}$/;
    let isValid = pattern.test(mayaStore.mayaAddress);
    if (isValid) {
      const result = await mayaStore.getMember();
      return result;
    }
  },
  { watch: [mayaStore] }
);
</script>
