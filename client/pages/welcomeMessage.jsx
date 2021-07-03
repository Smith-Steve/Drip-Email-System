import React, { Component } from 'react';
import { init } from 'ityped';

export default class WelcomeMessage extends Component {
  componentDidMount() {
    const myElement = document.querySelector('#myElement');
    init(myElement, { showCursor: false, strings: ['Unleash Your Message!'], loop: false, startDelay: 500 });
  }

  render() {
    return <div id="myElement"></div>;
  }
}
