import { h, Component } from 'preact'
import RepoStream from 'components/repo-stream'
import FilterPanel from 'components/filter-panel'
import SortPanel from 'components/sort-panel'
import Dialog from 'components/dialog'

export default class Home extends Component {
  state = {}

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

  render({
    repos,
    openRepo,
    filters,
    name,
    languages,
    changeFilter,
    sorting,
    changeSorting,
    repo,
    closeRepo,
    error,
    class: className
  }) {
    return !error
      ? <div class={className}>
        <FilterPanel
          filters={filters}
          languages={languages}
          changeFilter={changeFilter}
        />
        <SortPanel sorting={sorting} changeSorting={changeSorting} />
        <RepoStream repos={repos} openRepo={openRepo} />
        {repo && <Dialog name={name} repoName={repo} closeRepo={closeRepo} />}
      </div>
      : <div>
        <h2>Ooops! Something went wrong :(</h2>
      </div>
  }
}
