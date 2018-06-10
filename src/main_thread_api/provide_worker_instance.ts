import create_worker_interface from '../main_thread_api/create_worker_interface_main';
import worker_name_provider from '../shared/provide_name';
import MainSocketProvider from '../main_thread_api/main_socket_provider';
import {
	PromisedPostMessage,
	Maybe,
	ICustomWorkerPort,
	Transferable,
	isCustomPort,
	Dictionary,
	isWorker
} from '../zorigami_types';

/* move this to the constructor */
const socket = new MainSocketProvider();

export class WorkerInstanceProvider {

	private worker_instances: Dictionary<Worker>;

	constructor(){
		this.worker_instances = {};
	}


	public storeWorker = (worker_name: string, worker: Worker): undefined => {
		this.worker_instances[worker_name] = worker;
		return;
	}

	public terminateWorker = (worker_name: string) => {
		/*
			this should also clear all the other state.
		*/
		const worker = this.getWorker(worker_name);
		if(isWorker(worker)){
			worker.terminate();
			delete this.worker_instances[worker_name];
		}else{
			throw new Error(`'worker not found', ${worker_name}`);
		}
		return undefined;
	}





	private getWorker = (worker_name: string): Maybe<Worker> => {
		return this.worker_instances[worker_name];
	}
}

const worker_instance_provider: WorkerInstanceProvider = new WorkerInstanceProvider();

export default worker_instance_provider;