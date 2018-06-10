import worker_port_provider                        from '../../worker_api/provide_sibling_ports';
import { ResponseFunction, isPromisedPostMessage } from '../../zorigami_types';
import worker_name_provider                        from '../../shared/provide_name';


const LOGGER_WORKER        : 'worker_names/LOGGER_WORKER'         = 'worker_names/LOGGER_WORKER';
export const WARN  = 'worker_constants/logger_worker/WARN';
export type WARN   = typeof WARN;

export default async function worker_list_connections (event: MessageEvent, respond: ResponseFunction) {
	const warn = worker_port_provider.getPortAPI(LOGGER_WORKER, WARN);
	if(isPromisedPostMessage(warn)){
		warn({message: 'logging worker_list_connections'});
	}
    return respond({
		message: Object.keys(worker_port_provider.listPortInterface()),
		interfaces: Object.keys(worker_port_provider.listPortAPI()),
    });
};