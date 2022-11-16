<script setup lang="ts">
import { ref } from "vue";
import {
  getCoinCurrentPrice,
  formatToCurrency,
  searcHistoricalPrice,
} from "./utils";

let coinDate: string;
let realtimePriceInterval: any;
let selectedCoin: string = "bitcoin";

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

const coinPrice = ref(0);

async function storeCoinPrice() {
  const price = await getCoinCurrentPrice(selectedCoin);

  coinPrice.value = price;
}

function clearRealtimePriceInterval() {
  clearInterval(realtimePriceInterval);
  realtimePriceInterval = undefined;
}

function startRealtimePriceInterval() {
  storeCoinPrice();
  realtimePriceInterval = setInterval(storeCoinPrice, 5000);
}

function searchHistory() {
  clearRealtimePriceInterval();

  const [yyyy, mm, dd] = coinDate.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  searcHistoricalPrice(selectedCoin, correctDateString).then((price) => {
    coinPrice.value = price;
  });
}

startRealtimePriceInterval();
</script>

<template>
  <header>
    <div class="flex items-center justify-center">
      <div :key="coin.id" v-for="coin in supportedCoins">
        <input
          :value="coin.id"
          type="radio"
          name="coin"
          v-model="selectedCoin"
        />
        <label>{{ coin.symbol.toUpperCase() }}</label>
      </div>
    </div>
    <h1 class="font-bold underline">{{ selectedCoin }}</h1>
    <p>Price: {{ formatToCurrency(coinPrice) }}</p>
    <input type="date" v-model="coinDate" />
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
