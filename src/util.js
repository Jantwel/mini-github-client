import { FILTERS } from 'components/initial-state'

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
  [FILTERS.HAS_OPEN_ISSUES]: () => open_issues_count,
  [FILTERS.HAS_TOPICS]: () => topics.length,
  [FILTERS.STARS]: value => stargazers_count >= value,
  [FILTERS.UPDATED_AT]: value => new Date(pushed_at) > new Date(value),
  [FILTERS.LANGUAGE]: value => {
    if (value === 'all') {
      return true
    }
    if (!language && value === 'None') {
      return true
    }
    return language === value
  },
  [FILTERS.TYPE]: value => {
    if (value === 'all') {
      return true
    }
    const isFork = value === 'forks'
    return isFork === fork
  }
})

export const buildFiltersUrl = (type, value) => {
  const url = new URL(location.href)
  const params = url.searchParams
  const filtersActions = {
    [FILTERS.HAS_OPEN_ISSUES]: () =>
      params.has(type) ? params.delete(type) : params.append(type, ''),
    [FILTERS.HAS_TOPICS]: () =>
      params.has(type) ? params.delete(type) : params.append(type, ''),
    [FILTERS.STARS]: value =>
      value ? params.set(type, value) : params.delete(type),
    [FILTERS.UPDATED_AT]: value =>
      value ? params.set(type, value) : params.delete(type),
    [FILTERS.LANGUAGE]: value =>
      value ? params.set(type, value) : params.delete(type),
    [FILTERS.TYPE]: value =>
      value ? params.set(type, value) : params.delete(type)
  }
  filtersActions[type](value)
  return url
}

export const getLanguages = repos =>
  repos.reduce((result, { language }) => {
    if (result.includes(language)) {
      return result
    }
    return [...result, language || 'None']
  }, [])
