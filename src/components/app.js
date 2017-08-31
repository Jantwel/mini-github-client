import { h, Component } from 'preact'
// import { Router } from 'preact-router';

import Header from './header'
// import Home from '../routes/home';
import FilterPanel from './filter-panel'
import SubmitForm from '../components/submit-form'
import RepoStream from '../components/repo-stream'
import Dialog from '../components/dialog'
import { githubLinksParser, pickBy } from '../util'
import css from './style.css'
// import Home from 'async!./home';
// import Profile from 'async!./profile';
const SEARCH = '//api.github.com/users'

export default class App extends Component {
	state = {
		repos: [],
		filteredRepos: [],
		languages: [],
		filters: {
			hasOpenIssues: false,
			hasTopics: false,
			stars: 0,
			updated: '',
			language: '',
			type: 'all'
		}
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url
	}

	getRepos = name =>
		fetch(`${SEARCH}/${name}/repos`, {
			headers: new Headers({
				Accept: 'application/vnd.github.mercy-preview+json'
			})
		})
			.then(response => {
				const lastPage = response.headers.get('Link')
					? githubLinksParser(response.headers.get('Link')).last
					: 1

				return Promise.all([response.json(), lastPage])
			})
			.then(([repos, lastPage]) => {
				this.setState({ repos, lastPage, languages: this.getLanguages(repos) })
			})

	openRepo = ({ id }) => {
		this.setState({ dialogOpened: true, openedRepoId: id })
	}

	closeRepo = () => this.setState({ openedRepoId: null })

	getLanguages = repos => {
		return repos.reduce((result, { language }) => {
			if (result.includes(language)) {
				return result
			}
			return [...result, language]
		}, [])
	}

	filterRepo = ({
		open_issues_count,
		topics,
		stargazers_count,
		pushed_at,
		language,
		fork
	}) => {
		const filters = {
			hasOpenIssues: () => open_issues_count,
			hasTopics: () => topics.length,
			stars: value => stargazers_count >= value,
			updated: value => new Date(pushed_at) > new Date(value),
			language: value => {
				if (value === 'all') {
					return true
				}
				return language === value
			},
			type: value => {
				if (value === 'all') {
					return true
				}
				const isFork = value === 'forks'
				return isFork === fork
			}
		}

		return Object.keys(pickBy(this.state.filters, value => value)).every(key =>
			filters[key](this.state.filters[key])
		)
	}

	applyFilters = () => {
		this.setState({
			filteredRepos: this.state.repos.filter(this.filterRepo)
		})
	}

	changeFilter = ({ type, value }) => {
		this.setState(
			{
				applyFilters: true,
				filters: { ...this.state.filters, [type]: value }
			},
			this.applyFilters
		)
	}

	render(
		{},
		{ repos, openedRepoId, filters, languages, filteredRepos, applyFilters }
	) {
		console.log('app props: ', this.state)
		return (
			<div id="app">
				<Header />
				<div class={css.main}>
					<SubmitForm getRepos={this.getRepos} />
					<FilterPanel
						filters={filters}
						languages={languages}
						changeFilter={this.changeFilter}
					/>
					<RepoStream
						repos={applyFilters ? filteredRepos : repos}
						filters={filters}
						openRepo={this.openRepo}
					/>
					{openedRepoId &&
						<Dialog
							repo={repos.find(({ id }) => id === openedRepoId)}
							closeRepo={this.closeRepo}
						/>}
				</div>
				{/* <Home path="/" getRepos={this.getRepos} repos={repos} /> */}
				{/* <Router onChange={this.handleRoute}>
					<Home path="/" getRepos={this.getRepos} repos={repos} />
				</Router> */}
			</div>
		)
	}
}
