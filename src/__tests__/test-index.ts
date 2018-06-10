import { install_worker, setup_workers } from '../index';
import { ResponseFunction } from '../zorigami_types';


describe('installs workers correctly', () => {
    beforeEach(() => {
        const demo_api_configuration = {
            'FAKE': (event: MessageEvent, respond: ResponseFunction) => {
                respond({ message: `hello from test dispatch`, data: event.data });
            },
        };
        install_worker(demo_api_configuration, 'demo_worker');
    });
    test('shoud fail', () => {
        expect(1 + 1).toEqual(1);
    });
});

describe('sets up workers correcty', () => {
    test('shoud fail', () => {
        expect(1 + 1).toEqual(1);
    });
});

describe('creates a web worker', () => {
    test('creates a worker', () => {
        
    });
});