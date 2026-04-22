const CHANNEL_TALK_ERROR_AUTO_OPENED_KEY = 'channel-talk:error:auto-opened';

type ShowChannelTalkMessengerOptions = {
  oncePerSession?: boolean;
  sessionStorageKey?: string;
  retryCount?: number;
  retryDelayMs?: number;
};

const hasShownInSession = (key: string) => {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};

const markShownInSession = (key: string) => {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    // noop: sessionStorage may be blocked in some environments.
  }
};

export const showChannelTalkMessenger = (
  options: ShowChannelTalkMessengerOptions = {}
) => {
  const {
    oncePerSession = false,
    sessionStorageKey = CHANNEL_TALK_ERROR_AUTO_OPENED_KEY,
    retryCount = 0,
    retryDelayMs = 100
  } = options;

  if (oncePerSession && hasShownInSession(sessionStorageKey)) {
    return;
  }

  const openMessenger = (remainingRetryCount: number) => {
    const channelIO = window.ChannelIO;

    if (!channelIO) {
      if (remainingRetryCount > 0) {
        window.setTimeout(
          () => openMessenger(remainingRetryCount - 1),
          retryDelayMs
        );
      }
      return;
    }

    channelIO('showChannelButton');
    channelIO('showMessenger');

    if (oncePerSession) {
      markShownInSession(sessionStorageKey);
    }
  };

  openMessenger(retryCount);
};
