import { h, Component } from 'preact'
import { Router, route } from 'preact-router'

import Header from './header'
import SubmitForm from '../components/submit-form'
import request from '../services/request'
import {
  githubLinksParser,
  pickBy,
  createFilters,
  buildFiltersUrl
} from '../util'
import INITIAL_STATE, { FILTERS } from './initial-state'
import css from './style.css'
import Home from '../routes/home'
const SEARCH = '//api.github.com/users'

export default class App extends Component {
  state = { ...INITIAL_STATE }

  handleRoute = event => {
    console.log('change route', event)
    if (event.current) {
      this.setState({ username: event.current.attributes.name })
      this.syncFilters(event.current)
      this.syncSorting(event.current)
    }
  }

  syncFilters = event => {
    const filtersProps = {
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
      return { ...result, [type]: filtersProps[type](type) }
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

  render({}, { username, repos, filters, languages, sorting }) {
    console.log('app state: ', this.state)
    const filteredRepos = repos.filter(this.filterRepo).sort(this.sortRepo)
    return (
      <div id="app">
        <Header />
        <SubmitForm username={username} fetchRepos={this.fetchRepos} />
        <Router onChange={this.handleRoute}>
          <Home
            class={css.main}
            path="/:name"
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
