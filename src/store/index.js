import { default as GlobalStore } from "./globalStore";
import { default as HomeStore } from "./homeStore";

class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.homeStore = new HomeStore(this);
  }
}

export default new RootStore();
