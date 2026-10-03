export interface RtspCameraOptions {
  brand: 'hikvision' | 'dahua' | 'kbvision' | 'imou' | 'uniview' | 'generic';
  host: string;
  port?: number;
  username?: string;
  password?: string;
  channel?: number;
  subtype?: 'main' | 'sub';
}

export function buildRtspUrl(options: RtspCameraOptions): string {
  const {
    brand,
    host,
    port = 554,
    username,
    password,
    channel = 1,
    subtype = 'main'
  } = options;

  const auth = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';
  const base = `rtsp://${auth}${host}:${port}`;

  switch (brand) {
    case 'hikvision': {
      // 101: channel 1 main stream, 102: channel 1 sub stream
      const streamId = `${channel}0${subtype === 'main' ? 1 : 2}`;
      return `${base}/Streaming/Channels/${streamId}`;
    }
    case 'dahua':
    case 'kbvision':
    case 'imou': {
      const subtypeId = subtype === 'main' ? 0 : 1;
      return `${base}/cam/realmonitor?channel=${channel}&subtype=${subtypeId}`;
    }
    case 'uniview': {
      const streamIndex = subtype === 'main' ? 1 : 2;
      return `${base}/unicast/c${channel}/s${streamIndex}/live`;
    }
    default:
      return `${base}/live/ch${channel}`;
  }
}
