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


/* WARNING: This is not used currently */
// DispatchHandler
function default_handler (event: MessageEvent, respond: ResponseFunction): void {
    console.warn();
    throw new Error(`default_handler in ${name_provider.getWorkerName()}: ${JSON.stringify(event.data)}`);
};

const generic_worker_api: ApiConfiguration = {};

export default function dispatchMessage(event: MessageEvent){
	const worker_name: string = event.data.worker_name || 'Error: worker name not found';
    const response_provider: Maybe<ICustomWorkerPort> = sibling_worker_port_provider.getPortInterface(worker_name);
    if(isCustomPort(response_provider)){
        const respond: ResponseFunction = response_provider.createResponse(event);
        const built_in_handler = generic_worker_api[event.data.type];
        try{
            if(built_in_handler){
                built_in_handler(event, respond);
            }else{
                api_config_provider[event.data.type](event, respond);
            }
        }catch (error){
            console.warn('dispatchMessage failed with error', error);
            /* re-throw the error */
            throw error;
        }
    }else{
        const respond: ResponseFunction = () => undefined;
        try {
            generic_worker_api[event.data.type](event, respond)
        } catch (inner_error){
            throw new Error(`${
                JSON.stringify(name_provider.getWorkerName())} ICustomWorkerPort
                for worker_name: ${JSON.stringify(event.data.worker_name)} not found
                ${JSON.stringify(event.data)}
                ${JSON.stringify(inner_error)}
            `);
        }
    }
}