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
  has_open_issues: () => open_issues_count,
  has_topics: () => topics.length,
  starred_gt: value => stargazers_count >= value,
  updated_at: value => new Date(pushed_at) > new Date(value),
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


export const buildSearchUrl = (type, value) => {
  const url = new URL(location.href)
  const params = url.searchParams
  const filters = {
    has_open_issues: () => params.has(type) ? params.delete(type) : params.append(type, ''),
    has_topics: () => params.has(type) ? params.delete(type) : params.append(type, ''),
    starred_gt: value => value ? params.set(type, value) :  params.delete(type),
    updated_at: value => value ? params.set(type, value) :  params.delete(type),
    language: value => value ? params.set(type, value) :  params.delete(type),
    type: value => value ? params.set(type, value) :  params.delete(type)
  }
  filters[type](value)
  return url
}
