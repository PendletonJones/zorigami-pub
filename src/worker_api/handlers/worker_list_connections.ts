import worker_port_provider                        from 'worker_api/provide_sibling_ports';
import { ResponseFunction, isPromisedPostMessage } from 'zorigami_types';
import worker_name_provider                        from 'shared/provide_name';
// import {
//     LOGGER_WORKER,
// } from 'workers/constants/worker_names';
// import {
//     WARN,
// } from 'workers/logger_worker/logger_worker_constants';

const LOGGER_WORKER        : 'worker_names/LOGGER_WORKER'         = 'worker_names/LOGGER_WORKER';
// export const LOG   = 'worker_constants/logger_worker/LOG';
// export type LOG    = typeof LOG;
export const WARN  = 'worker_constants/logger_worker/WARN';
export type WARN   = typeof WARN;
// export const ERROR = 'worker_constants/logger_worker/ERROR';
// export type ERROR  = typeof ERROR;
/* had problems with the import here, don't want to install the worker from another worker.. */

export default async function worker_list_connections (event: MessageEvent, respond: ResponseFunction) {
	console.log(event, respond, 'worker_list_connections');
	const warn = worker_port_provider.getPortAPI(LOGGER_WORKER, WARN);
	if(isPromisedPostMessage(warn)){
		warn({message: 'logging worker_list_connections'});		
	}else{
		console.warn(warn, worker_port_provider.listPortInterface().toJS(), worker_name_provider.getWorkerName());
		// throw new Error(`warn function not found in ${worker_name_provider.getWorkerName()}`);
	}
    return respond({
        message: worker_port_provider.listPortInterface().keySeq().toList().toJS(), 
        interfaces: worker_port_provider.listPortAPI().keySeq().toList().toJS()
    });
};