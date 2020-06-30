import React, { Component } from "react";
import { Inject } from "../../utils";

@Inject(({ homeStore: model }) => ({
  model,
}))
class Home extends Component {
  componentDidMount() {
    const {
      model: { dispatch },
    } = this.props;
    for (let i = 0; i < 100; i++) {
      dispatch({
        type: "apiTest",
      });
    }
  }

  render() {
    return <div>hahhaddddddddddddd</div>;
  }
}

export default Home;
