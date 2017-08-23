import { h, Component } from 'preact';
// import { Router } from 'preact-router';

import Header from './header';
// import Home from '../routes/home';
import SubmitForm from '../components/submit-form';
import RepoStream from '../components/repo-stream';
import { githubLinksParser } from '../util';
// import Home from 'async!./home';
// import Profile from 'async!./profile';
const SEARCH = '//api.github.com/users';

export default class App extends Component {
	state = {
		repos: []
	};

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	getRepos = name =>
		fetch(`${SEARCH}/${name}/repos`)
			.then(response => {
				const lastPage = response.headers.get('Link')
					? githubLinksParser(response.headers.get('Link')).last
					: 1;

				return Promise.all([response.json(), lastPage]);
			})
			.then(([repos, lastPage]) => {
				this.setState({ repos, lastPage });
			});

	render() {
		const { repos } = this.state;
		return (
			<div id="app">
				<Header />
				<div>
					<h1>Home</h1>
					<p>This is the Home component.</p>
					<SubmitForm getRepos={this.getRepos} />
					<RepoStream repos={repos} />
				</div>
				{/* <Home path="/" getRepos={this.getRepos} repos={repos} /> */}
				{/* <Router onChange={this.handleRoute}>
					<Home path="/" getRepos={this.getRepos} repos={repos} />
				</Router> */}
			</div>
		);
	}
}
