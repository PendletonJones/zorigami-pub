import provider, { WorkerNameProvider } from '../provide_name';

describe('built in name provider works', () => {
    const WORKER_NAME = 'test-worker-name';
    beforeAll(() => {
        jest.spyOn(provider, 'getWorkerName');
        jest.spyOn(provider, 'setWorkerName');
    });
    test('provider is an instance of WorkerNameProvider', () => {
        expect(provider).toBeInstanceOf(WorkerNameProvider);
    });
    test('sets and gets name correctly', () => {
        provider.setWorkerName(WORKER_NAME);
        expect(provider.getWorkerName()).toEqual(WORKER_NAME);
        expect(provider.getWorkerName).toHaveBeenCalledTimes(1);
        expect(provider.setWorkerName).toHaveBeenCalledTimes(1);
    });
});

describe('creates a provider that works', () => {
    const WORKER_NAME = 'test-worker-name';
    test('creates a name provider correctly', () => {
        let new_provider = new WorkerNameProvider();
        jest.spyOn(new_provider, 'getWorkerName');
        jest.spyOn(new_provider, 'setWorkerName');
        expect(new_provider).toBeInstanceOf(WorkerNameProvider);
        expect(new_provider.getWorkerName).toHaveBeenCalledTimes(0);
        new_provider.setWorkerName(WORKER_NAME);
        // expect(new_provider).toMatchObject(provider);
        expect(new_provider.getWorkerName()).toEqual(WORKER_NAME);
        expect(new_provider.getWorkerName).toHaveBeenCalledTimes(1);
        expect(new_provider.setWorkerName).toHaveBeenCalledTimes(1);
    });
});