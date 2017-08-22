import './style';
import App from './components/app';
import { Provider } from 'preact-redux';
import store from './store';

export default () =>
	(<Provider store={store}>
		<App />
	</Provider>);
