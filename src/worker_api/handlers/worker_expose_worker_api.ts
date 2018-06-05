import sibling_port_provider from 'worker_api/provide_sibling_ports';
import { ResponseFunction } from 'zorigami_types';

export default function worker_expose_worker_api(event: MessageEvent, respond: ResponseFunction): undefined {
    const worker_name = event.data.worker_name;
    const api_config = event.data.api_config;
    sibling_port_provider.storePortAPI(worker_name, api_config);
    respond({message: 'successfully stored the worker api'});
    return;
};