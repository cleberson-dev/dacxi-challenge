<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <HelloWorld msg="Hello, Cleberson!" />
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    justify-content: center;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
