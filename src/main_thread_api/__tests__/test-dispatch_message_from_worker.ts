import {
    default_handler,
    default_main_sub_to_worker_api,
    dispatch_message_from_worker
} from '../dispatch_message_from_worker';

describe('suite', () => {
    test('should fail', () => {
        expect(1+1).toEqual(1);
    });
});