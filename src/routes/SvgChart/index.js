import React, { Component } from "react";
import styles from "./index.module.scss";
import Shapes from "./shapes";
import DrawArea from "./drawArea";
import Features from "./features";

class SvgChart extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.utils}>utils</div>
        <div className={styles.works}>
          <div className={styles.shapesContainer}>
            <Shapes />
          </div>
          <div className={styles.drawAreaContainer}>
            <DrawArea />
          </div>
          <div className={styles.featuresContainer}>
            <Features />
          </div>
        </div>
      </div>
    );
  }
}

export default SvgChart;
