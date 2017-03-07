import * as React from "react";
import * as ReactDOM from "react-dom";
import { Observable } from "@reactivex/rxjs";
import { default as storePool } from "./frame/StorePool";
import { App } from "./app";
import { Frame } from "./frame";


class Bootstrap {
  constructor() {

      let c = new App();

      Frame.Dispatcher.getAction()
      .subscribe( _ => {
        console.log("LOGGER",_);
      });

      Frame.Store
      .subscribe((appState:any) => {
        console.log("appState",appState);
        ReactDOM.render(
          <div>
            {appState.AppStore.test}
            <button onClick={appState.AppStore.func}>+</button>
            <p>{appState.test}</p>
            <button onClick={appState.increaseCount}>+</button>
            <div>{appState.count}</div>
            <button onClick={appState.decreaseCount}>-</button>
          </div>,
            document.getElementById("example")
        );
      });


  }
}

new Bootstrap();
