<script lang="ts">
export default {
  props: ["value"],
  computed: {
    width() {
      return `${(+this.value * 100).toFixed(2)}%`;
    },
  },
};
</script>

<template>
  <div class="progress">
    <div class="_inner" :style="{ width: width }">
      <span class="_text">{{ width }}</span>
    </div>
  </div>
</template>


