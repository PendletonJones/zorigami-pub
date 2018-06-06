import create_worker_interface from 'main_thread_api/create_worker_interface_main';
import worker_name_provider from 'shared/provide_name';
import MainSocketProvider from 'main_thread_api/main_socket_provider';
import {
	PromisedPostMessage,
	Maybe,
	ICustomWorkerPort,
	Transferable,
	isCustomPort,
	Dictionary
} from 'zorigami_types';

/* move this to the constructor */
const socket = new MainSocketProvider();

export class WorkerInstanceProvider {
	/*
		this needs to be disambiguated.
		- make sure you can fetch three things
			* the port,
			* the interface PromisedPostMessage for each action
			* the worker instance itself
	*/
	private worker_instances: Dictionary<Worker>;
	private worker_interfaces: Dictionary<ICustomWorkerPort>;
	private worker_apis: Dictionary<Dictionary<PromisedPostMessage>>;
	private worker_ports: Dictionary<MessagePort>;
	private worker_port_interfaces: Dictionary<ICustomWorkerPort>;
	private worker_port_apis: Dictionary<Dictionary<PromisedPostMessage>>;


	constructor(){
		this.worker_instances = {};
		this.worker_interfaces = {};
		this.worker_apis = {};

		this.worker_ports = {};
		this.worker_port_interfaces = {};
		this.worker_port_apis = {};

		/* what is going on here? */
		const monitorState = socket.createStateMonitor(() => ({
			worker_instances: this.worker_instances,
			worker_interfaces: this.worker_interfaces,
			worker_apis: this.worker_apis,
			worker_ports: this.worker_ports,
			worker_port_interfaces: this.worker_port_interfaces,
			worker_port_apis: this.worker_port_apis,
		}));

		this.storeWorkerPort = monitorState(this.storeWorkerPort);
		this.storePortInterface = monitorState(this.storePortInterface);
		this.storeWorkerPortAPI = monitorState(this.storeWorkerPortAPI);

		this.storeWorker = monitorState(this.storeWorker);
		this.storeWorkerInterface = monitorState(this.storeWorkerInterface);
		this.storeWorkerApi = monitorState(this.storeWorkerApi);
	}

	public getWorkerPort = (worker_name: string): Maybe<MessagePort> => {
		return this.worker_ports[worker_name];
	}

	public storeWorkerPort = (worker_name: string, worker_port: MessagePort): undefined => {
		// this.worker_ports = this.worker_ports.set(worker_name, worker_port);
		this.worker_ports[worker_name] = worker_port;
		return;
	}

	public getPortInterface = (worker_name: string): Maybe<ICustomWorkerPort> =>  {
		/* should return the postMessage, createResponse stuff */
		return this.worker_port_interfaces[worker_name];
	}
	public storePortInterface = (worker_name: string, worker_port: MessagePort) => {
		const worker_interface: ICustomWorkerPort = create_worker_interface(worker_name, worker_port);
		this.worker_port_interfaces[worker_name] = worker_interface;
		socket.mainUpdateSocketPortInterfaces({
			action: 'mainUpdateSocketPortInterfaces',
			data: this.worker_port_interfaces,
		});
	}

	public storeWorkerPortAPI = (worker_name: string, worker_api_config: Array<string>) => {

		/* need to convert to non-immutable javascript */
		const new_worker_port_api = worker_api_config.reduce((acc: Dictionary<PromisedPostMessage>, action_type: string) => {
			const promised_api_caller = this.makePortApiCall(worker_name, action_type);
			acc[action_type] = promised_api_caller;
			return acc;
		}, {})


		// this.worker_port_apis = this.worker_port_apis.set(worker_name, new_worker_port_api);
		this.worker_port_apis[worker_name] = new_worker_port_api;
	    console.warn('storeWorkerApi', this.worker_port_apis);
	    socket.mainUpdateSocketPortAPIS({
	    	action: 'mainUpdateSocketPortAPIS',
	    	data: this.worker_port_apis
	    });
	    return;
	}

	public getWorkerPortAPI = (worker_name: string, action_name: string) => {
		/* returns a function that can be used to make an API call */
		// return this.worker_port_apis.getIn([worker_name, action_name]);
		return this.worker_port_apis[worker_name][action_name];
	}

	/*
		below here we have the worker interface
	*/

	public storeWorker = (worker_name: string, worker: Worker): undefined => {
		/*
			potential improvement: throw on storing the interface if the
			worker is not already stored. also, store the interface as the
			instance of a class.
		*/
		this.worker_instances[worker_name] = worker;
		socket.mainUpdateSocketWorkers({
			action: 'mainUpdateSocketWorkers',
			data: this.worker_instances,
		});
		return;
	}

	public isWorker = (worker: Maybe<Worker>): worker is Worker => {
		return worker !== undefined;
	}

	public terminateWorker = (worker_name: string) => {
		/*
			this should also clear all the other state.
		*/
		const worker = this.getWorker(worker_name);
		if(this.isWorker(worker)){
			worker.terminate();
			delete this.worker_instances[worker_name];
		}else{
			throw new Error(`'worker not found', ${worker_name}`);
		}
		return undefined;
	}

	public storeWorkerInterface = (worker_name: string, worker_instance: Worker): undefined => {
		const worker_interface: ICustomWorkerPort = create_worker_interface(worker_name, worker_instance);
		this.worker_interfaces[worker_name] = worker_interface;
		socket.mainUpdateSocketWorkerInterfaces({
			action: 'mainUpdateSocketWorkerInterfaces',
			data: this.worker_interfaces,
		});
		return;
	}

	public getWorkerInterface = (worker_name: string): Maybe<ICustomWorkerPort> => {
		return this.worker_interfaces[worker_name];
	}

	public storeWorkerApi = (worker_name: string, worker_api_config: Array<string>) => {
		const new_worker_api = worker_api_config.reduce((acc: Dictionary<PromisedPostMessage>, action_type: string) => {
			const promised_api_caller = this.makeWorkerApiCall(worker_name, action_type);
			acc[action_type] = promised_api_caller;
			return acc;
		}, {})

		this.worker_apis[worker_name] = new_worker_api;
		socket.mainUpdateSocketWorkerAPIS({
			action: 'mainUpdateSocketWorkerAPIS',
			data: this.worker_apis,
		});
	    console.warn('storeWorkerApi', this.worker_apis);
	    return;
	}

	public getWorkerApi = (worker_name: string, action_name: string): Maybe<PromisedPostMessage> => {
		return this.worker_apis[worker_name][action_name];
	}

	private makeWorkerApiCall = (worker_name: string, action_type: string): PromisedPostMessage => {
		const return_func: PromisedPostMessage = (message: any, transferables?: Array<Transferable>) => {
			/* grab the worker port, or the worker itself and post a message to it */
			const worker_port: Maybe<ICustomWorkerPort> = this.getWorkerInterface(worker_name)
			if(isCustomPort(worker_port)){
				return worker_port.postMessage({
				    type: action_type,
				    ...message,
				}, transferables);
			}else{
				console.warn('this.worker_interfaces', this.worker_interfaces);
				throw new Error(`getWorkerApi makePortApiCall Inside ${worker_name_provider.getWorkerName()}, Worker Not found for ${action_type}, ${worker_name}`);
			}
		}
		return return_func;
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
				console.warn('this.worker_port_interfaces', this.worker_port_interfaces);
				throw new Error(`makePortApiCall Inside ${worker_name_provider.getWorkerName()}, Custom Port Not found for ${action_type}, ${worker_name}`);
			}
		}
		return return_func;
	}

	private getWorker = (worker_name: string): Maybe<Worker> => {
		return this.worker_instances[worker_name];
	}
}

const worker_instance_provider: WorkerInstanceProvider = new WorkerInstanceProvider();

export default worker_instance_provider;