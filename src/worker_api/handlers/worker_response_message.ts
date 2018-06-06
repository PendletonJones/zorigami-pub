import callback_provider from '../../shared/provide_response_callbacks';

export default function worker_response_message (event: MessageEvent) {
	const callback_guid: string = event.data.callback_guid;
    callback_provider.getResponseCallback(callback_guid)(event);
    callback_provider.removeResponseCallback(callback_guid);
};