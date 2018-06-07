import expose_main_to_workers, { expose_main_api_to_worker } from '../expose_main_to_workers';

describe('suite', () => {
    test('should fail', () => {
        expect(1 + 1).toEqual(1);
    });
});