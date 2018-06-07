import uuid from '../uuid';

describe('UUID Generator', () => {
    test('should have length 36', () => {
        expect(uuid().length).toEqual(36);
    });
    test('should have 32 real characters', () => {
        expect(uuid().replace(/\-/g, '').length).toEqual(32);
    });
});