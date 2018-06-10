import create_worker_interface from '../../main_thread_api/create_worker_interface_main';
import {
    PromisedPostMessage,
    Maybe,
    ICustomWorkerPort,
    Transferable,
    isCustomPort,
    Dictionary,
    isWorker
} from '../../zorigami_types';

export class WorkerInterfaceProvider {
    private worker_interfaces: Dictionary<ICustomWorkerPort>;

    constructor(){
        this.worker_interfaces = {};
    }

    public storeWorkerInterface = (worker_name: string, worker_instance: Worker): undefined => {
        const worker_interface: ICustomWorkerPort = create_worker_interface(worker_name, worker_instance);
        this.worker_interfaces[worker_name] = worker_interface;
        return;
    }

    public getWorkerInterface = (worker_name: string): Maybe<ICustomWorkerPort> => {
        return this.worker_interfaces[worker_name];
    }
}