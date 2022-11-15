<script setup lang="ts">
import { ref } from "vue";
import { getBitcoinPrice, formatToCurrency } from "./utils";

async function storeBitcoinPrice() {
  const price = await getBitcoinPrice();

  bitcoinPrice.value = price;
}

const bitcoinPrice = ref(0);

storeBitcoinPrice();
setInterval(storeBitcoinPrice, 2000);
</script>

<template>
  <header>
    <h1>Bitcoin</h1>
    <p>Price: {{ formatToCurrency(bitcoinPrice) }}</p>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
}
</style>
