import { TRIGGER_EXPOSE_WORKER_API } from '../../worker_constants';
import worker_instance_provider from '../../main_thread_api/providers/provide_worker_instance';
import { IWorkerSet, isPromisedPostMessage } from '../../zorigami_types';

export const tell_workers_to_exchange_api = async (
    existing_worker_set: IWorkerSet,
    new_worker_set: IWorkerSet,
) => {
    console.warn('tell_workers_to_exchange_api');
    const existing_worker_name = existing_worker_set.worker_name;
    const new_worker_name      = new_worker_set.worker_name;
    /* this isn't being handled on the other side because it's posting to the worker, not
    to the message port */
    // const existing_interface = worker_instance_provider.getWorkerApi(existing_worker_name, TRIGGER_EXPOSE_WORKER_API);
    const existing_interface = worker_instance_provider.getWorkerPortAPI(existing_worker_name, TRIGGER_EXPOSE_WORKER_API);
    if(isPromisedPostMessage(existing_interface)){
        const return_promise_test = existing_interface({
            target_worker_name: new_worker_name,
        });
        // const new_interface = worker_instance_provider.getWorkerApi(new_worker_name, TRIGGER_EXPOSE_WORKER_API)
        const new_interface = worker_instance_provider.getWorkerPortAPI(new_worker_name, TRIGGER_EXPOSE_WORKER_API)
        if(isPromisedPostMessage(new_interface)){
            console.warn('existing_interface, new_interface', existing_interface, new_interface);
            const return_promise_test2 = new_interface({
                target_worker_name: existing_worker_name,
            });
            return await Promise.all([return_promise_test, return_promise_test2]);
        }else{
            throw new Error(`failed to find the NEW interface ${new_worker_name}, ${'put wroker name here'}`);
        }
    }else{
        throw new Error(`faile to find the EXISTING interface ${new_worker_name}, ${'put wroker name here'}`);
    }
};
