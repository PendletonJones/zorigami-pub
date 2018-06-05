import { Map } from 'immutable';
import { ApiConfiguration } from 'zorigami_types';
// import socket from 'shared/provide_socket';

export class ApiConfigProvider {
	/* 
		this is a class that should be used as a singleton
		to provide stored api configurations for any function
		in the context (main thread or worker thread)
	*/
	/* private properties must come before constructor */
	private api_config: ApiConfiguration;
	
	constructor(){
		this.storeApiConfig = this.storeApiConfig.bind(this);
		this.getApiConfig = this.getApiConfig.bind(this);
		this.listApiConfig = this.listApiConfig.bind(this);
		this.api_config = Map();
	}

	public storeApiConfig = (api_config: ApiConfiguration) => {
	    this.api_config = api_config;
	};

	public getApiConfig = () => {
	    return this.api_config;
	};

	public listApiConfig = (): Array<string> => {
	    return this.api_config.keySeq().toList().toJS();
	};
}

const provider: ApiConfigProvider = new ApiConfigProvider();

export default provider;