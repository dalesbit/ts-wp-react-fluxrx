import * as React from "react";
import * as ReactDOM from "react-dom";

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
        ReactDOM.render(
          <div>
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
