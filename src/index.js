import { h, render } from 'preact';

require('./pwa');

let root;
function init() {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
	require('preact/devtools');
	module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
