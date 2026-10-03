export interface ResolutionCandidate {
  label: string;
  width: number;
  height: number;
}

const COMMON_RESOLUTIONS: ResolutionCandidate[] = [
  { label: '4K', width: 3840, height: 2160 },
  { label: '1440p', width: 2560, height: 1440 },
  { label: '1080p (FHD)', width: 1920, height: 1080 },
  { label: '720p (HD)', width: 1280, height: 720 },
  { label: '480p (VGA)', width: 640, height: 480 }
];

export async function checkSupportedResolutions(deviceId?: string) {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('WebRTC getUserMedia is not supported in this environment');
  }

  const supported: ResolutionCandidate[] = [];

  for (const res of COMMON_RESOLUTIONS) {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { exact: res.width },
          height: { exact: res.height }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      supported.push(res);
      stream.getTracks().forEach((track) => track.stop());
    } catch {}
  }

  return {
    supported,
    highest: supported[0] || null
  };
}
