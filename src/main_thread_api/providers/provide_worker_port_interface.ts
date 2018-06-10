
import {
    PromisedPostMessage,
    Maybe,
    ICustomWorkerPort,
    Transferable,
    isCustomPort,
    Dictionary,
    isWorker
} from '../../zorigami_types';

export class WorkerPortInterfaceProvider {
    private worker_port_interfaces: Dictionary<ICustomWorkerPort>;

    constructor(){
        this.worker_port_interfaces = {};
    }

    public getPortInterface = (worker_name: string): Maybe<ICustomWorkerPort> => {
        /* should return the postMessage, createResponse stuff */
        return this.worker_port_interfaces[worker_name];
    }

    public storePortInterface = (worker_name: string, worker_port: MessagePort) => {
        const worker_interface: ICustomWorkerPort = create_worker_interface(worker_name, worker_port);
        this.worker_port_interfaces[worker_name] = worker_interface;
    }

}