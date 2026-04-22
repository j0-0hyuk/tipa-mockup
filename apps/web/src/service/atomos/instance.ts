type AtomosInitParams = {
    workspaceId: string;
}

type AtomosTrackParams = {
    type: 'REGISTER' | 'ADD_TO_CART' | 'COMPLETE_REGISTRATION';

} | {
    type: 'UTMSALE'
    data: {
        sales: number;
    }
}


export class Atomos {
    private _workspaceId: string;

    constructor({ workspaceId }: AtomosInitParams) {
        this._workspaceId = workspaceId;
    }

    track = (params: AtomosTrackParams): void => {
        if (typeof window === 'undefined' || !window.ATOMOS) {
            console.warn('ATOMOS is not available');
            return;
        }

        if ('data' in params) {
            window.ATOMOS.event(this._workspaceId, params.type, params.data);
        } else {
            window.ATOMOS.event(this._workspaceId, params.type, {});
        }
    }
}

export const atomos = new Atomos({ workspaceId: import.meta.env.VITE_ATOMOS_WORKSPACE_ID });