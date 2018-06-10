import uuid from '../utility/uuid';
import { RESPONSE_MESSAGE, TIMEOUT } from '../worker_constants';
import worker_name_provider from '../shared/provide_name';
import response_callback_provider from '../shared/provide_response_callbacks';
import { Transferable, ICustomWorkerPort } from '../zorigami_types';

type WorkerOrPort = Worker | MessagePort;

const generate_post_response = (port: WorkerOrPort) => (event: MessageEvent) => (message: any) => port.postMessage({
    ...message,
    type: RESPONSE_MESSAGE,
    worker_name: worker_name_provider.getWorkerName(),
    callback_guid: event.data.callback_guid,
});

const context = (self || window);

const createSiblingWorkerInterface = (worker_name: string, port: WorkerOrPort): ICustomWorkerPort => {
	console.warn(port, typeof port)
	const sibling_worker_interface: ICustomWorkerPort = {
	    postMessage: async (message: any, transferables?: Array<Transferable>): Promise<MessageEvent> => {
	    	/* use this function when initiating requests to other workers */
	        const callback_guid = uuid();
	        return new Promise<MessageEvent>((resolve, reject) => {
	            /* cancel after 35 seconds */
	            const timeout_id: number = context.setTimeout(() => {
	            	throw new Error(`the operation timed out 'worker name':${worker_name} 'origin worker name':${worker_name_provider.getWorkerName()} ${callback_guid} ${JSON.stringify(message)}`);
	            }, TIMEOUT);
	            const response_callback = (response_message: MessageEvent) => {
	                /* or clear the timeout and resolve */
	                context.clearTimeout(timeout_id);
	                resolve(response_message);
	            }
	            response_callback_provider.setResponseCallback(callback_guid, response_callback);
	            const worker_name = worker_name_provider.getWorkerName();
	            try {
	                port.postMessage({...message, callback_guid, worker_name}, transferables);
	            } catch (err) {
	            	// throw new Error(`Something Went Wrong, ${JSON.stringify({...message, callback_guid, worker_name})}`);
	            	console.warn(JSON.stringify({...message, callback_guid, worker_name}));
	            }
	        });
	    },
	    createResponse: generate_post_response(port),
	};
	return sibling_worker_interface;
}

export default createSiblingWorkerInterface;