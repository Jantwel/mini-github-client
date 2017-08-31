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
