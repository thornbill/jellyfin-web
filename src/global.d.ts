export declare global {
    import { ApiClient, Events } from 'jellyfin-apiclient';

    // Globals declared in webpack
    declare const __USE_SYSTEM_FONTS__: boolean;
    declare const __WEBPACK_SERVE__: boolean;

    interface Window {
        ApiClient: ApiClient;
        Events: Events;
        NativeShell: any;
    }

    interface DocumentEventMap {
        'viewshow': CustomEvent;
    }
}
