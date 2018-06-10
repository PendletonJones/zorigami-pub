import { RESPONSE_MESSAGE, EXPOSE_WORKER_API } from '../worker_constants';
import provide_worker_instance from '../main_thread_api/providers/provide_worker_instance';
import provide_response_callbacks from '../shared/provide_response_callbacks';
import { ResponseFunction, DispatchHandler, ApiConfiguration } from '../zorigami_types';

export const default_handler: DispatchHandler = (event: MessageEvent, respond: ResponseFunction) => {
    throw new Error(JSON.stringify(event));
};

export const default_main_sub_to_worker_api: ApiConfiguration = {
    [RESPONSE_MESSAGE]: (event: MessageEvent) => {
        provide_response_callbacks.getResponseCallback(event.data.callback_guid)(event);
        provide_response_callbacks.removeResponseCallback(event.data.callback_guid);
    },
    [EXPOSE_WORKER_API]: (event: MessageEvent) => {
        /* gets called when the worker is exposing it's api to the main thread */
        const worker_name = event.data.worker_name;
        const api_config = event.data.api_config;
        provide_worker_instance.storeWorkerApi(worker_name, api_config);
        provide_worker_instance.storeWorkerPortAPI(worker_name, api_config);
        /* override respond here because the worker name will not be stored
        yet when it is generated in dispatch_message_from_worker */
        const worker_interfaces = provide_worker_instance.getWorkerInterface(worker_name);
        if (worker_interfaces) {
            const respond = worker_interfaces.createResponse(event);
            respond({ event: 'done storing worker api on main thread' });
        } else {
            const message = 'could not find response function for ';
            throw new Error(`${message}::${worker_name}`)
        }
    }
};

export const dispatch_message_from_worker = (event: MessageEvent) => {
    const worker_name = event.data.worker_name;
     const worker_interfaces = provide_worker_instance.getWorkerInterface(worker_name)
     if(worker_interfaces){
        const respond = worker_interfaces.createResponse(event);
        (default_main_sub_to_worker_api[event.data.type] || default_handler)(event, respond);
     }
};