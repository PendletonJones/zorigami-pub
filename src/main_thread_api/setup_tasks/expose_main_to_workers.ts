import uuid from '../../utility/uuid';
import provide_response_callbacks from '../../shared/provide_response_callbacks';
import provide_worker_instance from '../../main_thread_api/provide_worker_instance';
import { dispatch_message_from_worker } from '../../main_thread_api/dispatch_message_from_worker';
import api_config_provider from '../../shared/provide_api_config';
import {
    RESPONSE_MESSAGE,
    EXPOSE_WORKER_API,
    EXPOSE_MAIN_API
} from '../../worker_constants';
import { IWorkerSet } from '../../zorigami_types';

export const expose_main_api_to_worker = async (
    message: any, 
    worker_name: string, 
    new_worker_instance: Worker,
    main_to_worker_channel: MessageChannel
) => {
    /* 
        nothing is setup, this is why we construct the callback manually.
        send the main api to the worker. 
    */
    const callback_guid: string = uuid();
    provide_worker_instance.storeWorkerPort(worker_name, main_to_worker_channel.port1);
    provide_worker_instance.storePortInterface(worker_name, main_to_worker_channel.port1);
    main_to_worker_channel.port1.onmessage = dispatch_message_from_worker;
    return new Promise((resolve, reject) => {
        provide_response_callbacks.setResponseCallback(callback_guid, (response_message: any, err?: any) => {
            err ? reject(err) : resolve(response_message);
        });
        new_worker_instance.postMessage({
            type: EXPOSE_MAIN_API,
            worker_name,
            callback_guid,
            ...message,
        }, [main_to_worker_channel.port2]);
    });
};

export default async function expose_main_to_workers (workers: Array<IWorkerSet>) {
    console.log(workers);
    const expose_result_list = [];
    for (const new_worker_set of workers){
        const {worker} = new_worker_set;
        const {worker_name} = new_worker_set;
        const main_to_worker_channel: MessageChannel = new MessageChannel();
        const expose_result = await expose_main_api_to_worker(
            {api_config: [EXPOSE_WORKER_API, RESPONSE_MESSAGE, ...api_config_provider.listApiConfigMethods()]},
            worker_name,
            worker,
            /* add a port here for use in the worker. */
            main_to_worker_channel,
        );
        expose_result_list.push(expose_result);
    }
    const result_list = await Promise.all(expose_result_list);
    console.log('result_list', result_list);
    return {result_list, workers};
};
