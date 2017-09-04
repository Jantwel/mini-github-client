const configureData = ([body, headers]) => ({
  body,
  headers: { Link: headers.get('Link') }
})

const request = (url, options = {}) =>
  fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    ...options
  })
    .then(response => Promise.all([response.json(), response.headers]))
    .then(configureData)

request.all = urls =>
  urls.map(async url => {
    const { body } = await request(url)
    return body
  })

export default request
