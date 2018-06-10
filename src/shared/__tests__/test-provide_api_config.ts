import provider, { ApiConfigProvider } from '../provide_api_config';
import { ApiConfiguration, DispatchHandler, ResponseFunction, Maybe } from '../../zorigami_types';

describe('auto created provider', () => {
    test('provider is an instance of ApiConfigProvider', () => {
        expect(provider).toBeInstanceOf(ApiConfigProvider);
    });
    test('provider is empty', () => {
        expect(provider.listApiConfigMethods()).toHaveLength(0);;
        expect(provider.getApiConfig()).toEqual({});
    });
});

describe('creates an api config provider', () => {
    const DEMO_METHOD = 'DEMO_METHOD';
    const demo_method_dispatch = (event: MessageEvent, respond: ResponseFunction) => {
        console.log(event);
        respond('responding with mock data');
    };
    const api_configuration: ApiConfiguration = {
        [DEMO_METHOD]: demo_method_dispatch
    }
    const new_provider = new ApiConfigProvider();
    beforeAll(() => {
        jest.spyOn(new_provider, 'storeApiConfig');
        jest.spyOn(new_provider, 'getApiConfig');
        jest.spyOn(new_provider, 'getDispatchMethod');
        jest.spyOn(new_provider, 'listApiConfigMethods');
    });
    test('stores ApiConfig', () => {
        new_provider.storeApiConfig(api_configuration);
        expect(new_provider.storeApiConfig).toHaveBeenCalled();
        expect(new_provider.getApiConfig()).toBe(api_configuration);
        expect(new_provider.getDispatchMethod(DEMO_METHOD)).toBe(demo_method_dispatch);
        expect(new_provider.listApiConfigMethods()).toEqual([DEMO_METHOD]);
    });
});