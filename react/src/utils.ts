export const getMediaStream = async (): Promise<MediaStream> => {
  try {
    if (navigator.mediaDevices === undefined) {
      throw new Error('浏览器不支持媒体设备');
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphones = devices.filter((item) => item.kind === 'audioinput');
    const cameras = devices.filter((item) => item.kind === 'videoinput');
    if (cameras.length === 0) {
      throw new Error('未发现摄像头');
    }

    const constraints: MediaStreamConstraints = { video: true };
    if (microphones.length > 0) {
      constraints.audio = true;
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    return stream;
  } catch (e: unknown) {
    if ((e as DOMException).name === 'NotAllowedError') {
      throw new Error('用户拒绝访问');
    }
    if ((e as DOMException).name === 'NotReadableError') {
      throw new Error('设备拒绝访问');
    }
  }
  throw new Error('获取媒体流失败');
};

export const detectList = [
  'scenePersonInRectRatio',
  'scenePersonEnter',
  'scenePersonExit',
  'objectDetectCellPhone',
  'objectDetectHat',
  'objectDetectWatch',
  'objectHeadPhone',
  'objectEarPhone',
  'actionHeadUpDown',
  'actionHeadLeftRight',
  'actionHeadShaking',
  'actionPoseStandup',
  'actionPoseSitting',
  'actionPoseHandup',
  'actionPersonSpeech',
];

const detectNameMap = {
  // 0: '设备在左侧',
  scenePersonInRectRatio: '画面占比',
  // 1: '光线过暗',
  // 2: '光线过度',
  scenePersonEnter: '人物进入',
  scenePersonExit: '人物离开',

  objectDetectCellPhone: '打电话',
  objectDetectHat: '戴帽子',
  objectDetectWatch: '戴手表',
  objectHeadPhone: '戴头式耳机',
  objectEarPhone: '戴入耳式耳机',

  actionHeadUpDown: '低/抬头',
  actionHeadLeftRight: '转头',
  actionHeadShaking: '摇头',
  actionPoseStandup: '起立',
  actionPoseSitting: '坐下',
  actionPoseHandup: '举手',

  actionPersonSpeech: '人声检测',
};

type DetectKeys = keyof typeof detectNameMap;

export const getDisplayName = (key: DetectKeys) => {
  return detectNameMap[key] || '';
};

export const imageToMediaStream = async (imageDataUrl: string): Promise<MediaStream | null> => {
  const img = document.createElement('img');
  img.crossOrigin = '*';
  img.src = imageDataUrl;
  img.style.display = 'none';
  document.body.appendChild(img);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('无法创建canvas context');
    return null;
  }

  ctx.drawImage(img, 0, 0);
  const mediaStream = await canvas.captureStream(25);

  document.body.removeChild(img);
  return mediaStream;
};

export const videoToMediaStream = async (videoDataUrl: string): Promise<MediaStream | null> => {
  const video = document.createElement('video');
  video.crossOrigin = '*';
  video.src = videoDataUrl;
  video.autoplay = true;
  video.style.display = 'none';
  document.body.appendChild(video);

  await new Promise((resolve, reject) => {
    video.oncanplay = resolve;
    video.onerror = reject;
  });

  let mediaStream;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (video.captureStream) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mediaStream = video.captureStream();
  } else {
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(video);
    const streamDest = ctx.createMediaStreamDestination();
    source.connect(streamDest);
    source.connect(ctx.destination);
    const audioStream = streamDest.stream;

    console.log(video.videoWidth);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('无法创建canvas context');
      return null;
    }

    context.drawImage(video, 0, 0);
    const mediaStream = await canvas.captureStream(25);

    const audioTrack = audioStream.getAudioTracks()[0];
    mediaStream.addTrack(audioTrack);
  }

  return mediaStream;
};
