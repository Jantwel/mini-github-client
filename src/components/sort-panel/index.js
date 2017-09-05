import { h, Component } from 'preact'
import { SEARCH_FIELDS } from '../initial-state'
import css from './style.scss'

const sortingTypes = {
  [SEARCH_FIELDS.NAME]: 'Repo name',
  [SEARCH_FIELDS.STARS]: 'Stars',
  [SEARCH_FIELDS.ISSUES]: 'Open issues',
  [SEARCH_FIELDS.UPDATED_AT]: 'Updated date'
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
      <div class={css.sortPanel}>
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
