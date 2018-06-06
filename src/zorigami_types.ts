import { INDIVIDUAL_WORKER, TRANSPARENT_POOL } from './worker_constants';

export interface IConstructable<T> {
    new() : T;
}
export interface IWorkerSet {
    readonly worker: Worker;
    readonly worker_name: string;
}
export interface ICustomWorkerPort {
	postMessage: PromisedPostMessage;
	createResponse: (event: MessageEvent) => (message: any) => void;
}
export interface IMessage {
    from?:string
}
export interface ApiConfiguration {
    readonly [dispatch_name: string]: DispatchHandler
}
export interface Dictionary<T> {
    [key: string]: T
}

export type IHasToJSON = any;
export type ResponseCallback = (message: any, err?: any) => void;
export type UUID = string;
export type Maybe<T> = T | undefined;
export type Transferable = ArrayBuffer | MessagePort | ImageBitmap;
export type PromisedPostMessage = (message: any, transferables?: Array<Transferable>) => Promise<MessageEvent>;
export type ResponseFunction = (message: any) => void;
export type DispatchHandler = (event: MessageEvent, respond: ResponseFunction) => void;
export type WorkerConstructor = IConstructable<Worker>;
export type WorkerList = Array<{
    WorkerConstructor: WorkerConstructor,
    worker_name: string,
    type: INDIVIDUAL_WORKER | TRANSPARENT_POOL,
}>

export function isMessagePort(potential_port: Maybe<MessagePort>): potential_port is MessagePort {
    return potential_port !== undefined;
}
export function isCustomPort(potential_port: Maybe<ICustomWorkerPort>): potential_port is ICustomWorkerPort {
    return potential_port !== undefined;
}
export function isPromisedPostMessage(potential_func: Maybe<PromisedPostMessage>): potential_func is PromisedPostMessage {
	return potential_func !== undefined;
}