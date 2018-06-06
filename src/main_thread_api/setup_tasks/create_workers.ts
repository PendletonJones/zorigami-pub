import worker_instance_provider from '../../main_thread_api/provide_worker_instance';
import { dispatch_message_from_worker } from '../../main_thread_api/dispatch_message_from_worker';
import {
	IWorkerSet,
	WorkerList
} from '../../zorigami_types';

export default function create_workers (worker_list: WorkerList): Array<IWorkerSet> {
    const all_workers = worker_list.map(({WorkerConstructor, worker_name}) => {
        /* create the worker */
        const new_worker_instance = new WorkerConstructor();
        /* this should setup the worker to listen to the main worker
        with it's default api, and setup it's custom API */
        const new_worker_instance_name = worker_name;
        /* start listening to messages from the worker  */
        new_worker_instance.onmessage = dispatch_message_from_worker;
        /* store the worker instance in our class */
        worker_instance_provider.storeWorker(new_worker_instance_name, new_worker_instance);
        worker_instance_provider.storeWorkerInterface(new_worker_instance_name, new_worker_instance);
        /* exhange main apis with the new worker. */
        const new_worker_set: IWorkerSet = {
            worker: new_worker_instance,
            worker_name: new_worker_instance_name,
        };
        return new_worker_set;
    });
    console.log('all_workers', all_workers);
    return all_workers;
};