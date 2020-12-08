import './header.js';
import './footer.js';

import './features.js';
import './install.js';
import './feature.js';

import {Component, html, defineComponent} from '../../main.js';
import styles from './scss/page.scss';

class Page extends Component {
  static get styles(){
    return [styles];
  }
  render() {
    return html`
      <om-header></om-header>
      <main>
        <om-features></om-features>
        <om-install></om-install>
      </main>
      <om-footer></om-footer>
    `;
  }
}

defineComponent('om-page')(Page);
