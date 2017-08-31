import { h, Component } from 'preact'

const sortingTypes = {
  full_name: 'Repo name',
  stargazers_count: 'Stars',
  open_issues_count: 'Open issues',
  pushed_at: 'Updated date'
}

export default class SortPanel extends Component {
  changeSorting = event => {
    this.props.changeSorting({ ...this.props.sorting, by: event.target.value })
  }

  changeOrder = () => {
    const { sorting } = this.props
    this.props.changeSorting({
      ...sorting,
      order: sorting.order === 'desc' ? 'asc' : 'desc'
    })
  }

  render({ sorting }) {
    const types = Object.keys(sortingTypes)
    return (
      <div>
        <h4>Sort: </h4>
        <div>
          <select name="sort" id="sort" onChange={this.changeSorting}>
            {types.map(type =>
              <option value={type} selected={type === sorting.by}>
                {sortingTypes[type]}
              </option>
            )}
          </select>
          <button onClick={this.changeOrder}>
            {sorting.order === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>
    )
  }
}
