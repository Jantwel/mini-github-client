export const FILTERS = {
  HAS_OPEN_ISSUES: 'has_open_issues',
  HAS_TOPICS: 'has_topics',
  STARS: 'starred_gt',
  UPDATED_AT: 'updated_at',
  LANGUAGE: 'language',
  TYPE: 'type'
}

export const SEARCH_FIELDS = {
  NAME: 'full_name',
  STARS: 'stargazers_count',
  ISSUES: 'open_issues_count',
  UPDATED_AT: 'pushed_at'
}

export default {
  username: '',
  repos: [],
  languages: [],
  currentPage: 1,
  filters: {
    [FILTERS.HAS_OPEN_ISSUES]: false,
    [FILTERS.HAS_TOPICS]: false,
    [FILTERS.STARS]: 0,
    [FILTERS.UPDATED_AT]: '',
    [FILTERS.LANGUAGE]: '',
    [FILTERS.TYPE]: 'all'
  },
  sorting: {
    by: SEARCH_FIELDS.NAME,
    order: 'asc'
  }
}
