export const githubLinksParser = linkStr =>
  linkStr
    .split(',')
    .map(rel =>
      rel.split(';').map((curr, idx) => {
        if (idx === 0) return /[^_]page=(\d+)/.exec(curr)[1]
        if (idx === 1) return /rel="(.+)"/.exec(curr)[1]
      })
    )
    .reduce((obj, curr) => {
      obj[curr[1]] = curr[0]
      return obj
    }, {})

export const pickBy = (obj, pick) => {
  return Object.keys(obj).reduce((res, value) => {
    if (pick(obj[value])) {
      return { ...res, [value]: obj[value] }
    }
    return res
  }, {})
}

/** Create filters with data from a repository.
 *	@param {Object} repository
 */
export const createFilters = ({
  open_issues_count,
  topics,
  stargazers_count,
  pushed_at,
  language,
  fork
}) => ({
  hasOpenIssues: () => open_issues_count,
  hasTopics: () => topics.length,
  stars: value => stargazers_count >= value,
  updated: value => new Date(pushed_at) > new Date(value),
  language: value => {
    if (value === 'all') {
      return true
    }
    return language === value
  },
  type: value => {
    if (value === 'all') {
      return true
    }
    const isFork = value === 'forks'
    return isFork === fork
  }
})
