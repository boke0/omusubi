import {Component, html, defineComponent} from '../../main.js';
import header_style from './scss/header.scss';

class Header extends Component {
  static get styles() {
    return [header_style];
  }
  render() {
    return html`
      <header>
        <div id='inner'>
          <img src='/img/omusubi.svg' id='logo' />
          <h1>Omusubi.js</h1>
          <p>Ball your WebComponents</p>
        </div>
      </header>
    `;
  }
}
defineComponent('om-header')(Header);


