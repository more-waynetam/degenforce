<template>
    <v-card title="Balance">
        <v-card-text>
            {{ balance  }}
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import {defineProps} from 'vue'
const mayaStore=useMayaStore()
const {data:balance}=useAsyncData('balance',async ()=>{
    let pattern = /^maya1[a-z0-9]{38}$/;
    let isValid = pattern.test(mayaStore.mayaAddress);
    if(isValid){
        const result= await mayaStore.getBalance()
        return result
    }
},{watch:[mayaStore]})

</script>