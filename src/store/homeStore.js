import { observable } from "mobx";
import ModelExtend from "./modelExtend";
import { getExample } from "../services";

export default class HomeStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  @observable name = "homeStore";

  apiTest = async () => {
    const res = await getExample();
    console.log(res, "---res");
  };
}
