export {};

declare global {
  interface Window {
    ChannelIO?: (command: string, ...args: unknown[]) => void;
  }
}
