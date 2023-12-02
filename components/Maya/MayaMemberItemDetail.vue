<template>
  <v-col col="12" md="4">
    <h1>{{ member.pool }}</h1>
    <v-card :subtitle="`Added`" class="my-5">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4">${{ $localNumber(member.memberPoolDetail.totalPoolValue) }}</h2>
            <p class="text-disabled text-caption">Total value</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.memberPoolDetail.assetDepth) }}</h3>
            <p class="text-disabled text-caption">{{member.pool}}@{{ $localNumber(member.memberPoolDetail.assetPriceUSD) }}</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.memberPoolDetail.cacaoDepth) }}</h3>
            <p class="text-disabled text-caption">MAYA.CACAO@{{ $localNumber(member.memberPoolDetail.cacaoPriceUSD)}}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card :subtitle="`Current`" class="my-5">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4">${{ $localNumber(member.newMemberPoolDetail.totalPoolValue) }}</h2>
            <p class="text-disabled text-caption">Total value</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.newMemberPoolDetail.assetDepth) }}</h3>
            <p class="text-disabled text-caption">{{member.pool}}@{{ $localNumber(member.newMemberPoolDetail.assetPriceUSD) }}</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.newMemberPoolDetail.cacaoDepth) }}</h3>
            <p class="text-disabled text-caption">MAYA.CACAO@{{ $localNumber(member.newMemberPoolDetail.cacaoPriceUSD)}}</p>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <h2 class="text-h4">${{ $localNumber(holdValue(member.memberPoolDetail,member.newMemberPoolDetail))}}</h2>
            <p class="text-disabled text-caption">Hold value</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.memberPoolDetail.assetDepth) }}</h3>
            <p class="text-disabled text-caption">{{member.pool}}@{{ $localNumber(member.newMemberPoolDetail.assetPriceUSD) }}</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.memberPoolDetail.cacaoDepth) }}</h3>
            <p class="text-disabled text-caption">MAYA.CACAO@{{ $localNumber(member.newMemberPoolDetail.cacaoPriceUSD)}}</p>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <h2 class="text-h4">${{ $localNumber((member.impermanentLossProtection.ILPValue))}}</h2>
            <p class="text-disabled text-caption">Impermanant Loss Protestion</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{ $localNumber(member.impermanentLossProtection.ILPDaysLeft) }}</h3>
            <p class="text-disabled text-caption">DAYs to full cover</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{$percent( member.impermanentLossProtection.coverage) }}</h3>
            <p class="text-disabled text-caption">Coverage</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">${{$localNumber( member.impermanentLossProtection.coverValue) }}</h3>
            <p class="text-disabled text-caption">Cover value</p>
          </v-col>
          <v-col cols="6">
            <h3 class="text-h5">{{$localNumber( member.impermanentLossProtection.coverCacao) }}</h3>
            <p class="text-disabled text-caption">Cover Cacao</p>
          </v-col>
          <v-col cols="12">
            <h2 class="text-h3 text-primary">${{ $localNumber((member.impermanentLossProtection.withdrawValue))}}</h2>
            <p class="text-disabled text-caption">Withdrawable value</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>
<script setup lang="ts">
import moment from "moment";
const mayaStore = useMayaStore();

const holdValue=(pool:MayaPool,newPool:MayaPool)=>{
  return pool.assetDepth*newPool.assetPriceUSD + pool.cacaoDepth*newPool.cacaoPriceUSD
}
const props = defineProps({
  member: {
    type: Object as PropType<MayaMember>,
    required: true,
  },
});
</script>
