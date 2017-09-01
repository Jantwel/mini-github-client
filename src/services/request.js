const configureData = ([body, headers]) => ({
  body,
  headers: { Link: headers.get('Link') }
})

export default (url, options = {}) =>
  fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    ...options
  })
    .then(response => Promise.all([response.json(), response.headers]))
    .then(configureData)
