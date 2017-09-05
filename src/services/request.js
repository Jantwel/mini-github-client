const configureData = ([body, headers]) => ({
  body,
  headers: { Link: headers.get('Link') }
})

const checkResponse = response => {
  if (response.status === 404) {
    return Promise.reject('Erorr. Not Found')
  }
  return Promise.all([response.json(), response.headers])
}

const request = (url, options = {}) =>
  fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    ...options
  })
    .then(checkResponse)
    .then(configureData)
    .catch(error => {
      console.error('cath erorr: ', error)
      return { body: [] }
    })

export default request
