export default {
  username: '',
  repos: [],
  languages: [],
  currentPage: 1,
  filters: {
    has_open_issues: false,
    has_topics: false,
    starred_gt: 0,
    updated_at: '',
    language: '',
    type: 'all'
  },
  sorting: {
    by: 'full_name',
    order: 'asc'
  }
}
