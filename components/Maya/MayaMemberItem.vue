<template>
  <v-col col="12" md="4">
    <v-card class="rounded-0" variant="outlined" elevation="0">
      <v-card-text>
        <v-row>
          <v-col>
            <h2 class="text-h4 text-md-h5 font-weight-bold mb-2">
              ${{ $localNumber(member.newMemberPoolDetail.totalPoolValue) }}
            </h2>
            <p class="text-disabled text-caption">
              Profit
              <span
                :class="$numberColor(member.profit)"
                class="text-body font-weight-bold"
                >${{ $localNumber(member.profit) }} ({{
                  $percent(
                    member.profit / member.memberPoolDetail.totalPoolValue
                  )
                }})</span
              >
            </p>
            <p class="text-disabled text-caption">
              Pool vs Hold
              <span class="text-error font-weight-bold"
                >-${{
                  $localNumber(member.impermanentLossProtection.impermanentLoss)
                }}
                ({{
                  $percent(
                    member.impermanentLossProtection.impermanentLossPercent
                  )
                }})</span
              >
            </p>
          </v-col>
          <v-col cols="4"
            ><h2 class="text-h5 text-right font-weight-thin text-primary">
              {{ member.pool }}
            </h2></v-col
          >
        </v-row>
        <v-row>
          <v-col cols="6" class="text-center">
            <v-card color="primary">
              <v-card-text>
                <h3 class="text-h5">
                  {{ $localNumber(member.newMemberPoolDetail.assetDepth) }}
                </h3>
                <p class="text-disabled text-caption">
                  {{ member.pool }}@{{
                    $localNumber(member.newMemberPoolDetail.assetPriceUSD*1)
                  }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" class="text-center">
            <v-card color="secondary">
              <v-card-text>
                <h3 class="text-h5 text-white">
                  {{ $localNumber(member.newMemberPoolDetail.cacaoDepth) }}
                </h3>
                <p class="text-disabled text-caption">
                  CACAO@{{
                    $localNumber(member.newMemberPoolDetail.cacaoPriceUSD)
                  }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <p class="text-disabled text-caption">ILP Withdrawable</p>
            <h3 class="text-h5">
              ${{
                $localNumber(member.impermanentLossProtection.withdrawValue)
              }}
            </h3>
            <p class="text-caption text-disabled">
              <span class="text-primary font-weight-bold">
               {{
                $localNumber(
                  
                    member.newMemberPoolDetail.assetDepth
                )
              }}
              <span class="font-weight-light">{{member.pool}}</span>
            </span>
              +
              <span class="text-secondary font-weight-bold">
              {{
                $localNumber(
                  member.impermanentLossProtection.coverCacao +
                    member.newMemberPoolDetail.cacaoDepth
                )
              }} <span class="font-weight-light">CACAO</span>
              </span>
            </p>
          </v-col>
          <v-col class="text-right" cols="4">
            <p class="text-disabled text-caption">Outperformance</p>
            <v-chip
              size="x-small"
              :color="
                member.impermanentLossProtection.outPerformanceAsset === 'cacao'
                  ? 'success'
                  : 'warning'
              "
              >{{
                member.impermanentLossProtection.outPerformanceAsset === "cacao"
                  ? "CACAO"
                  : member.pool
              }}</v-chip
            >
          </v-col>
          <v-divider></v-divider>
        </v-row>
        <v-row>
          <v-col cols="4" class="text-center">
            <p class="text-disabled text-caption">ILP Payout</p>
            <h3 class="text-body font-weight-bold">
              ${{ $localNumber(member.impermanentLossProtection.coverValue) }}
            </h3>
            <p class="text-caption text-disabled">
              {{
                $localNumber(member.impermanentLossProtection.coverCacao)
              }}
              CACAO
            </p>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="4" class="text-center">
            <p class="text-disabled text-caption">ILP coverage</p>
            <h3>{{ $percent(member.impermanentLossProtection.coverage) }}</h3>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="4" class="text-center">
            <p class="text-disabled text-caption">ILP Days left</p>
            <h3>{{ member.impermanentLossProtection.ILPDaysLeft }}</h3>
            <p class="text-disabled text-caption font-weight-bold">
              @{{
                $moment
                  .unix(member.impermanentLossProtection.ILPCoverDate)
                  .format("YYYY/MM/DD")
              }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn color="primary" rounded="0" block variant="tonal">
        detail
        <MayaMemberDetail :member="member" />
      </v-btn>
    </v-card>
  </v-col>
</template>
<script setup lang="ts">
const props = defineProps({
  member: {
    type: Object as PropType<MayaMember>,
    required: true,
  },
});
</script>
