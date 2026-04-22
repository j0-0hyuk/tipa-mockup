export async function captureWithServer(
  html: string,
  ids: string[],
  width = 1200
): Promise<Map<string, { dataUrl: string; info: string | null }>> {
  const apiUrl = import.meta.env.VITE_AI_API_URL || '';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${apiUrl}make/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html, ids, width }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server capture failed: ${response.statusText}`);
    }

    const data: Array<{
      id: string;
      base64: string;
      info?: string;
      width?: number;
      height?: number;
    }> = await response.json();

    const map = new Map<string, { dataUrl: string; info: string | null }>();

    for (const item of data) {
      map.set(item.id, {
        dataUrl: `data:image/png;base64,${item.base64}`,
        info: item.info ?? null
      });
    }

    return map;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Server capture timeout');
    }
    throw error;
  }
}
