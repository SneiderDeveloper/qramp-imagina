import { ComputedRef } from 'vue'

export interface Action {
    props: {
        loading: boolean;
        color: string;
        'icon-right'?: string;
        label: string;
    };
    action: () => void;
}

export interface ModelActionsModalResult {
    actions: ComputedRef<Action[]>;
}

export interface Proxy {
    $refs: {
        refFormFields: {
            $refs: {
                refFormScheduler: any;
            };
        };
    };
    $root: {
        $emit: (event: string) => void;
    };
}