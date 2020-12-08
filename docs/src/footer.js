import {Component, html, defineComponent} from '../../main.js';
import footer_style from './scss/footer.scss';

class Footer extends Component {
  static get styles() {
    return [footer_style];
  }
  render() {
    return html`
      <footer>
        <div id='inner'>
          Released under the MIT License<br>
          Copyright © 2020 - 木瓜丸
        </div>
      </footer>
    `;
  }
}
defineComponent('om-footer')(Footer);
