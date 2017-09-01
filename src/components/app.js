import { h, Component } from 'preact'
// import { Router } from 'preact-router';

import Header from './header'
// import Home from '../routes/home';
import FilterPanel from './filter-panel'
import SortPanel from './sort-panel'
import SubmitForm from '../components/submit-form'
import RepoStream from '../components/repo-stream'
import Dialog from '../components/dialog'
import { githubLinksParser, pickBy } from '../util'
import INITIAL_STATE from './initial-state'
import css from './style.css'
// import Home from 'async!./home';
// import Profile from 'async!./profile';
const SEARCH = '//api.github.com/users'

export default class App extends Component {
  state = INITIAL_STATE

  /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
  handleRoute = e => {
    this.currentUrl = e.url
  }

  getRepos = (name = this.state.username, page = this.state.currentPage) => {
    this.setState({ loading: true })
    fetch(`${SEARCH}/${name}/repos?page=${page}&per_page=60`, {
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
        if (!this.state.lastPage && lastPage > 1) {
          this.scrollListener = document.addEventListener(
            'scroll',
            this.handleLoadRepos
          )
        }

        this.setState({
          username: name,
          repos: [...this.state.repos, ...repos],
          lastPage,
          currentPage: page,
          loading: false,
          languages: this.getLanguages(repos)
        })
      })
  }

  handleLoadRepos = event => {
    const { username, currentPage, loading, lastPage } = this.state
    const scrollHeight = event.target.documentElement.scrollHeight

    if (
      scrollHeight - (window.scrollY + window.innerHeight) < 200 &&
      currentPage < lastPage &&
      !loading
    ) {
      this.getRepos(username, currentPage + 1)
    }
  }

  openRepo = ({ id }) => this.setState({ dialogOpened: true, openedRepoId: id })

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

  changeFilter = ({ type, value }) => {
    this.setState({
      filters: { ...this.state.filters, [type]: value }
    })
  }

  changeSorting = sorting => this.setState({ sorting })

  sortRepo = (prev, next) => {
    const { sorting } = this.state
    const order = {
      larger: {
        asc: 1,
        desc: -1
      },
      smaller: {
        asc: -1,
        desc: 1
      }
    }
    if (prev[sorting.by] < next[sorting.by]) return order.smaller[sorting.order]
    if (prev[sorting.by] > next[sorting.by]) return order.larger[sorting.order]
    return 0
  }

  render({}, { repos, openedRepoId, filters, languages, sorting }) {
    console.log('app state: ', this.state)
    const filteredRepos = repos.filter(this.filterRepo).sort(this.sortRepo)
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
          <SortPanel sorting={sorting} changeSorting={this.changeSorting} />
          <RepoStream
            repos={filteredRepos}
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
