<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ButtonGroup from "./components/ButtonGroup.vue";
import CustomButton from "./components/CustomButton.vue";
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

const isLoadingCoinPrice = ref(true);
const coinPrice = ref(0);
const coinDate = ref("");
const isRealtime = ref(true);
const selectedCoinId = ref(supportedCoins[0].id);
const shownCoinPriceDate = ref<Date>();

const formattedCoinPriceDate = computed(() => {
  if (!shownCoinPriceDate.value) return "----";

  if (!isRealtime.value) return shownCoinPriceDate.value.toLocaleDateString();

  return shownCoinPriceDate.value.toISOString();
});

const isValidDate = computed(() => {
  console.log({ coinDate: coinDate.value });

  return !!coinDate.value.match(/\d{4}-\d{2}-\d{2}/);
});

watch(selectedCoinId, () => {
  isLoadingCoinPrice.value = true;
  if (isRealtime.value) return;

  searchHistory();
});

async function storeCoinPrice() {
  if (!isRealtime.value) return;

  const price = await getCoinCurrentPrice(selectedCoinId.value);

  coinPrice.value = price;
  shownCoinPriceDate.value = new Date();
  isLoadingCoinPrice.value = false;
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

  isLoadingCoinPrice.value = true;

  const [yyyy, mm, dd] = coinDate.value.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  searcHistoricalPrice(selectedCoinId.value, correctDateString).then(
    (price) => {
      coinPrice.value = price;
      shownCoinPriceDate.value = new Date(+yyyy, +mm - 1, +dd);
      isLoadingCoinPrice.value = false;
    }
  );
}

startRealtimePriceInterval();
</script>

<template>
  <main class="flex flex-col h-screen justify-center items-center">
    <ButtonGroup
      v-model="selectedCoinId"
      :items="
        supportedCoins.map((coin) => ({ id: coin.id, label: coin.symbol }))
      "
    />

    <div
      class="flex flex-col items-center p-8 my-4 w-full rounded border border-solid border-white/5"
    >
      <button
        @click="startRealtimePriceInterval"
        class="select-none cursor-pointer font-semibold disabled:cursor-default"
        :class="{ 'text-red-600': isRealtime }"
        :disabled="isRealtime"
      >
        LIVE
      </button>

      <p class="text-5xl font-bold text-purple-500 mb-2">
        {{ isLoadingCoinPrice ? "----" : formatToCurrency(coinPrice) }}
      </p>

      <p class="opacity-40">
        <small>{{ formattedCoinPriceDate }}</small>
      </p>
    </div>

    <div class="flex flex-col items-center">
      <label>Pick a date</label>
      <input
        class="rounded p-2"
        :style="{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }"
        type="date"
        v-model="coinDate"
      />
      <CustomButton
        title="Search"
        @click="searchHistory"
        :disabled="!isValidDate"
      />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
}
</style>
