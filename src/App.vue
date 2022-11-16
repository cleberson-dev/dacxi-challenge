<script setup lang="ts">
import { ref } from "vue";
import {
  getCoinCurrentPrice,
  formatToCurrency,
  searcHistoricalPrice,
} from "./utils";

const supportedCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
  },
  {
    id: "ethereum",
    symbol: "eth",
  },
  {
    id: "dacxi",
    symbol: "dacxi",
  },
  {
    id: "cosmos",
    symbol: "atom",
  },
  {
    id: "terra-luna-2",
    symbol: "luna",
  },
];

let coinDate: string;
let realtimePriceInterval: any;
let selectedCoin = supportedCoins[0];

const coinPrice = ref(0);
const isRealtime = ref(true);

async function storeCoinPrice() {
  const price = await getCoinCurrentPrice(selectedCoin.id);
  coinPrice.value = price;
}

function clearRealtimePriceInterval() {
  clearInterval(realtimePriceInterval);
  realtimePriceInterval = undefined;
  isRealtime.value = false;
}

function startRealtimePriceInterval() {
  storeCoinPrice();
  realtimePriceInterval = setInterval(storeCoinPrice, 5000);
  isRealtime.value = true;
}

function searchHistory() {
  clearRealtimePriceInterval();

  const [yyyy, mm, dd] = coinDate.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  searcHistoricalPrice(selectedCoin.id, correctDateString).then((price) => {
    coinPrice.value = price;
  });
}

startRealtimePriceInterval();
</script>

<template>
  <main class="flex flex-col h-screen justify-center items-center">
    <div class="flex gap-x-2">
      <button
        @click="startRealtimePriceInterval"
        class="select-none cursor-pointer disabled:cursor-default"
        :class="{ 'text-red-600': isRealtime }"
        :disabled="isRealtime"
      >
        LIVE
      </button>
    </div>

    <p class="text-5xl font-bold text-purple-500 mb-4">
      {{ formatToCurrency(coinPrice) }}
    </p>

    <button class="" @click="searchHistory">Search</button>
    <input class="rounded text-black" type="date" v-model="coinDate" />

    <div class="flex items-center justify-center mt-4">
      <div :key="coin.id" v-for="coin in supportedCoins">
        <input type="radio" name="coin" :value="coin" v-model="selectedCoin" />
        <label>{{ coin.symbol.toUpperCase() }}</label>
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
}
</style>
