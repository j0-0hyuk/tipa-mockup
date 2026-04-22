export {};

declare global {
  interface Window {
    ATOMOS?: {
      event: (
        workspaceId: string,
        eventType: string,
        data: Record<string, unknown>
      ) => void;
    };
  }
}
