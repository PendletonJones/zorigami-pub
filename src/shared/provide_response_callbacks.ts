import { Map } from 'immutable';
import { UUID, ResponseCallback } from 'zorigami_types';
// import socket from 'shared/provide_socket';

export class WorkerResponseCallbackStore {
	/* 
		this is a class that should be used as a singleton
		to provide stored api configurations for any function
		in the context (main thread or worker thread)
	*/
	/* private properties must come before constructor */
	private response_callbacks: Map<UUID, ResponseCallback>;

	constructor(){
		this.response_callbacks = Map();
		this.setResponseCallback = this.setResponseCallback.bind(this);
		this.getResponseCallback = this.getResponseCallback.bind(this);
		this.removeResponseCallback = this.removeResponseCallback.bind(this);
	}

	public setResponseCallback = (callback_guid: UUID, response_callback: ResponseCallback) => {
	    this.response_callbacks = this.response_callbacks.set(callback_guid, response_callback);
	};

	public getResponseCallback = (callback_guid: UUID): ResponseCallback => {
		return this.response_callbacks.get(callback_guid);
	}

	public removeResponseCallback = (callback_guid: UUID) => {
	    this.response_callbacks = this.response_callbacks.delete(callback_guid);
	}
}

const provider: WorkerResponseCallbackStore = new WorkerResponseCallbackStore();

export default provider;