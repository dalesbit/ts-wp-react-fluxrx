import * as React from "react";
import * as ReactDOM from "react-dom";
import { Observable } from "@reactivex/rxjs";
import { default as storePool } from "./frame/StorePool";
import { App } from "./app";
import { Frame } from "./frame";

import { default as Store } from "./frame/Store";

class Bootstrap {
  constructor() {

      let c = new App();

      Store.subscribe((state:any) => {
        console.log("appState",state);
        ReactDOM.render(
          <div>
            <p>{state.test}</p>
            <button onClick={state.App.increaseCount}>+</button>
            <div>{state.App.counter}</div>
            <button onClick={state.App.decreaseCount}>-</button>
          </div>,
            document.getElementById("example")
        );
      });
  }
}

new Bootstrap();
/*{appState.AppStore.test}
  <button onClick={appState.AppStore.func}>+</button>
  <p>{appState.test}</p>
  <button onClick={appState.increaseCount}>+</button>
  <div>{appState.counter}</div>
  <button onClick={appState.decreaseCount}>-</button>*/
