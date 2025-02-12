import { WritableComputedRef, ComputedRef, Ref } from 'vue';
import { Action } from './modelActionsModal.contract'

/**
 * Reference to the form fields for the scheduler modal.
 */
type RefFormFields = Ref<HTMLElement | null>;

/**
 * Computed property indicating whether the application is in a loading state.
 */
type LoadingComputed = ComputedRef<boolean>;

/**
 * Computed property representing the title of the modal.
 */
type TitleModalComputed = ComputedRef<string>;

/**
 * Writable computed property controlling the visibility of the modal.
 */
type ShowModalWritableComputed = WritableComputedRef<boolean>;

/**
 * Object containing various actions related to the scheduler modal.
 */
export interface ModalActions {
    [key: string]: Function; // Update this with actual action types
}

export interface HelpText {
    title: string;
    description: string;
}

/**
 * Interface for the main composition function.
 */
export interface SchedulerModalComposition {
    showModal: ShowModalWritableComputed;
    actions: ComputedRef<Action[]>;
    refFormFields: RefFormFields;
    clear: () => void;
    loading: LoadingComputed;
    titleModal: TitleModalComputed;
    helpText: ComputedRef<HelpText>;
}

