<script  lang="ts">
import Header from "./components/Header.vue";
import Progress from "./components/Progress.vue";
import Detect from "./components/Detect.vue";

export default {
  components: {
    Header,
    Progress,
    Detect,
  },
};
</script>

<template>
  <Header />
  <Detect />
</template>

