<script lang="ts">
import Card from "./Card.vue";
import Progress from "./Progress.vue";
import DetectResult from "./DetectResult.vue";

import { getMediaStream } from "../utils";
import type AliyunDetectEngine from "../AliyunDetectEngine";

export default {
  data() {
    return {
      showDebug: false,
      cheatEngine: null as AliyunDetectEngine | null,
      useWebGL: false,
    };
  },
  async mounted() {
    const stream = await getMediaStream();
    const debugCanvas = this.$refs.debugCanvasRef as HTMLCanvasElement;
    const videoRef = this.$refs.videoRef as HTMLVideoElement;

    const cheatEngine = new AliyunDetectEngine();
    this.cheatEngine = cheatEngine;
    await cheatEngine.init(
      {
        licenseKey: '',//申请的licenseKey
        licenseDomain: '',//licenseKey关联的根域名
      },
      debugCanvas || undefined
    );
    this.useWebGL = cheatEngine.config?.useWebGL || false;
    if (videoRef) {
      videoRef.srcObject = stream;
    }
    cheatEngine.startDetect(videoRef);

    // 仅 Debug 需要
    cheatEngine.on("detectResult", () => {
      if (videoRef && this.showDebug) {
        const { videoWidth, videoHeight, clientWidth, clientHeight } = videoRef;
        const videoAspect = videoWidth / videoHeight;
        const clientAspect = clientWidth / clientHeight;
        if (debugCanvas) {
          // 视频横屏铺满
          if (videoAspect > clientAspect) {
            debugCanvas.style.left = "0";
            debugCanvas.style.width = "100%";
            debugCanvas.style.top = `${
              ((1 - clientAspect / videoAspect) / 2) * 100
            }%`;
            debugCanvas.style.height = `${(clientAspect / videoAspect) * 100}%`;
          } else {
            debugCanvas.style.top = "0";
            debugCanvas.style.height = "100%";
            debugCanvas.style.left = `${
              ((1 - videoAspect / clientAspect) / 2) * 100
            }%`;
            debugCanvas.style.width = `${(videoAspect / clientAspect) * 100}%`;
          }
        }
      }
    });
  },
  unmounted() {
    this.cheatEngine?.destroy();
  },
  methods: {
    onDebugChange(e: Event) {
      this.showDebug = (e.target as HTMLInputElement).checked;
    },
  },
  components: { Card, Progress, DetectResult },
};
</script>
<template>
  <div class="bd">
    <Card class="preview">
      <div class="video-box">
        <video autoPlay playsInline muted ref="videoRef" />
        <canvas
          ref="debugCanvasRef"
          :style="{
            display: showDebug ? 'block' : 'none',
          }"
        />
      </div>
      <div v-if="useWebGL" class="debug">
        <input
          type="checkbox"
          id="switch"
          name="switch"
          @change="onDebugChange"
        />
        <label htmlFor="switch">打开点位图</label>
      </div>
    </Card>
    <DetectResult :cheatEngine="cheatEngine" />
  </div>
</template>