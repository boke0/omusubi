import {Component, html, defineComponent} from '../../main.js';
import features_style from './scss/features.scss';

class Features extends Component {
  static get styles() {
    return [features_style];
  }
  render() {
    return html`
      <div id='features'>
        <h2>Features</h2>
        <div id='feature-list'>
          <om-feature>
            <h3 slot='title'>Cooperate with Vanilla</h3>
            <p slot='content'>
              You do not need any compile process to define component. The components you defined are able to be used in native HTML.
            </p>
          </om-feature>
          <om-feature>
            <h3 slot='title'>No Virtual DOM</h3>
            <p slot='content'>
              Insted of Virtual DOM diffing, Omusubi.js uses Value diffing; check diff if there is possibility of changing.
            </p>
          </om-feature>
          <om-feature>
            <h3 slot='title'>The Elm Architecture</h3>
            <p slot='content'>
              Omusubi.js is desined while respecting The Elm Architecture. You can make components which have less side-effects.
            </p>
          </om-feature>
        </div>
      </div>
    `;
  }
}
defineComponent('om-features')(Features);


