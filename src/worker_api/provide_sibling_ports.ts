// import uuid from 'utility/uuid';
import { Map, List }           from 'immutable';
import dispatch_message        from 'worker_api/dispatch_message';
import create_worker_interface from 'worker_api/create_worker_interface_worker';
import worker_name_provider    from 'shared/provide_name';
import WorkerSocketProvider    from 'worker_api/worker_socket_provider';
import {
	ICustomWorkerPort,
	Maybe,
	PromisedPostMessage,
	Transferable,
	isCustomPort,
}  from 'zorigami_types';
const socket = new WorkerSocketProvider()

export class WorkerSiblingPortProvider {
	/*
		this is a class that should be used as a singleton
		to provide stored api configurations for any function
		in the context (main thread or worker thread)
	*/
	private sibling_worker_ports: Map<string, MessagePort>;
	private sibling_worker_interfaces: Map<string, ICustomWorkerPort>;
	private sibling_worker_api: Map<string, Map<string, PromisedPostMessage>>;
	// private main_interface: any;
	// private main_api: any;

	constructor(){
		this.sibling_worker_ports = Map();
		this.sibling_worker_interfaces = Map();
		this.sibling_worker_api = Map();

		// this.main_interface = undefined;
		// this.main_api = undefined;
	}

	public storePort = (sibling_worker_name: string, port: MessagePort): undefined => {
		this.sibling_worker_ports = this.sibling_worker_ports.set(sibling_worker_name, port);
		socket.workerUpdateSocketPorts(this.sibling_worker_ports);
		return;
	}

	public getPort = (worker_name: string): Maybe<MessagePort> => {
		return this.sibling_worker_ports.get(worker_name, undefined);
	};

	public listPorts = (): Map<string, MessagePort> => {
	    return this.sibling_worker_ports;
	};

	public storePortInterface = (sibling_worker_name: string, port: MessagePort): undefined => {
		port.onmessage = dispatch_message;
		const sibling_worker_interface = create_worker_interface(sibling_worker_name, port);
	    this.sibling_worker_interfaces = this.sibling_worker_interfaces.set(sibling_worker_name, sibling_worker_interface);
	    console.warn('this.sibling_worker_interfaces.toJS()', this.sibling_worker_interfaces.toJS());
		socket.workerUpdateSocketPortInterfaces(this.sibling_worker_interfaces);
	    return;
	};

	public getPortInterface = (sibling_worker_name: string): Maybe<ICustomWorkerPort> => {
		return this.sibling_worker_interfaces.get(sibling_worker_name, undefined);
	}

	public listPortInterface = (): Map<string, ICustomWorkerPort> => {
		return this.sibling_worker_interfaces;
	}

	public storePortAPI = (worker_name: string, worker_api_config: Array<string>) => {
		const new_worker_port_api = List(worker_api_config).reduce((acc: Map<string, PromisedPostMessage>, action_type: string) => {
			const promised_api_caller = this.makePortApiCall(worker_name, action_type);
	        return acc.set(action_type, promised_api_caller);
	    }, Map());
	    this.sibling_worker_api = this.sibling_worker_api.set(worker_name, new_worker_port_api);
	    console.warn('storeWorkerApi', this.sibling_worker_api);
	    socket.workerUpdateSocketPortAPIS(this.sibling_worker_api);
	    return;
	}

	public getPortAPI = (thread_name: string, action_name: string): Maybe<PromisedPostMessage> => {
		const worker_name = worker_name_provider.getWorkerName();
		console.log('getPortInterface', worker_name, thread_name, action_name, this.sibling_worker_api.get(thread_name, Map()).toJS());
		return this.sibling_worker_api.getIn([thread_name, action_name]);
	}

	public listPortAPI = (): Map<string, Map<string, PromisedPostMessage>> => {
		return this.sibling_worker_api;
	}

	private makePortApiCall = (worker_name: string, action_type: string): PromisedPostMessage => {
		const return_func: PromisedPostMessage = (message: any, transferables?: Array<Transferable>) => {
			/* grab the worker port, or the worker itself and post a message to it */
			const worker_port: Maybe<ICustomWorkerPort> = this.getPortInterface(worker_name)
			if(isCustomPort(worker_port)){
				return worker_port.postMessage({
				    type: action_type,
				    ...message,
				}, transferables);
			}else{
				throw new Error(`Custom Port Not found for ${{worker_name, action_type}}`)
			}
		}
		return return_func;
	}
};

const provider: WorkerSiblingPortProvider = new WorkerSiblingPortProvider();

export default provider;
