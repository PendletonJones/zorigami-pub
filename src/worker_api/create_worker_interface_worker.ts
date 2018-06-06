import uuid from '../utility/uuid';
import response_callback_provider from '../shared/provide_response_callbacks';
import { Transferable, ICustomWorkerPort } from '../zorigami_types';
import { RESPONSE_MESSAGE, TIMEOUT } from '../worker_constants';
import worker_name_provider from '../shared/provide_name';

const generate_post_response = (port: MessagePort) => (event: MessageEvent) => (message: any) => port.postMessage({
    ...message,
    type: RESPONSE_MESSAGE,
    worker_name: worker_name_provider.getWorkerName(),
    callback_guid: event.data.callback_guid,
});

export default function create_worker_interface_worker (sibling_worker_name: string, port: MessagePort): ICustomWorkerPort {
	console.warn('createsiblingworkerinterface', port, typeof port);
	const sibling_worker_interface: ICustomWorkerPort = {
	    postMessage: async (message: any, transferables?: Array<Transferable>): Promise<MessageEvent> => {
	    	/* use this function when initiating requests to other workers */
	        const callback_guid = uuid();
	        return new Promise<MessageEvent>((resolve, reject) => {
	            /* cancel after 35 seconds */
	            const timeout_id: number = self.setTimeout(() => {
	            	throw new Error(`the operation timed out 'sibling worker name':${sibling_worker_name} 'origin worker name':${worker_name_provider.getWorkerName()} ${callback_guid} ${JSON.stringify(message)}`);
	            }, TIMEOUT);
	            const response_callback = (response_message: MessageEvent) => {
	                /* or clear the timeout and resolve */
	                self.clearTimeout(timeout_id);
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