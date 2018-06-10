import sibling_port_provider     from '../../worker_api/provide_sibling_ports';
import worker_name_provider      from '../../shared/provide_name';
import api_config_provider       from '../../shared/provide_api_config';
import {
    MAIN_THREAD_NAME,
    EXPOSE_WORKER_API,
    LIST_CONNECTIONS,
    TRIGGER_EXPOSE_WORKER_API,
    ACK,
} from '../../worker_constants';
import { ICustomWorkerPort, isPromisedPostMessage } from '../../zorigami_types';

const required_default_api_config = [
    EXPOSE_WORKER_API,
    LIST_CONNECTIONS,
    TRIGGER_EXPOSE_WORKER_API
];

function isCustomPort(potential_port: ICustomWorkerPort | undefined): potential_port is ICustomWorkerPort {
    return potential_port !== undefined;
}

/* also recieves a response function but doesn't use it */
export default async function worker_accept_and_trade_api_with_main_thread (event: MessageEvent) {
    const { api_config } = event.data;
    /* main thread retains one port from the channel */
    const main_thread_port: MessagePort = event.ports[0];
    main_thread_port.onmessage = (main_thread_onmessage_to_port_event: MessageEvent) => {
        console.warn('onmessage to port', main_thread_onmessage_to_port_event);
    }
    worker_name_provider.setWorkerName(event.data.worker_name);
    sibling_port_provider.storePort(MAIN_THREAD_NAME, main_thread_port);
    sibling_port_provider.storePortInterface(MAIN_THREAD_NAME, main_thread_port);
    sibling_port_provider.storePortAPI(MAIN_THREAD_NAME, api_config);
    /* now that we have stored the main thread's exposed api, show the worker API to main thread*/
    /* in an alternative implementation, the configuration is a single object that
    details the entry points for worker handler functiosn and dynamically imports
    them here. in thst case the main thread would already know about the worker adpi
    and this would be unnecessary */
    const expose_worker_interface = sibling_port_provider.getPortAPI(MAIN_THREAD_NAME, EXPOSE_WORKER_API)
    if(isPromisedPostMessage(expose_worker_interface)){
        expose_worker_interface({
            api_config: [
                ...api_config_provider.listApiConfigMethods(),
                ...required_default_api_config
            ],
        });
    }
    const response_port = sibling_port_provider.getPortInterface(MAIN_THREAD_NAME);
    if(isCustomPort(response_port)){
        const respond = response_port.createResponse(event);
        respond(ACK);
    }else{
        throw new Error('MAIN_THREAD port not found in worker setup');
    }
};