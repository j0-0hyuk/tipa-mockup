interface TallyPopupOptions {
    key?: string;
    layout?: 'default' | 'modal';
    width?: number;
    alignLeft?: boolean;
    hideTitle?: boolean;
    overlay?: boolean;
    emoji?: {
        text: string;
        animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
    };
    autoClose?: number;
    showOnce?: boolean;
    doNotShowAfterSubmit?: boolean;
    customFormUrl?: string;
    hiddenFields?: Record<string, unknown>;
    onOpen?: () => void;
    onClose?: () => void;
    onPageView?: (page: number) => void;
    onSubmit?: (payload: unknown) => void;
}

declare global {
    interface Window {
        Tally?: {
            loadEmbeds: () => void;
            openPopup: (formId: string, options?: TallyPopupOptions) => void;
            closePopup: (formId: string) => void;
        }
    }
}

export type { TallyPopupOptions };
