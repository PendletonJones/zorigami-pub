
import {
    PromisedPostMessage,
    Maybe,
    ICustomWorkerPort,
    Transferable,
    isCustomPort,
    Dictionary,
    isWorker
} from '../zorigami_types';

export class WorkerPortAPIPRovider {
    private worker_port_apis: Dictionary<Dictionary<PromisedPostMessage>>;

    constructor() {
        this.worker_port_apis = {};

    }
    public storeWorkerPortAPI = (worker_name: string, worker_api_config: Array<string>) => {
        /* need to convert to non-immutable javascript */
        const new_worker_port_api = worker_api_config.reduce((acc: Dictionary<PromisedPostMessage>, action_type: string) => {
            const promised_api_caller = this.makePortApiCall(worker_name, action_type);
            acc[action_type] = promised_api_caller;
            return acc;
        }, {});
        this.worker_port_apis[worker_name] = new_worker_port_api;
        return;
    }
    public getWorkerPortAPI = (worker_name: string, action_name: string) => {
        /* returns a function that can be used to make an API call */
        // return this.worker_port_apis.getIn([worker_name, action_name]);
        return this.worker_port_apis[worker_name][action_name];
    }

    private makePortApiCall = (worker_name: string, action_type: string): PromisedPostMessage => {
        const return_func: PromisedPostMessage = (message: any, transferables?: Array<Transferable>) => {
            /* grab the worker port, or the worker itself and post a message to it */
            const worker_port: Maybe<ICustomWorkerPort> = this.getPortInterface(worker_name)
            if (isCustomPort(worker_port)) {
                return worker_port.postMessage({
                    type: action_type,
                    ...message,
                }, transferables);
            } else {
                console.warn('this.worker_port_interfaces', this.worker_port_interfaces);
                throw new Error(`makePortApiCall Inside ${worker_name_provider.getWorkerName()}, Custom Port Not found for ${action_type}, ${worker_name}`);
            }
        }
        return return_func;
    }
}