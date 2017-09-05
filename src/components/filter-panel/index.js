import { h, Component } from 'preact'
import Category from './filter-category'
import css from './style.scss'

export default class FilterPanel extends Component {
  changeFilter = type => event => {
    this.props.changeFilter({ type, value: event.target.checked })
  }

  changeStars = type => event => {
    this.props.changeFilter({ type, value: event.target.value })
  }

  changeDate = type => event => {
    this.props.changeFilter({ type, value: event.target.value })
  }

  filterLanguage = event => {
    event.preventDefault()
    this.props.changeFilter({ type: 'language', value: event.target.value })
  }

  changeType = event => {
    this.props.changeFilter({ type: 'type', value: event.target.value })
  }

  render({ filters, languages }) {
    return (
      <div class={css.filtersPanel}>
        <h4>Filters: </h4>
        <div>
          <Category title="Stars">
            <input
              type="number"
              id="stars"
              value={filters.starred_gt}
              onChange={this.changeStars('starred_gt')}
            />
          </Category>
          <Category title="Updated after">
            <input
              type="date"
              id="lastUpdated"
              value={filters.updated_at}
              onChange={this.changeDate('updated_at')}
            />
          </Category>
          <Category title="Types">
            <div>
              <input
                type="radio"
                id="allTypes"
                checked={filters.type === 'all'}
                onClick={this.changeType}
                name="all types"
                value="all"
              />
              <label for="allTypes">All</label>
            </div>
            <div>
              <input
                type="radio"
                id="forks"
                checked={filters.type === 'forks'}
                onClick={this.changeType}
                name="forks"
                value="forks"
              />
              <label for="forks">Forks</label>
            </div>
            <div>
              <input
                type="radio"
                id="sources"
                checked={filters.type === 'sources'}
                onClick={this.changeType}
                name="sources"
                value="sources"
              />
              <label for="sources">Sources</label>
            </div>
          </Category>
          <Category title="Language">
            <select
              name="languages"
              id="languages"
              onChange={this.filterLanguage}
            >
              <option value="all">All</option>
              {languages.map(language =>
                <option value={language}>
                  {language}
                </option>
              )}
            </select>
          </Category>
          <Category title="Other">
            <div>
              <input
                type="checkbox"
                id="hasOpenIssues"
                checked={filters.has_open_issues}
                onClick={this.changeFilter('has_open_issues')}
                name="issues"
                value="issues"
              />
              <label for="hasOpenIssues">Has open issues</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="hasTopics"
                checked={filters.has_topics}
                onClick={this.changeFilter('has_topics')}
                name="topics"
                value="topics"
              />
              <label for="hasTopics">Has topics</label>
            </div>
          </Category>
        </div>
      </div>
    )
  }
}
