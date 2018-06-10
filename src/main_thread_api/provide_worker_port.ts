
import {
    PromisedPostMessage,
    Maybe,
    ICustomWorkerPort,
    Transferable,
    isCustomPort,
    Dictionary,
    isWorker
} from '../zorigami_types';

export class WorkerPortProvider {

    private worker_ports: Dictionary<MessagePort>;
    constructor() {
        this.worker_ports = {};
    }
    public getWorkerPort = (worker_name: string): Maybe<MessagePort> => {
        return this.worker_ports[worker_name];
    }

    public storeWorkerPort = (worker_name: string, worker_port: MessagePort): undefined => {
        this.worker_ports[worker_name] = worker_port;
        return;
    }

    public removeWorkerPort = (worker_name: string): void => {
        delete this.worker_ports[worker_name];
    }

    public listWorkerPorts = (): Dictionary<MessagePort> => {
        return this.worker_ports;
    }
}