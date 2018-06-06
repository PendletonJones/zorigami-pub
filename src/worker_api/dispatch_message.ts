import sibling_worker_port_provider            from '../worker_api/provide_sibling_ports';
import name_provider                           from '../shared/provide_name';
import worker_accept_and_trade_api_with_main   from '../worker_api/handlers/worker_accept_and_trade_api_with_main';
import worker_expose_worker_api                from '../worker_api/handlers/worker_expose_worker_api';
import worker_setup_channel                    from '../worker_api/handlers/worker_setup_channel';
import worker_expose_own_api_to_sibling_worker from '../worker_api/handlers/worker_expose_own_api_to_sibling_worker';
import worker_response_message                 from '../worker_api/handlers/worker_response_message';
import worker_reject_message                   from '../worker_api/handlers/worker_reject_message';
import worker_list_connections                 from '../worker_api/handlers/worker_list_connections';
import api_config_provider                     from '../shared/provide_api_config';
import { ApiConfigProvider }                   from '../shared/provide_api_config';
import {
    ResponseFunction,
    DispatchHandler,
    ICustomWorkerPort,
    isCustomPort,
    Maybe,
    ApiConfiguration,
}   from '../zorigami_types';

import {
    EXPOSE_WORKER_API,
    SETUP_CHANNEL,
    RESPONSE_MESSAGE,
    TRIGGER_EXPOSE_WORKER_API,
    EXPOSE_MAIN_API,
    REJECT_MESSAGE,
    LIST_CONNECTIONS,
    LOAD_SCRIPT,
} from '../worker_constants';

const default_handler: DispatchHandler = (event: MessageEvent, respond: ResponseFunction) => {
    console.warn('default_handler: throwing error', event.data, name_provider.getWorkerName());
    throw new Error(JSON.stringify(event));
};

const generic_worker_api: ApiConfiguration = {};

export default function dispatchMessage(event: MessageEvent){
	const worker_name: string = event.data.worker_name || 'Error: worker name not found';
    const response_provider: Maybe<ICustomWorkerPort> = sibling_worker_port_provider.getPortInterface(worker_name);
    if(isCustomPort(response_provider)){
        // console.log('found response_provider', event);
        const respond: ResponseFunction = response_provider.createResponse(event);
        const built_in_handler = generic_worker_api[event.data.type];

        try{
            if(built_in_handler){
                console.log('calling built_in_handler for ', event.data)
                built_in_handler(event, respond);
            }else{
                console.log('dispatching custom worker registered event', event.data);
                api_config_provider[event.data.type](event, respond);
            }
        }catch (error){
            console.warn('dispatchMessage failed with error', error);
            /* re-throw the error */
            throw error;
        }
        /*
            this throws in the new version because the response function
            is undefined. normally the 'worker_accept_and_trade_api_with_main'
            method would just ignore the undefined response function but
            in the TS version it just never gets called
        */
    }else{
        const respond: ResponseFunction = () => undefined;
        try {
            generic_worker_api[event.data.type](event, respond)
        } catch (inner_error){
            console.log(inner_error);
            throw new Error(`${
                JSON.stringify(name_provider.getWorkerName())} ICustomWorkerPort
                for worker_name: ${JSON.stringify(event.data.worker_name)} not found
                ${JSON.stringify(event.data)}
                ${JSON.stringify(inner_error)}
            `);
        }
    }
}