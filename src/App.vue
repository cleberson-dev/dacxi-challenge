<script setup lang="ts">
import { ref, computed } from "vue";
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

let realtimePriceInterval: any;
let selectedCoin = ref(supportedCoins[0]);

const coinPrice = ref(0);
const coinDate = ref("");
const isRealtime = ref(true);

const isValidDate = computed(() => {
  console.log({ coinDate: coinDate.value });

  return !!coinDate.value.match(/\d{4}-\d{2}-\d{2}/);
});

async function storeCoinPrice() {
  const price = await getCoinCurrentPrice(selectedCoin.value.id);
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
  coinDate.value = "";
}

function searchHistory() {
  clearRealtimePriceInterval();

  const [yyyy, mm, dd] = coinDate.value.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  searcHistoricalPrice(selectedCoin.value.id, correctDateString).then(
    (price) => {
      coinPrice.value = price;
    }
  );
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

    <input
      class="rounded p-2"
      :style="{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }"
      type="date"
      v-model="coinDate"
    />
    <button
      class="disabled:opacity-25 disabled:cursor-default cursor-pointer mt-2 bg-slate-300 text-black px-3 py rounded"
      @click="searchHistory"
      :disabled="!isValidDate"
    >
      Search
    </button>

    <div class="flex items-center justify-center mt-4 bg-white/10 rounded">
      <div
        :key="coin.id"
        v-for="coin in supportedCoins"
        class="p-2"
        :class="{ 'bg-black/40': coin.id === selectedCoin.id }"
      >
        <input
          type="radio"
          name="coin"
          v-model="selectedCoin"
          :id="'coin-' + coin.id"
          :value="coin"
          class="hidden"
        />
        <label
          :for="'coin-' + coin.id"
          class="cursor-pointer font-semibold"
          :class="{
            'text-purple-500 cursor-default': coin.id === selectedCoin.id,
          }"
          >{{ coin.symbol.toUpperCase() }}</label
        >
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
