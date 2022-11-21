<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ButtonGroup from "./components/ButtonGroup.vue";
import CustomButton from "./components/CustomButton.vue";
import {
  getCoinCurrentPrice,
  formatToCurrency,
  searcHistoricalPrice,
} from "./utils";
import { supportedCoins } from "./data";

let realtimePriceInterval: any;
const supportedCoinsButtonGroupItems = supportedCoins.map((coin) => ({
  id: coin.id,
  label: coin.symbol,
}));

const isLoadingCoinPrice = ref(true);
const coinPrice = ref(0);
const coinDate = ref("");
const isRealtime = ref(true);
const selectedCoinId = ref(supportedCoins[0].id);
const shownCoinPriceDate = ref<Date>();

const formattedCoinPrice = computed(() => {
  if (isLoadingCoinPrice.value) return "----";

  return formatToCurrency(coinPrice.value);
});

const formattedCoinPriceDate = computed(() => {
  if (!shownCoinPriceDate.value) return "----";

  return shownCoinPriceDate.value.toLocaleDateString(
    "pt-BR",
    isRealtime.value
      ? {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      : undefined
  );
});

const isValidDate = computed(() => !!coinDate.value.match(/\d{4}-\d{2}-\d{2}/));

watch(selectedCoinId, () => {
  isLoadingCoinPrice.value = true;

  if (isRealtime.value) return;

  searchHistory();
});

startRealtimePriceInterval();

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

async function searchHistory() {
  clearRealtimePriceInterval();

  isLoadingCoinPrice.value = true;

  const [yyyy, mm, dd] = coinDate.value.split("-");
  const correctDateString = [dd, mm, yyyy].join("-");

  const newPrice = await searcHistoricalPrice(
    selectedCoinId.value,
    correctDateString
  );

  coinPrice.value = newPrice;
  shownCoinPriceDate.value = new Date(+yyyy, +mm - 1, +dd);
  isLoadingCoinPrice.value = false;
}
</script>

<template>
  <main class="flex flex-col h-screen justify-center items-center">
    <ButtonGroup
      v-model="selectedCoinId"
      :items="supportedCoinsButtonGroupItems"
    />

    <div
      class="flex flex-col items-center p-8 my-4 w-full rounded border border-solid border-white/5"
    >
      <button
        :disabled="isRealtime"
        @click="startRealtimePriceInterval"
        class="select-none cursor-pointer font-semibold disabled:cursor-default"
        :class="{ 'text-red-600': isRealtime }"
      >
        LIVE
      </button>

      <p class="text-5xl text-purple-500 font-bold mb-2">
        {{ formattedCoinPrice }}
      </p>

      <p class="opacity-40">
        <small>{{ formattedCoinPriceDate }}</small>
      </p>
    </div>

    <div class="flex flex-col items-center">
      <label>Pick a date</label>
      <input type="date" v-model="coinDate" class="rounded p-2 bg-white/5" />
      <CustomButton
        title="Search"
        @click="searchHistory"
        :disabled="!isValidDate"
      />
    </div>
  </main>
</template>
