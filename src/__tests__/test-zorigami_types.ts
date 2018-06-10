import {
    isMessagePort,
    isCustomPort,
    isPromisedPostMessage
} from '../zorigami_types';

describe('Type Guards', () => {
    test('MessagePort', () => {
        const channel = new MessageChannel();
        expect(isMessagePort(channel.port1)).toBe(true);
    });
    test('CustomPort', () => {
        
    });
    test('PromisedPostMessage', () => {
        
    });
});