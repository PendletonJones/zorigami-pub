import worker_port_provider from '../../worker_api/provide_sibling_ports';
import dispatch_message from '../../worker_api/dispatch_message';
import { ACK } from '../../worker_constants';
import { ResponseFunction } from '../../zorigami_types';

export default function worker_setup_channel_to_sibling_worker(event: {data: any, ports: Array<MessagePort>}, respond: ResponseFunction): undefined {
    const port_to_worker: MessagePort = event.ports[0];
    const target_worker_name = event.data.target_worker_name;
    worker_port_provider.storePort(target_worker_name, port_to_worker);
    worker_port_provider.storePortInterface(target_worker_name, port_to_worker);
    port_to_worker.onmessage = dispatch_message;
    respond(ACK);
    return;
};