import { UUID, ResponseCallback, Dictionary } from 'zorigami_types';
// import socket from 'shared/provide_socket';

export class WorkerResponseCallbackStore {
	/*
		this is a class that should be used as a singleton
		to provide stored api configurations for any function
		in the context (main thread or worker thread)
	*/
	/* private properties must come before constructor */
	private response_callbacks: Dictionary<ResponseCallback>;

	constructor(){
		this.response_callbacks = {};
		this.setResponseCallback = this.setResponseCallback.bind(this);
		this.getResponseCallback = this.getResponseCallback.bind(this);
		this.removeResponseCallback = this.removeResponseCallback.bind(this);
	}

	public setResponseCallback = (callback_guid: UUID, response_callback: ResponseCallback) => {
		this.response_callbacks[callback_guid] = response_callback;
	};

	public getResponseCallback = (callback_guid: UUID): ResponseCallback => {
		return this.response_callbacks[callback_guid];
	}

	public removeResponseCallback = (callback_guid: UUID) => {
		delete this.response_callbacks[callback_guid];
	}
}

const provider: WorkerResponseCallbackStore = new WorkerResponseCallbackStore();

export default provider;