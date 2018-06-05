import worker_port_provider from 'worker_api/provide_sibling_ports';
import worker_api_provider from 'shared/provide_api_config';
import { ICustomWorkerPort, Maybe } from 'zorigami_types';
import {
    EXPOSE_WORKER_API,
    LIST_CONNECTIONS,
    ACK,
} from 'worker_constants';

const own_api_config = [EXPOSE_WORKER_API, LIST_CONNECTIONS];

function isCustomPort(potential_port: Maybe<ICustomWorkerPort>): potential_port is ICustomWorkerPort {
    return potential_port !== undefined;
}

export default async function worker_expose_own_api_to_sibling_worker(
    event: {data: any},
    respond: (message: any) => void
){
    console.warn('worker_expose_own_api_to_sibling_worker');
    const {target_worker_name} = event.data;
    const response_port = worker_port_provider.getPortInterface(target_worker_name);
    if(isCustomPort(response_port)){
        console.warn('isCustomPort worker_expose_own_api_to_sibling_worker', response_port);        
        response_port.postMessage({
            type: EXPOSE_WORKER_API,
            api_config: [...worker_api_provider.listApiConfig(), ...own_api_config],
        });
    }else{
        console.log(event, respond);
        console.warn('worker_port_provider.listPortInterface()', worker_port_provider.listPortInterface().toJS());
        throw new Error('worker port not found');
    }
    /*
        the initial message comes from main, so here we are responding
        to the message from the main thread, acknowledging that the
        worker has successfully exposed its api to the sibling thread.
    */
    respond(ACK);
};