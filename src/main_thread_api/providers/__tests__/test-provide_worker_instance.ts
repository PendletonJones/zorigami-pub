import 'jsdom-worker';
import provide_worker_instance, { WorkerInstanceProvider } from '../provide_worker_instance';
/*
    getWorkerPort
    storeWorkerPort
    getPortInterface
    storePortInterface
    storeWorkerPortAPI
    getWorkerPortAPI
    storeWorker
    terminateWorker
    storeWorkerInterface
    getWorkerInterface
    storeWorkerApi
    getWorkerApi
*/

const worker_code = `onmessage = e => postMessage(e.data)`;
const worker_file = URL.createObjectURL(new Blob([worker_code]));

describe('existing provider', () => {
    test('provide_worker_instance is instance of WorkerInstanceProvider', () => {
        expect(provide_worker_instance).toBeInstanceOf(WorkerInstanceProvider);
    });
});

describe('new worker instance provider should do provider things', () => {
    const new_provider = new WorkerInstanceProvider();
    const worker = new Worker(worker_file);
    beforeAll(() => {
        
    });
    test('created provider', () => {
        expect(new_provider).toBeInstanceOf(WorkerInstanceProvider);
    });
    test('store Worker', () => {
        
    });
    test('terminate Worker', () => {
        
    });
});