interface DetectInitOptions {
  fps?: number;
  detectTimeout?: number;
  objectDetect?: boolean;
  scenePersonEnter?: boolean;
  scenePersonExit?: boolean;
  scenePersonInRectRatio?: boolean;
  actionHeadUpDown?: boolean;
  actionHeadLeftRight?: boolean;
  actionHeadShaking?: boolean;
  actionPoseStandup?: boolean;
  actionPoseSitting?: boolean;
  actionPoseHandup?: boolean;
  actionPersonSpeech?: boolean;
  detectSkipFrame?: number;
  enableRender?: boolean;
  licenseKey?: string;
  licenseDomain?: string;
}
type DetectOptions = DetectInitOptions & {
  useWebGL?: boolean;
};
type DetectEngineVideoResult = {
  detectDic: {
    [key: string]: number;
  };
};
type DetectEngineEvents = {
  detectResult: DetectEngineVideoResult;
  detectStart: void;
};
export default class AliyunDetectEngine {
  constructor();
  /**
   * 新增事件监听
   * @param type
   * @param handler
   */
  on<Key extends keyof DetectEngineEvents>(type: Key, handler: any): void;
  /**
   * 取消事件监听
   * @param type
   * @param handler
   */
  off<Key extends keyof DetectEngineEvents>(type: Key, handler: any): void;
  /**
   * SDK初始化
   * @param options 初始化参数，可以定义检测帧率，超时时间，各个功能开关等信息
   * @param renderCanvas 仅用于 Debug，用于渲染输出检测点位的 Canvas
   * @returns
   */
  init(options: DetectInitOptions, renderCanvas?: HTMLCanvasElement): Promise<void>;
  /**
   * 更新检测 FPS 限制，默认为5fps
   * @param fps 检测限制 FPS
   */
  updateFpsLimit(fps: number): void;
  /**
   * 更新检测超时时间
   * @param timeout 检测任务超时时间
   */
  updateDetectTimeout(timeout: number): void;
  /**
   * 获取当前配置
   */
  get config(): DetectOptions | undefined;
  /**
   * 开始检测
   * @param videoElement 需要检测的 videoElement，会从 srcObject 中获取 mediaStream 来检测音频
   * @param width
   * @param height
   */
  startDetect(videoElement: HTMLVideoElement): void;
  /**
   * 检测引擎注销
   */
  destroy(): void;
}
interface Window {
  AliyunDetectEngine: AliyunDetectEngine;
}
