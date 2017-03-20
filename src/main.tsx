import { h, render } from 'Preact';
import { App } from './app';
import Store from './frame/Store';
/** @jsx h */

class Bootstrap {
  constructor() {

    let c = new App();
    Store.subscribe((state: any) => {
      render((
        <div>
            <p>{state.test}</p>
            <button onClick={state.App.increaseCount}>+</button>
            <div>{state.App.counter}</div>
            <button onClick={state.App.decreaseCount}>-</button>
        </div>),
        document.body, // note: preact is non desctructive
        document.body.lastElementChild // note: so we will pass the node to owerwrite
      );
    });
  }
}

new Bootstrap();
