import uuid from 'utility/uuid';
import { SETUP_CHANNEL, MAIN_THREAD_NAME } from 'worker_constants';
import response_callback_provider from 'shared/provide_response_callbacks';
import { IWorkerSet, ResponseCallback } from 'zorigami_types';

const setup_channel = async (source_worker: IWorkerSet, target_worker: IWorkerSet, port: MessagePort) => {
    const target_worker_name = target_worker.worker_name;
    const {worker} = source_worker;
    const callback_guid = uuid();
    return new Promise((resolve, reject) => {
        const response_callback: ResponseCallback = (message, err) => {
            err ? reject(err) : resolve(message);
        }
        response_callback_provider.setResponseCallback(callback_guid, response_callback);
        worker.postMessage({
            type: SETUP_CHANNEL,
            worker_name: MAIN_THREAD_NAME,
            target_worker_name,
            callback_guid,
        }, [port]);
    });
};

export const construct_worker_to_worker_message_channel = async (existing_worker: IWorkerSet, new_worker: IWorkerSet) => {
    const channel: MessageChannel = new MessageChannel();
    const existing_worker_setup_task = setup_channel(existing_worker, new_worker, channel.port1);
    const new_worker_setup_task = setup_channel(new_worker, existing_worker, channel.port2);
    return Promise.all([
        existing_worker_setup_task,
        new_worker_setup_task,
    ]);
};
