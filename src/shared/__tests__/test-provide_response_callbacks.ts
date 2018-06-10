import provider, { WorkerResponseCallbackStore } from '../provide_response_callbacks';
import uuid from '../../utility/uuid';
import { ResponseCallback } from '../../zorigami_types';

describe('built in provider works', () => {
    beforeAll(() => {
        jest.spyOn(provider, 'getResponseCallback');
        jest.spyOn(provider, 'setResponseCallback');
        jest.spyOn(provider, 'removeResponseCallback');
        jest.spyOn(provider, 'listResponseCallbacks');
    });
    test('provider is an instance of WorkerResponseCallbackStore', () => {
        expect(provider).toBeInstanceOf(WorkerResponseCallbackStore);;
    });
    test('provider is empty', () => {
        expect(provider.listResponseCallbacks()).toEqual({});
    });
});
/*
TODO
- reset the instance after each test
- reset the properties after each test (except the setter methods)
*/

describe('constructed provider works', () => {
    const new_provider = new WorkerResponseCallbackStore();
    beforeAll(() => {
        jest.spyOn(new_provider, 'getResponseCallback');
        jest.spyOn(new_provider, 'setResponseCallback');
        jest.spyOn(new_provider, 'removeResponseCallback');
        jest.spyOn(new_provider, 'listResponseCallbacks');
    });
    const callback_guid = uuid();
    const response_callback = jest.fn((resp, error) => {
        console.log(resp);
        if (error) {
            throw new Error(error)
        };
    });
    const callback_guid_2 = uuid();
    const response_callback_2 = jest.fn((resp, error) => {
        console.log(resp);
        if (error) {
            throw new Error(error)
        };
    });
    test('setResponseCallbacks', () => {
        const fake_guid = 'fake_guid';
        const fake_callback = () => undefined;
        new_provider.setResponseCallback(fake_guid, fake_callback)
        expect(new_provider.getResponseCallback(fake_guid)).toBe(fake_callback);
        expect(new_provider.listResponseCallbacks()).toHaveProperty(fake_guid);
    });
    describe('accessor methods', () => {
        let new_provider = new WorkerResponseCallbackStore();
        beforeEach(() => {
            new_provider = new WorkerResponseCallbackStore();
            jest.spyOn(new_provider, 'getResponseCallback');
            jest.spyOn(new_provider, 'setResponseCallback');
            jest.spyOn(new_provider, 'removeResponseCallback');
            jest.spyOn(new_provider, 'listResponseCallbacks');
            new_provider.setResponseCallback(callback_guid, response_callback);
            new_provider.setResponseCallback(callback_guid_2, response_callback_2)
        });
        test('getResponseCallback', () => {
            expect(new_provider.setResponseCallback).toHaveBeenCalledTimes(2);

            const callback = new_provider.getResponseCallback(callback_guid)
            expect(callback).toBe(response_callback);

            const other_callback = new_provider.getResponseCallback(callback_guid_2)
            expect(other_callback).toBe(response_callback_2);
        });
        test('removeResponseCallback', () => {
            /* need to test with multiple response callbacks */
            new_provider.removeResponseCallback(callback_guid);
            expect(new_provider.getResponseCallback(callback_guid)).toEqual(undefined);
            expect(new_provider.getResponseCallback(callback_guid_2)).toBe(response_callback_2);
            expect(new_provider.listResponseCallbacks()).toHaveProperty(callback_guid_2)
            expect(new_provider.listResponseCallbacks()).not.toHaveProperty(callback_guid)
        });
        test('listResponseCallbacks', () => {
            expect(Object.keys(new_provider.listResponseCallbacks())).toHaveLength(2);
        });
    });
});