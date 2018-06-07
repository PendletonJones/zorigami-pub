import setup_workers, { main_thread_api_config } from '../setup_workers';

describe('suite', () => {
    test('should fail', () => {
        expect(1 + 1).toEqual(1);
    });
});

function test_workers(workers: Array<IWorkerSet>) {
    workers.forEach(async (worker) => {
        console.log(worker.worker_name);
        const worker_interface = worker_instance_provider.getWorkerInterface(worker.worker_name);
        if (worker_interface) {
            console.log('worker_interface', worker_interface);
            const res = await worker_interface.postMessage({
                type: LIST_CONNECTIONS,
            }, []);
            console.log(res, worker.worker_name);
        };
    });
};