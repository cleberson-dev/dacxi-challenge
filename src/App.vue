<script setup lang="ts">
import { ref } from "vue";
import { getBitcoinPrice, formatToCurrency, getBitcoinHistory } from "./utils";

let bitcoinDate: string;
let realtimePriceInterval: any;
let selectedCoin: string;

const supportedCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
  },
  {
    id: 'ethereum',
    symbol: 'eth', 
  },
  {
    id: "dacxi",
    symbol: "dacxi",
  },
  {
    id: 'cosmos',
    symbol: 'atom', 
  },
  {
    id: 'terra-luna-2',
    symbol: 'luna', 
  },
];

const bitcoinPrice = ref(0);

async function storeBitcoinPrice() {
  const price = await getBitcoinPrice();

  bitcoinPrice.value = price;
}

function clearRealtimePriceInterval() {
  clearInterval(realtimePriceInterval);
  realtimePriceInterval = undefined;
}

function startRealtimePriceInterval() {
  storeBitcoinPrice();
  realtimePriceInterval = setInterval(storeBitcoinPrice, 5000);
}

function searchHistory() {
  clearRealtimePriceInterval();

  alert(selectedCoin);

  const [yyyy, mm, dd] = bitcoinDate.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  getBitcoinHistory(correctDateString).then((price) => {
    bitcoinPrice.value = price;
  });
}

startRealtimePriceInterval();
</script>

<template>
  <header>
    <div class="flex items-center justify-center">
      <div :key="coin.id" v-for="coin in supportedCoins">
        <input :value="coin.id" type="radio" name="coin" v-model="selectedCoin" />
        <label>{{ coin.symbol.toUpperCase() }}</label>
      </div>
    </div>
    <h1 class="font-bold underline">Bitcoin</h1>
    <p>Price: {{ formatToCurrency(bitcoinPrice) }}</p>
    <input type="date" v-model="bitcoinDate" />
    <button @click="searchHistory">Search</button>
    <button @click="startRealtimePriceInterval">Real-Time Price</button>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
}
</style>
