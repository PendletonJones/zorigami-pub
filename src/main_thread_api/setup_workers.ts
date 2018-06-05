import { Map }                                        from 'immutable';
import { construct_worker_to_worker_message_channel } from 'main_thread_api/setup_tasks/construct_worker_to_worker_message_channel';
import { tell_workers_to_exchange_api }               from 'main_thread_api/setup_tasks/tell_workers_to_exchange_api';
import worker_instance_provider                       from 'main_thread_api/provide_worker_instance';
import name_provider                                  from 'shared/provide_name';
import api_config_provider                            from 'shared/provide_api_config';
import { WorkerList }                                 from 'zorigami_types';
import { ApiConfiguration }                           from 'zorigami_types';
import { ResponseFunction }                           from 'zorigami_types';
import create_workers                                 from 'main_thread_api/setup_tasks/create_workers';
import expose_main_to_workers                         from 'main_thread_api/setup_tasks/expose_main_to_workers';
import {
    ACK,
    MAIN_THREAD_NAME,
    REDIRECT_URL,
    FLUSH_DATA,
    DESTROY_WORKER,
    LIST_CONNECTIONS,
    LOAD_SCRIPT,
} from 'worker_constants';
import {
    IWorkerSet,
} from 'zorigami_types';

const main_thread_api_config: ApiConfiguration = Map({
    [REDIRECT_URL]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    },
    [FLUSH_DATA]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    },
    [DESTROY_WORKER]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    }
});

function test_workers(workers: Array<IWorkerSet>) {
    workers.forEach(async (worker) => {
        console.log(worker.worker_name);
        const worker_interface = worker_instance_provider.getWorkerInterface(worker.worker_name);
        if(worker_interface){
            console.log('worker_interface', worker_interface);
            const res = await worker_interface.postMessage({
                type: LIST_CONNECTIONS,
            }, []);
            console.log(res, worker.worker_name);
        };
    });
};

export default async function create_worker_network(worker_list: WorkerList){
    /* first, setup and store information about the main thread. */
    /* what is the main thread named? (get used when sending messages) */
    name_provider.setWorkerName(MAIN_THREAD_NAME);
    /* store the main thread API configuration, these are events that the main
    thread will respond to when receiving messages from the workers */
    api_config_provider.storeApiConfig(main_thread_api_config);
    /* second, create the workers from the list, returns an array of workers*/
    const workers = create_workers(worker_list);
    await expose_main_to_workers(workers);
    const already_mapped_workers = [];
    for (const new_worker_set of workers){
        /* construct a 'loopback' message port on the worker. */
        // await construct_worker_to_worker_message_channel(new_worker_set, new_worker_set);
        for (const existing_worker_set of already_mapped_workers){
            /* sets up a port between the workers */
            await construct_worker_to_worker_message_channel(existing_worker_set, new_worker_set);
            /* once the ports are established, tell the workers to use that port to exchange APIs */
            await tell_workers_to_exchange_api(existing_worker_set, new_worker_set);
            // console.log('tell_workers_to_exchange_api done');
        }
        already_mapped_workers.push(new_worker_set);
    }
    console.log('already_mapped_workers', already_mapped_workers);
    test_workers(already_mapped_workers);
};