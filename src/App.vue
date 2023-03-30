<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="nav">
    <RouterLink to="/">my</RouterLink> |
    <RouterLink to="/animation_skinning_blending">animation-skinning-blending</RouterLink>
  </div>

  <RouterView />
</template>

<style scoped>
.nav {
  position: absolute;
  color: aliceblue;
  top: 0;
  z-index: 9999;
}
.nav a {
  color: aliceblue;
}
</style>
