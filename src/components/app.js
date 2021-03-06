import { h, Component } from 'preact'
import { Router, route } from 'preact-router'

import Header from './header'
import SubmitForm from '../components/submit-form'
import request from '../services/request'
import {
  githubLinksParser,
  pickBy,
  createFilters,
  buildFiltersUrl,
  getLanguages,
  createRepoSorting
} from '../util'
import INITIAL_STATE, { FILTERS } from './initial-state'
import css from './style.scss'
import Home from '../routes/home'
const SEARCH = '//api.github.com/users'
const PUBLIC_PATH =
  process.env.NODE_ENV === 'development' ? '/' : '/mini-github-client/'

export default class App extends Component {
  state = { ...INITIAL_STATE }

  handleRoute = event => {
    if (event.current && !this.state.error) {
      this.setState({ username: event.current.attributes.name })
      this.syncFilters(event.current)
      this.syncSorting(event.current)
    }
  }

  syncFilters = event => {
    const filtersActions = {
      [FILTERS.HAS_OPEN_ISSUES]: type => event.attributes.hasOwnProperty(type),
      [FILTERS.HAS_TOPICS]: type => event.attributes.hasOwnProperty(type),
      [FILTERS.STARS]: type =>
        event.attributes[type] || INITIAL_STATE.filters[type],
      [FILTERS.UPDATED_AT]: type =>
        event.attributes[type] || INITIAL_STATE.filters[type],
      [FILTERS.LANGUAGE]: type =>
        event.attributes[type] || INITIAL_STATE.filters[type],
      [FILTERS.TYPE]: type =>
        event.attributes[type] || INITIAL_STATE.filters[type]
    }
    const filters = Object.keys(this.state.filters).reduce((result, type) => {
      return { ...result, [type]: filtersActions[type](type) }
    }, {})
    this.setState({ filters: { ...this.state.filters, ...filters } })
  }

  syncSorting = event => {
    const {
      sort: by = INITIAL_STATE.sorting.by,
      order = INITIAL_STATE.sorting.order
    } = event.attributes
    this.setState({ sorting: { by, order } })
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

  /** Fetch repositories by user
   *	@param {string} username
   *  @param {number || string} current page
   */
  fetchRepos = async (
    name = this.state.username,
    page = this.state.currentPage
  ) => {
    this.setState({ loading: true })

    try {
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
        repos: page === 1 ? repos : [...this.state.repos, ...repos],
        lastPage,
        currentPage: page,
        loading: false,
        languages: getLanguages(repos),
        error: null
      })
    } catch (error) {
      this.setState({ error })
    }
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

  openRepo = id => {
    const url = new URL(location.href)
    const params = url.searchParams
    params.append('repo', id)
    route(url.pathname + url.search)
  }

  closeRepo = () => {
    const url = new URL(location.href)
    const params = url.searchParams
    params.delete('repo')
    route(url.pathname + url.search)
  }

  filterRepo = repo => {
    const filters = createFilters(repo)
    const pickedFilters = Object.keys(
      pickBy(this.state.filters, value => value)
    )

    return pickedFilters.every(key => filters[key](this.state.filters[key]))
  }

  changeFilter = ({ type, value }) => {
    const url = buildFiltersUrl(type, value)
    route(url.pathname + url.search)
  }

  changeSorting = sorting => {
    const url = new URL(location.href)
    const params = url.searchParams
    sorting.by !== this.state.sorting.by && params.set('sort', sorting.by)
    sorting.order !== this.state.sorting.order &&
      params.set('order', sorting.order)
    route(url.pathname + url.search)
  }

  sortRepo = createRepoSorting(this.state)

  render({}, { username, repos, filters, languages, sorting, error, loading }) {
    const filteredRepos = repos.filter(this.filterRepo).sort(this.sortRepo)
    return (
      <div id="app">
        <Header />
        <SubmitForm username={username} fetchRepos={this.fetchRepos} />
        <Router onChange={this.handleRoute}>
          <Home
            class={css.main}
            path={`${PUBLIC_PATH}:name`}
            error={error}
            loading={loading}
            repos={filteredRepos}
            fetchRepos={this.fetchRepos}
            filters={filters}
            languages={languages}
            changeFilter={this.changeFilter}
            sorting={sorting}
            changeSorting={this.changeSorting}
            openRepo={this.openRepo}
            closeRepo={this.closeRepo}
          />
        </Router>
      </div>
    )
  }
}
