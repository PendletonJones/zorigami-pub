import { ApiConfiguration, ResponseFunction} from '../zorigami_types';
import {
    ACK,
    MAIN_THREAD_NAME,
    REDIRECT_URL,
    FLUSH_DATA,
    DESTROY_WORKER,
    LIST_CONNECTIONS,
    LOAD_SCRIPT,
} from '../worker_constants';

export const main_thread_api_config: ApiConfiguration = {
    [REDIRECT_URL]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    },
    [FLUSH_DATA]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    },
    [DESTROY_WORKER]: (event: MessageEvent, respond: ResponseFunction) => {
        respond(ACK);
    }
};