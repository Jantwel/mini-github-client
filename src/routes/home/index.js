import { h, Component } from 'preact'
import RepoStream from 'components/repo-stream'
import FilterPanel from 'components/filter-panel'
import SortPanel from 'components/sort-panel'
// import style from './style.css'

export default class Home extends Component {
  componentWillMount() {
    const { matches: { name }, fetchRepos } = this.props
    name && fetchRepos(name)
  }

  componentWillReceiveProps(nextProps) {
    const { matches: { name: nextName } } = nextProps
    const { matches: { name }, fetchRepos } = this.props

    if (name !== nextName && nextName.trim()) {
      fetchRepos(nextName)
    }
  }

  render({ repos, openRepo, filters, languages, changeFilter, sorting, changeSorting }) {
    return (
      <div>
        <FilterPanel
          filters={filters}
          languages={languages}
          changeFilter={changeFilter}
        />
        <SortPanel sorting={sorting} changeSorting={changeSorting} />
        <RepoStream repos={repos} openRepo={openRepo} />
      </div>
    )
  }
}
