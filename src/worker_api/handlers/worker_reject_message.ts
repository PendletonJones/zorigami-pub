export default function worker_reject_message (event: MessageEvent) { 
    throw new Error(JSON.stringify(event.data)); 
};