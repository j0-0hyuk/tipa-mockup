import type { TallyPopupOptions } from '@/@types/tally';

const TALLY_WIDGET_SCRIPT_SRC = 'https://tally.so/widgets/embed.js';

function loadTallyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Tally) {
      resolve();
      return;
    }

    if (document.querySelector(`script[src="${TALLY_WIDGET_SCRIPT_SRC}"]`)) {
      const checkTally = setInterval(() => {
        if (window.Tally) {
          clearInterval(checkTally);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = TALLY_WIDGET_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export async function openTallyPopup(
  formId: string,
  options?: TallyPopupOptions
): Promise<void> {
  await loadTallyScript();

  if (window.Tally) {
    window.Tally.openPopup(formId, options);
  }
}

export function closeTallyPopup(formId: string): void {
  if (window.Tally) {
    window.Tally.closePopup(formId);
  }
}
