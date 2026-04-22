import { Client } from '@notionhq/client';

const NOTION_POLL_INTERVAL_MS = 60_000;

type NotionConfig = {
  token: string;
  dataSourceId: string;
};

let cachedLatestTime: string | null = null;
let pollingStarted = false;

const toNonEmptyString = (value: string | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getNotionConfig = (): NotionConfig | null => {
  const token = toNonEmptyString(process.env.NOTION_TOKEN);
  const dataSourceId = toNonEmptyString(process.env.NOTION_DATA_SOURCE_ID);

  if (!token || !dataSourceId) {
    return null;
  }

  return { token, dataSourceId };
};

const toLastEditedTime = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;

  const lastEditedTime = (value as { last_edited_time?: unknown })
    .last_edited_time;

  return typeof lastEditedTime === 'string' ? lastEditedTime : null;
};

const queryLatestTime = async (
  notion: Client,
  dataSourceId: string
): Promise<string | null> => {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    page_size: 1
  });

  if (!response.results || response.results.length === 0) {
    return null;
  }

  return toLastEditedTime(response.results[0]);
};

const pollLatestTime = async (
  notion: Client,
  dataSourceId: string
): Promise<void> => {
  try {
    const latestTime = await queryLatestTime(notion, dataSourceId);
    cachedLatestTime = latestTime;
  } catch (error) {
    console.error('[notion] Failed to poll latest edited time:', error);
  }
};

export const startNotionLatestTimePolling = (): void => {
  if (pollingStarted) return;
  pollingStarted = true;

  const config = getNotionConfig();
  if (!config) {
    console.warn(
      '[notion] Polling disabled: NOTION_TOKEN and NOTION_DATA_SOURCE_ID are required.'
    );
    return;
  }

  const notion = new Client({ auth: config.token });

  void pollLatestTime(notion, config.dataSourceId);

  const timer = setInterval(() => {
    void pollLatestTime(notion, config.dataSourceId);
  }, NOTION_POLL_INTERVAL_MS);

  timer.unref?.();
};

export const getCachedNotionLatestTime = (): string | null => {
  return cachedLatestTime;
};
