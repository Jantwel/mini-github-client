import { h, Component } from 'preact'
import { Router, route } from 'preact-router'

import Header from './header'
// import Home from '../routes/home';
import FilterPanel from './filter-panel'
import SortPanel from './sort-panel'
import SubmitForm from '../components/submit-form'
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

  handleRoute = event => {
    console.log('change route', event)
    this.checkFilters()
  }

  getFromStorage = name => {
    if (!JSON.parse(sessionStorage.getItem(`repos:${name}`))) {
      return null
    }
    return {
      body: JSON.parse(sessionStorage.getItem(`repos:${name}`)),
      headers: {}
    }
  }

  fetchRepos = async (
    name = this.state.username,
    page = this.state.currentPage
  ) => {
    this.setState({ loading: true })

    const { body: repos, headers } =
      this.getFromStorage(name) ||
      (await request(`${SEARCH}/${name}/repos?page=${page}&per_page=60`))

    const lastPage = headers.Link ? githubLinksParser(headers.Link).last : 1

    if (!this.state.lastPage && lastPage > 1) {
      this.scrollListener = document.addEventListener(
        'scroll',
        this.handleLoadRepos
      )
    }

    sessionStorage.setItem(`repos:${name}`, JSON.stringify(repos))

    this.setState({
      username: name,
      repos: page === 1 ? repos : [...this.state.repos, ...repos],
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
      this.fetchRepos(username, currentPage + 1)
    }
  }

  closeRepo = name => route(`/${name}`)

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

  changeFilter = ({ type, value }) => {
    const search = location.search || '?'
    // this.checkFilters()
    route(`${search}&${type}`)
    this.setState({ filters: { ...this.state.filters, [type]: value } })
  }

  checkFilters = () => {
    const searchParams = new URL(location.href).searchParams
    console.log('searchParams: ', searchParams.has('some'))
  }

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

  render({}, { repos, filters, languages, sorting }) {
    console.log('app state: ', this.state)
    const filteredRepos = repos.filter(this.filterRepo).sort(this.sortRepo)
    return (
      <div id="app">
        <Header />
        <div class={css.main}>
          <SubmitForm fetchRepos={this.fetchRepos} />
          <FilterPanel
            filters={filters}
            languages={languages}
            changeFilter={this.changeFilter}
          />
          <SortPanel sorting={sorting} changeSorting={this.changeSorting} />
        </div>
        <Router onChange={this.handleRoute}>
          <Home
            path="/:name?"
            repos={filteredRepos}
            filters={filters}
            fetchRepos={this.fetchRepos}
          />
          <Dialog path="/:name/:repoName" closeRepo={this.closeRepo} />
        </Router>
      </div>
    )
  }
}
