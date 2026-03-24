import type { InkDescriptors } from 'polkadot-api/ink';
import type { Enum } from 'polkadot-api';
type StorageDescriptor = {};
type MessagesDescriptor = {
    "count": {
        message: {};
        response: bigint;
    };
    "decrement": {
        message: {};
        response: {};
    };
    "increment": {
        message: {};
        response: {};
    };
};
type ConstructorsDescriptor = {
    "new": {
        message: {};
        response: {};
    };
};
type EventDescriptor = Enum<{
    "CountChanged": {
        "newCount": bigint;
    };
}>;
export declare const descriptor: InkDescriptors<StorageDescriptor, MessagesDescriptor, ConstructorsDescriptor, EventDescriptor>;
export {};
