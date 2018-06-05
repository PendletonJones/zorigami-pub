import dispatch_message from 'worker_api/dispatch_message';
import api_config_provider from 'shared/provide_api_config';
import { ApiConfiguration } from 'zorigami_types';
import worker_name_provider from 'shared/provide_name';

export default function install_worker(api_configuration: ApiConfiguration, worker_name: string): void {
	/**
	 * call this function from the entry point of the worker. must provide an
	 * api_configuration and a worker_name.
	 */
	if(typeof window === 'undefined'){
		worker_name_provider.setWorkerName(worker_name);
	    self.onmessage = dispatch_message;
		api_config_provider.storeApiConfig(api_configuration);
	}
}