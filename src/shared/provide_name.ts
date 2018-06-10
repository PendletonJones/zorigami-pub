
export class WorkerNameProvider {
	/*
		this is a class that should be used as a singleton
		to provide stored api configurations for any function
		in the context (main thread or worker thread)
	*/
	/* private properties must come before constructor */
	private worker_name: string;

	constructor(){
		this.worker_name = 'not set yet';
	}

	public setWorkerName(worker_name: string){
	    this.worker_name = worker_name;
	};

	public getWorkerName(){
	    return this.worker_name;
	};
}

const provider: WorkerNameProvider = new WorkerNameProvider();

export default provider;