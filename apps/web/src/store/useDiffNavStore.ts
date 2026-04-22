import { create } from 'zustand';

type DiffNavState = {
  ids: string[];
  setIds: (ids: string[]) => void;
  getNextId: (id: string) => string | null;
  getPrevId: (id: string) => string | null;
};

export const useDiffNavStore = create<DiffNavState>((set, get) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  getNextId: (id) => {
    const { ids } = get();
    const i = ids.indexOf(id);
    if (i === -1) return ids[0] ?? null;
    return ids[i + 1] ?? null;
  },
  getPrevId: (id) => {
    const { ids } = get();
    const i = ids.indexOf(id);
    if (i === -1) return ids[ids.length - 1] ?? null;
    return ids[i - 1] ?? null;
  }
}));

const collectDiffIds = (root: ParentNode) => {
  const uniqueIds = new Set<string>();

  for (const el of root.querySelectorAll<HTMLElement>(
    '[data-diffwrap="true"][id]'
  )) {
    uniqueIds.add(el.id);
  }

  // Paged.js 출력본에서 data-* 속성이 유실될 수 있어 버튼 id로 보완한다.
  for (const button of root.querySelectorAll<HTMLButtonElement>(
    'button[id$="-apply"], button[id$="-cancel"]'
  )) {
    const baseId = button.id.replace(/-(apply|cancel)$/, '');
    if (baseId) {
      uniqueIds.add(baseId);
    }
  }

  return Array.from(uniqueIds);
};

export function syncDiffIdsFromDOM(root: ParentNode = document) {
  const newIds = collectDiffIds(root);
  const currentIds = useDiffNavStore.getState().ids;
  const hasChanged =
    currentIds.length !== newIds.length ||
    currentIds.some((id, index) => id !== newIds[index]);

  if (hasChanged) {
    useDiffNavStore.getState().setIds(newIds);
  }
}
