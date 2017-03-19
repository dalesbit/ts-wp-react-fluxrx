import { BehaviorSubject } from "@reactivex/rxjs";

interface Connection extends Object {
  error(t:any):any;
  init(t:any): void;
  send(t:string,n:Object): void;
  subscribe(t:any): void;
  unsubscribe(): void;
}

export class ReduxDevTools {
  static readonly ID = "__REDUX_DEVTOOLS_EXTENSION__";
  private _connection: Connection = null;
  private _observer: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(){
    this._connection = (<any>window)[ReduxDevTools.ID].connect({});
    this._connection.init(this._observer.value);
    this._connection.subscribe(this.handleMessage.bind(this));
  }

  private handleMessage(message:any): void {
    if (message.type === 'DISPATCH' && message.state && message.payload.type != "TOGGLE_ACTION") {
      console.log('DevTools requested to change the state to', JSON.parse(message.state));
      this._observer.next(JSON.parse(message.state));
    }
  }

  public send(describer: string, message:any): void {
    this._connection.send(describer, message);
  }

  get observer(): BehaviorSubject<any> {
    return this._observer;
  }
};
