
import { IHasToJSON, Dictionary } from 'zorigami_types';
import uuid from 'utility/uuid';
import socket from 'shared/provide_socket';
import name_provider from 'shared/provide_name';

export default class MainSocketProvider {
    private socket: SocketIOClient.Socket;
    constructor(){
        this.socket = socket;
    }
    public createStateMonitor(stateconfig: () => Dictionary<any>){
        return (wrapped_function: (...wrapped_args: Array<any>) => any) => {
            return (...wrapped_args: Array<any>) => {
                const ret_value: any = wrapped_function(...wrapped_args);
                this.updateMainState(stateconfig);
                return ret_value;
            }
        }
    }
    public mainUpdateSocketWorkers(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        this.socket.emit('mainUpdateSocketWorkers', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public mainUpdateSocketWorkerInterfaces(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        this.socket.emit('mainUpdateSocketWorkerInterfaces', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public mainUpdateSocketWorkerAPIS(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        this.socket.emit('mainUpdateSocketWorkerAPIS', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public mainUpdateSocketPorts(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('mainUpdateSocketPorts', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public mainUpdateSocketPortInterfaces(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('mainUpdateSocketPortInterfaces', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }
    public mainUpdateSocketPortAPIS(downstream_data: IHasToJSON){
        const callback_guid = uuid();
        socket.emit('mainUpdateSocketPortAPIS', {
            callback_guid,
            downstream_data,
            from_name: name_provider.getWorkerName(),
        });
    }

    private updateMainState = (stateconfig: () => Dictionary<any>) => {
        setTimeout(() => {
            const callback_guid = uuid();
            this.socket.emit('updateMainState', {
                callback_guid,
                main_data: stateconfig().toJS(),
                from_name: name_provider.getWorkerName(),
            });
        });
    }
}