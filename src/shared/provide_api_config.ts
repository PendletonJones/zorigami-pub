import { ApiConfiguration } from '../zorigami_types';

export class ApiConfigProvider {
	private api_config: ApiConfiguration;

	constructor(){
		this.storeApiConfig = this.storeApiConfig.bind(this);
		this.getApiConfig = this.getApiConfig.bind(this);
		this.listApiConfig = this.listApiConfig.bind(this);
		this.api_config = {};
	}

	public storeApiConfig = (api_config: ApiConfiguration) => {
	    this.api_config = api_config;
	};

	public getApiConfig = () => {
	    return this.api_config;
	};

	public listApiConfig = (): Array<string> => {
		return Object.keys(this.api_config);
	};
}

const provider: ApiConfigProvider = new ApiConfigProvider();

export default provider;