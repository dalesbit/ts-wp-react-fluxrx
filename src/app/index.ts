import { AppStore } from "./AppStore";

export class App {
  constructor(){
    let c = new AppStore();
    c.setState({
      test:222,
      c:3
    });
  }
};
