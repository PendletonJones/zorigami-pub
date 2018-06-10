import { construct_worker_to_worker_message_channel } from '../main_thread_api/setup_tasks/construct_worker_to_worker_message_channel';
import { tell_workers_to_exchange_api }               from '../main_thread_api/setup_tasks/tell_workers_to_exchange_api';
import worker_instance_provider                       from '../main_thread_api/providers/provide_worker_instance';
import name_provider                                  from '../shared/provide_name';
import api_config_provider                            from '../shared/provide_api_config';
import create_workers                                 from '../main_thread_api/setup_tasks/create_workers';
import expose_main_to_workers                         from '../main_thread_api/setup_tasks/expose_main_to_workers';
import { main_thread_api_config }                     from './main_thread_api_config';
import {
    ACK,
    MAIN_THREAD_NAME,
    REDIRECT_URL,
    FLUSH_DATA,
    DESTROY_WORKER,
    LIST_CONNECTIONS,
    LOAD_SCRIPT,
} from '../worker_constants';
import {
    WorkerList,
    IWorkerSet,
    ApiConfiguration,
    ResponseFunction
} from '../zorigami_types';


function configure_main_thread(){
    /* first, setup and store information about the main thread. */
    /* what is the main thread named? (get used when sending messages) */
    name_provider.setWorkerName(MAIN_THREAD_NAME);
    /* store the main thread API configuration, these are events that the main
    thread will respond to when receiving messages from the workers */
    api_config_provider.storeApiConfig(main_thread_api_config);
}

async function construct_worker_network(workers: Array<IWorkerSet>){
    const already_mapped_workers = [];
    for (const new_worker_set of workers) {
        for (const existing_worker_set of already_mapped_workers) {
            /* sets up a message channel between the workers */
            await construct_worker_to_worker_message_channel(existing_worker_set, new_worker_set);
            /* once the message channels are established, tell the workers to use those channels to exchange APIs */
            await tell_workers_to_exchange_api(existing_worker_set, new_worker_set);
        }
        already_mapped_workers.push(new_worker_set);
    }
}

async function create_worker_network(worker_list: WorkerList){
    const workers = create_workers(worker_list);
    await expose_main_to_workers(workers);
    await construct_worker_network(workers);
}

export default async function setup_workers(worker_list: WorkerList){
    configure_main_thread();
    create_worker_network(worker_list);
};