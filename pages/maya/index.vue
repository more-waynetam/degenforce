<template>
  <v-container>
    <h1 class="text-center text-h1 mt-10">DEGEN FORCE</h1>
    <div style="max-width: 600px;" class="mx-auto my-5 pa-5">
      <v-text-field
          v-model="mayaStore.mayaAddress"
          variant="outlined"
          label="mayas address"
          single-line
          hide-details
          rounded="0"
        ></v-text-field>
    </div>
    <v-row>
      <MayaMember />
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const mayaStore = useMayaStore();
</script>
