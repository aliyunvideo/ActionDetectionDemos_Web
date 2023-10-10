<script lang="ts">
import { defineComponent } from "vue";
import Card from "./Card.vue";
import Progress from "./Progress.vue";

import { getDisplayName, detectList } from "../utils";
import type AliyunDetectEngine from "../AliyunDetectEngine";

export default defineComponent({
  props: {
    cheatEngine: AliyunDetectEngine,
  },
  data() {
    return {
      detectResult: null as any,
      detectList,
    };
  },

  methods: {
    getDisplayName(key: any) {
      return getDisplayName(key);
    },
  },

  components: { Card, Progress },
  watch: {
    // whenever question changes, this function will run
    cheatEngine(newCheatEngine) {
      if (newCheatEngine) {
        newCheatEngine.on("detectResult", (result: any) => {
          this.detectResult = result;
        });
      }
    },
  },
});
</script>
<template>
  <Card class="result">
    <div>
      提示：
      <ol>
        <li>起立(需要全身在画面中，通常在侧机位使用)</li>
        <li>坐下(需要全身在画面中，通常在侧机位使用)</li>
      </ol>
    </div>
    <div class="card-divider" />
    <div v-if="detectResult">
      检测人数：<kbd>{{ detectResult.faceCount }}</kbd>
      <ul class="result-list">
        <li v-for="key in detectList" :key="key">
          {{ getDisplayName(key) }}
          <Progress :value="detectResult[key] || 0" />
        </li>
      </ul>
    </div>
  </Card>
</template>