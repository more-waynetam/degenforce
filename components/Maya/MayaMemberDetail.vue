<template>
  <v-dialog activator="parent" v-model="dialog">
    <v-card rounded="0" max-width="600" width="100%" class="mx-auto">
      <v-list density="compact">
        <v-list-subheader class="mt-5">Pool added</v-list-subheader>
        <v-list-item class="py-0" v-for="(item, index) in oldMember" :key="index">
            <h4>{{ item.title }}</h4>
            <p v-if="item.subtitle" class="text-disabled text-caption">
              {{ item.subtitle }}
            </p>
            <template v-slot:append><span class="text-primary">{{ item.value }}</span></template>
        </v-list-item>
        <v-list-subheader class="mt-5">Current stats</v-list-subheader>
        <v-list-item class="py-0" v-for="(item, index) in newMember" :key="index">
            <h4>{{ item.title }}</h4>
            <p v-if="item.subtitle" class="text-disabled text-caption">
              {{ item.subtitle }}
            </p>
            <template v-slot:append><span class="text-primary">{{ item.value }}</span></template>
        </v-list-item>
        <v-list-subheader class="mt-5">Impermanent Loss Protection</v-list-subheader>
        <v-list-item class="py-0" v-for="(item, index) in ilp" :key="index">
            <h4>{{ item.title }}</h4>
            <p v-if="item.subtitle" class="text-disabled text-caption">
              {{ item.subtitle }}
            </p>
            <template v-slot:append><span class="text-primary">{{ item.value }}</span></template>
        </v-list-item>
      </v-list>
      <v-card-actions class="pa-0 ma-0"><v-btn @click="dialog=false" variant="tonal" color="primary" block class="rounded-0">CLOSE</v-btn></v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import type { PropType } from "vue";
import moment from "moment";

const dialog=ref(false)

const props = defineProps({
  member: {
    type: Object as PropType<MayaMember>,
    required: true,
  },
});

const { $localNumber, $percent } = useNuxtApp();
const oldMember = ref<
  Array<{ title: string; subtitle?: string; value: string }>
>([]);
const newMember = ref<
  Array<{ title: string; subtitle?: string; value: string }>
>([]);
const ilp = ref<Array<{ title: string; subtitle?: string; value: string }>>([]);

const {
  poolDetail,
  newPoolDetail,
  memberPoolDetail,
  newMemberPoolDetail,
  pool,
  profit,
  dateLastAdded,
  impermanentLossProtection,
} = props.member;
oldMember.value.push({
  title: "Asset",
  value: pool,
});
oldMember.value.push({
  title: "Asset Added",
  subtitle: "@" + moment.unix(dateLastAdded).format("YYYY/MM/DD"),
  value: $localNumber(memberPoolDetail.assetDepth).toString(),
});
oldMember.value.push({
  title: "Asset Value",
  subtitle: "@" + $localNumber(memberPoolDetail.assetPriceUSD).toString(),
  value: "$" + $localNumber(memberPoolDetail.assetValue).toString(),
});
oldMember.value.push({
  title: "Cacao Added",
  subtitle: "@" + moment.unix(dateLastAdded).format("YYYY/MM/DD"),
  value: $localNumber(memberPoolDetail.cacaoDepth).toString(),
});
oldMember.value.push({
  title: "Cacao Value",
  subtitle: "@" + $localNumber(memberPoolDetail.cacaoPriceUSD).toString(),
  value: "$" + $localNumber(memberPoolDetail.cacaoValue).toString(),
});
oldMember.value.push({
  title: "Pool Value",
  subtitle:
    "Pool unit " +
    $localNumber(newMemberPoolDetail.liquidityUnits / 1e10).toString(),
  value: "$" + $localNumber(memberPoolDetail.totalPoolValue).toString(),
});

newMember.value.push({
  title: "Asset Added",
  subtitle: "@" + moment.unix(dateLastAdded).format("YYYY/MM/DD"),
  value: $localNumber(newMemberPoolDetail.assetDepth).toString(),
});
newMember.value.push({
  title: "Asset Value",
  subtitle:"@" +  $localNumber(newMemberPoolDetail.assetPriceUSD).toString(),
  value: "$" + $localNumber(newMemberPoolDetail.assetValue).toString(),
});
newMember.value.push({
  title: "Cacao Added",
  subtitle: moment.unix(dateLastAdded).format("YYYY/MM/DD"),
  value: $localNumber(newMemberPoolDetail.cacaoDepth).toString(),
});
newMember.value.push({
  title: "Cacao Value",
  subtitle: "@" + $localNumber(newMemberPoolDetail.cacaoPriceUSD).toString(),
  value: "$" + $localNumber(newMemberPoolDetail.cacaoValue).toString(),
});
newMember.value.push({
  title: "Pool Value",
  subtitle:
    "Pool unit " +
    $localNumber(newMemberPoolDetail.liquidityUnits / 1e10).toString(),
  value: "$" + $localNumber(newMemberPoolDetail.totalPoolValue).toString(),
});

ilp.value.push({
  title: "Outperformance",
  value: impermanentLossProtection.outPerformanceAsset.toString(),
});

ilp.value.push({
  title: "Impermanent Loss",
  subtitle: $percent(impermanentLossProtection.impermanentLossPercent),
  value:
    "$" + $localNumber(impermanentLossProtection.impermanentLoss).toString(),
});

ilp.value.push({
  title: "ILP Days Left",
  subtitle: moment
    .unix(impermanentLossProtection.ILPCoverDate)
    .format("YYYY/MM/DD"),
  value: impermanentLossProtection.ILPDaysLeft.toString(),
});

ilp.value.push({
  title: "ILP Coverage",
  subtitle: $percent(impermanentLossProtection.coverage),
  value: "$" + $localNumber(impermanentLossProtection.coverValue).toString(),
});

ilp.value.push({
  title: "ILP Withdrawable",
  subtitle:
    "@" +
    moment.unix(impermanentLossProtection.ILPCoverDate).format("YYYY/MM/DD"),
  value: "$" + $localNumber(impermanentLossProtection.withdrawValue).toString(),
});

ilp.value.push({
  title: "ILP full cover value",
  subtitle:
    "@" +
    moment.unix(impermanentLossProtection.ILPCoverDate).format("YYYY/MM/DD"),
  value: "$" + $localNumber(impermanentLossProtection.holdValue).toString(),
});



</script>
