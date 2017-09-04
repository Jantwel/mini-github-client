import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
// import Home from '../routes/home';
import FilterPanel from './filter-panel'
import SortPanel from './sort-panel'
import SubmitForm from '../components/submit-form'
import RepoStream from '../components/repo-stream'
import Dialog from '../components/dialog'
import request from '../services/request'
import { githubLinksParser, pickBy, createFilters } from '../util'
import INITIAL_STATE from './initial-state'
import css from './style.css'
import Home from '../routes/home'
// import Profile from 'async!./profile';
const SEARCH = '//api.github.com/users'

export default class App extends Component {
  state = INITIAL_STATE

  /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
  handleRoute = route => {
    const { current: { attributes: { matches: { name } } } } = route
    name.trim() && this.getRepos(name)
  }

  getRepos = async (
    name = this.state.username,
    page = this.state.currentPage
  ) => {
    this.setState({ loading: true })

    const { body: repos, headers } = await request(
      `${SEARCH}/${name}/repos?page=${page}&per_page=60`
    )
    const lastPage = headers.Link ? githubLinksParser(headers.Link).last : 1

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

  getLanguages = repos =>
    repos.reduce((result, { language }) => {
      if (result.includes(language)) {
        return result
      }
      return [...result, language]
    }, [])

  filterRepo = repo => {
    const filters = createFilters(repo)
    const pickedFilters = Object.keys(
      pickBy(this.state.filters, value => value)
    )

    return pickedFilters.every(key => filters[key](this.state.filters[key]))
  }

  changeFilter = ({ type, value }) =>
    this.setState({ filters: { ...this.state.filters, [type]: value } })

  changeSorting = sorting => this.setState({ sorting })

  sortRepo = (prev, next) => {
    const { sorting } = this.state
    const order = {
      larger: { asc: 1, desc: -1 },
      smaller: { asc: -1, desc: 1 }
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
          {openedRepoId &&
            <Dialog
              repo={repos.find(({ id }) => id === openedRepoId)}
              closeRepo={this.closeRepo}
            />}
        </div>
        <Router onChange={this.handleRoute}>
          <Home
            path="/:name?"
            openRepo={this.openRepo}
            repos={filteredRepos}
            filters={filters}
          />
        </Router>
      </div>
    )
  }
}
