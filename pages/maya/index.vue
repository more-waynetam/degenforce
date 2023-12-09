<template>
  <v-container>
    <div style="max-width: 600px;" class="mx-auto my-5 pa-5">
      <v-img src="/images/dgf-dark-logo-text-trans2.svg" class="my-10"></v-img>
      <v-text-field
          v-model="mayaStore.mayaAddress"
          variant="outlined"
          label="maya address"
          single-line
          hide-details
          rounded="0"
        ></v-text-field>
        <p v-if="error" class="text-error my-2">Incorrect maya address</p>
    </div>
    <v-row>
      <MayaMember />
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const mayaStore = useMayaStore();
const error = ref(false);
watch(
  () => mayaStore.mayaAddress,
  (val) => {
    const address= mayaStore.mayaAddress.toLowerCase().trim();
    let pattern = /^maya1[a-z0-9]{38}$/;
    if (pattern.test(address)) {
      error.value = false;
    } else {
      error.value = true;
    }
  }
);
</script>
