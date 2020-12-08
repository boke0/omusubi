import {Component, html, defineComponent} from '../../main.js';
import install_style from './scss/install.scss';

class Install extends Component {
  static get styles() {
    return [install_style];
  }
  render() {
    return html`
      <div id='install'>
        <h2>Getting started</h2>
        <div>
          <p>Use npm:</p>
          <div class='code'>
            <code>
              $ npm install boke0/omusubi
            </code>
          </div>
          <!--
          <p>Or, use CDN:</p>
          <div class='code'>
            <code>
              &lt;script type='module'&gt;<br>
                import {Component, html, defineComponent} from '//unpkg.com/omusubi/omusubi.min.js';<br>
              &lt;/script&gt;
            </code>
          </div>
          -->
        </div>
      </div>
    `;
  }
}
defineComponent('om-install')(Install);


