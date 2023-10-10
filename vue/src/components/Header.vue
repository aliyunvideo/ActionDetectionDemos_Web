<script lang="ts">
import logoUrl from "../assets/logo.png";

export default {
  data() {
    return { logoUrl };
  },
};
</script>
<template>
  <nav class="hd">
    <div class="_inner">
      <img :src="logoUrl" alt="Logo" />
      <span>远程监考智能防作弊</span>
    </div>
  </nav>
</template>