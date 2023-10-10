/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import Card from './Card';
import Progress from './Progress';
import { detectList, getDisplayName, getMediaStream, imageToMediaStream, videoToMediaStream } from './utils';
import type AliyunDetectEngine from './AliyunDetectEngine';

interface ResultProps {
  cheatEngine?: AliyunDetectEngine;
}

function Result({ cheatEngine }: ResultProps) {
  const [detectResult, setDetectResult] = useState<any>();

  useEffect(() => {
    (async () => {
      if (!cheatEngine) return;
      cheatEngine.on('detectResult', (result: any) => {
        setDetectResult(result);
      });
      return () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cheatEngine?.off('*');
      };
    })();
  }, [cheatEngine]);

  return (
    <Card className='result'>
      <div>
        提示：
        <ol>
          <li>起立(需要全身在画面中，通常在侧机位使用)</li>
          <li>坐下(需要全身在画面中，通常在侧机位使用)</li>
        </ol>
      </div>
      <div className='card-divider' />
      {detectResult && (
        <>
          检测人数：<kbd>{detectResult.faceCount}</kbd>
          <ul className='result-list'>
            {detectList.map((item: any) => {
              return (
                <li key={item}>
                  {getDisplayName(item)}
                  <Progress value={detectResult[item] || 0} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}

function Detect() {
  const [cheatEngine, setCheatEngine] = useState<AliyunDetectEngine>();
  const [showDebug, setShowDebug] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const showDebugRef = useRef(false);

  const onDebugChange = useCallback((e: ChangeEvent) => {
    setShowDebug((e.target as HTMLInputElement).checked);
    showDebugRef.current = (e.target as HTMLInputElement).checked;
  }, []);

  const onImageChange = useCallback(async (e: ChangeEvent) => {
    if (!mediaStreamRef.current) return;
    const [file] = (e.target as HTMLInputElement).files || [];
    if (file && mediaStreamRef.current) {
      const imageStream = await imageToMediaStream(URL.createObjectURL(file));
      mediaStreamRef.current.getTracks().forEach((track) => {
        mediaStreamRef.current?.removeTrack(track);
      });
      if (imageStream?.getVideoTracks()) {
        mediaStreamRef.current.addTrack(imageStream.getVideoTracks()[0]);
      }
    }
  }, []);

  const onVideoChange = useCallback(async (e: ChangeEvent) => {
    if (!mediaStreamRef.current) return;
    const [file] = (e.target as HTMLInputElement).files || [];
    if (file && mediaStreamRef.current) {
      const videoStream = await videoToMediaStream(URL.createObjectURL(file));
      mediaStreamRef.current.getTracks().forEach((track) => {
        mediaStreamRef.current?.removeTrack(track);
      });
      if (videoStream?.getVideoTracks()) {
        mediaStreamRef.current.addTrack(videoStream.getVideoTracks()[0]);
      }
      if (videoStream?.getAudioTracks()) {
        mediaStreamRef.current.addTrack(videoStream.getAudioTracks()[0]);
      }
    }
  }, []);

  useEffect(() => {
    let cheatEngine: AliyunDetectEngine;
    (async () => {
      try {
        const stream = await getMediaStream();
        mediaStreamRef.current = stream;
        cheatEngine = new window.AliyunDetectEngine();

        await cheatEngine.init(
          {
            licenseKey: '',//申请的licenseKey
            licenseDomain: '',//licenseKey关联的根域名
          },
          debugCanvasRef?.current || undefined
        );
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          cheatEngine.startDetect(videoRef.current);
        }

        // 仅 Debug 需要
        cheatEngine.on('detectResult', () => {
          if (videoRef.current && showDebugRef.current) {
            const { videoWidth, videoHeight, clientWidth, clientHeight } = videoRef.current;
            const videoAspect = videoWidth / videoHeight;
            const clientAspect = clientWidth / clientHeight;
            if (debugCanvasRef.current) {
              // 视频横屏铺满
              if (videoAspect > clientAspect) {
                debugCanvasRef.current.style.left = '0';
                debugCanvasRef.current.style.width = '100%';
                debugCanvasRef.current.style.top = `${((1 - clientAspect / videoAspect) / 2) * 100}%`;
                debugCanvasRef.current.style.height = `${(clientAspect / videoAspect) * 100}%`;
              } else {
                debugCanvasRef.current.style.top = '0';
                debugCanvasRef.current.style.height = '100%';
                debugCanvasRef.current.style.left = `${((1 - videoAspect / clientAspect) / 2) * 100}%`;
                debugCanvasRef.current.style.width = `${(videoAspect / clientAspect) * 100}%`;
              }
            }
          }
        });

        setCheatEngine(cheatEngine);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error.message);
      }
    })();

    return () => {
      cheatEngine?.destroy();
    };
  }, []);

  return (
    <div className='bd'>
      <Card className='preview'>
        <div className='video-box'>
          <video autoPlay playsInline muted ref={videoRef} />
          <canvas
            ref={debugCanvasRef}
            style={{
              display: showDebug ? 'block' : 'none',
            }}
          />
        </div>
        {cheatEngine?.config?.useWebGL && (
          <div className='debug'>
            <input type='checkbox' id='switch' name='switch' onChange={onDebugChange} />
            <label htmlFor='switch'>打开点位图</label>
            <button
              className='_change'
              onClick={() => {
                setShowChange(!showChange);
              }}
            >
              &#12288;
            </button>
          </div>
        )}
        {showChange && (
          <div className='debug-source'>
            <div>
              选择图片 <input type='file' onChange={onImageChange} accept='image/png, image/gif, image/jpeg' />
            </div>
            <div>
              选择视频 <input type='file' onChange={onVideoChange} accept='video/mp4,video/x-m4v,video/*' />
            </div>
          </div>
        )}
      </Card>
      <Result cheatEngine={cheatEngine} />
    </div>
  );
}

export default Detect;
