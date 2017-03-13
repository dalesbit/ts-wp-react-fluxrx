import { AppStore } from "./AppStore";
import { UserStore } from "./UserStore";

export class App {
  constructor(){
    let c = new AppStore();
    let k = new UserStore();
  }
};
