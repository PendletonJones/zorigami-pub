/* export string literal types along with the string value */
/* general worker constants */
export const SETUP_CHANNEL             = 'worker_constants/SETUP_CHANNEL';
export type SETUP_CHANNEL              = typeof SETUP_CHANNEL;

export const EXPOSE_WORKER_API         = 'worker_constants/EXPOSE_WORKER_API';
export type EXPOSE_WORKER_API          = typeof EXPOSE_WORKER_API;

export const RESPONSE_MESSAGE          = 'worker_constants/RESPONSE_MESSAGE';
export type RESPONSE_MESSAGE           = typeof RESPONSE_MESSAGE;

export const TRIGGER_EXPOSE_WORKER_API = 'worker_constants/TRIGGER_EXPOSE_WORKER_API';
export type TRIGGER_EXPOSE_WORKER_API  = typeof TRIGGER_EXPOSE_WORKER_API;

export const EXPOSE_MAIN_API           = 'worker_constants/EXPOSE_MAIN_API';
export type EXPOSE_MAIN_API            = typeof EXPOSE_MAIN_API;

export const REJECT_MESSAGE            = 'worker_constants/REJECT_MESSAGE';
export type REJECT_MESSAGE             = typeof REJECT_MESSAGE;

export const LIST_CONNECTIONS          = 'worker_constants/LIST_CONNECTIONS';
export type LIST_CONNECTIONS           = typeof LIST_CONNECTIONS;

/* random constants */
export const MAIN_THREAD_NAME          = 'main_thread';
export type MAIN_THREAD_NAME           = typeof MAIN_THREAD_NAME;

export const ACK                       = 'ACK';
export type ACK                        = typeof ACK;

/* types of workers */
export const INDIVIDUAL_WORKER         = 'worker_config/INDIVIDUAL_WORKER';
export type INDIVIDUAL_WORKER          = typeof INDIVIDUAL_WORKER;

export const TRANSPARENT_POOL          = 'worker_config/TRANSPARENT_POOL';
export type TRANSPARENT_POOL           = typeof TRANSPARENT_POOL;

/* these actions are available on the main thread to all the workers */
export const REDIRECT_URL              = 'main_actions/REDIRECT_URL';
export type REDIRECT_URL               = typeof REDIRECT_URL;

export const FLUSH_DATA                = 'main_actions/FLUSH_DATA';
export type FLUSH_DATA                 = typeof FLUSH_DATA;

export const DESTROY_WORKER            = 'main_actions/DESTROY_WORKER';
export type DESTROY_WORKER             = typeof DESTROY_WORKER;

export const LOAD_SCRIPT               = 'main_actions/LOAD_SCRIPT';
export type LOAD_SCRIPT                = typeof LOAD_SCRIPT;

export const TIMEOUT                   = 100 * 35;
export type TIMEOUT                    = typeof TIMEOUT;
