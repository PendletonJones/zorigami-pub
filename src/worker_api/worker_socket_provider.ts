import { IHasToJSON } from '../zorigami_types';
import uuid from '../utility/uuid';
import socket from '../shared/provide_socket';
import name_provider from '../shared/provide_name';

export default class WorkerSocketProvider {
    private socket: SocketIOClient.Socket;
    constructor(){
        this.socket = socket;
    }
    public workerUpdateSocketMainInterfaces(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        this.socket.emit('workerUpdateSocketMainInterfaces', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public workerUpdateSocketMainAPIS(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        this.socket.emit('workerUpdateSocketMainAPIS', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public workerUpdateSocketPorts(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('workerUpdateSocketPorts', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public workerUpdateSocketPortInterfaces(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('workerUpdateSocketPortInterfaces', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public workerUpdateSocketPortAPIS(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('workerUpdateSocketPortAPIS', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
}