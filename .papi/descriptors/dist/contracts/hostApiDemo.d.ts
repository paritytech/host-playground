import type { InkDescriptors } from 'polkadot-api/ink';
import type { HexString, Enum } from 'polkadot-api';
type Address = HexString;
type StorageDescriptor = {};
type MessagesDescriptor = {
    "deposit": {
        message: {};
        response: {};
    };
    "getBalance": {
        message: {};
        response: bigint;
    };
    "getStoredData": {
        message: {};
        response: Uint8Array;
    };
    "getStoredDataLength": {
        message: {};
        response: bigint;
    };
    "getStoredValue": {
        message: {};
        response: bigint;
    };
    "owner": {
        message: {};
        response: Address;
    };
    "storeData": {
        message: {
            "_data": Uint8Array;
        };
        response: {};
    };
    "storeValue": {
        message: {
            "_value": bigint;
        };
        response: {};
    };
    "storeValueIfPerson": {
        message: {
            "_value": bigint;
            "request": {
                "expectedStatus": number;
                "proof": Uint8Array;
                "expectedAlias": Uint8Array;
                "ringIndex": number;
                "context": Uint8Array;
                "revision": number;
                "message": Uint8Array;
            };
        };
        response: {};
    };
    "storedData": {
        message: {};
        response: Uint8Array;
    };
    "storedValue": {
        message: {};
        response: bigint;
    };
    "totalDeposits": {
        message: {};
        response: bigint;
    };
    "version": {
        message: {};
        response: bigint;
    };
    "withdraw": {
        message: {
            "_amount": bigint;
        };
        response: {};
    };
    "receive": {
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
    "DataStored": {
        "length": bigint;
    };
    "Deposited": {
        "sender": Address;
        "amount": bigint;
    };
    "ValueStored": {
        "oldValue": bigint;
        "newValue": bigint;
    };
    "ValueStoredByPerson": {
        "sender": Address;
        "contextAlias": Uint8Array;
        "newValue": bigint;
    };
    "Withdrawn": {
        "to": Address;
        "amount": bigint;
    };
}>;
export declare const descriptor: InkDescriptors<StorageDescriptor, MessagesDescriptor, ConstructorsDescriptor, EventDescriptor>;
export {};
