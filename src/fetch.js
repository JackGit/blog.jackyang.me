function parseResponse (response) {
  return Promise.all([response.status,response.statusText, response.json()])
}

function checkStatus ([status, statusText, data]) {
  if (status >= 200 && status < 300) {
    return data
  } else if (status === 401) {
    window.location.href = window.location.origin + window.location.pathname
  } else {
    let error = new Error(data.error)
    error.status = status
    error.errorMessage = data.error || 'unknown error'
    return Promise.reject(error)
  }
}

function getUserToken () {
  return localStorage ? localStorage.getItem('userToken') : ''
}

function getUserId () {
  return localStorage ? localStorage.getItem('userId') : ''
}

export default {
  get (url, params = {}, headers = {}) {
    let reqHeaders = new Headers()
    let queries = []

    reqHeaders.append('Accept', 'application/json')
    reqHeaders.append('Authentication', getUserToken())
    reqHeaders.append('User-ID', getUserId())
    Object.keys(params).forEach(param => {
      queries.push(`${param}=${encodeURIComponent(params[param])}`)
    })

    url = queries.length ? url + '?' + queries.join('&') : url
    console.log('fetch.get', url)

    return fetch(url, {
      method: 'GET',
      headers: reqHeaders,
      credentials:"include",
      cache: 'default',
      mode:'cors'
    }).then(parseResponse).then(checkStatus)
  },

  post (url, request = {}, headers = {}) {
    let reqHeaders = new Headers()
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    reqHeaders.append('Authentication', getUserToken())
    reqHeaders.append('User-ID', getUserId())
    console.log('fetch.post', url, request)
    return fetch(url, {
      method: 'POST',
      headers: headers,
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(request)
    }).then(parseResponse).then(checkStatus)
  },

  patch (url, request = {}, headers = {}) {
    let reqHeaders = new Headers()
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    reqHeaders.append('Authentication', getUserToken())
    reqHeaders.append('User-ID', getUserId())
    console.log('fetch.patch', url, request)
    return fetch(url, {
      method: 'PATCH',
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(request)
    }).then(parseResponse).then(checkStatus)
  },

  put (url, request = {}, headers = {}) {
    let reqHeaders = new Headers()
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    reqHeaders.append('Authentication', getUserToken())
    reqHeaders.append('User-ID', getUserId())
    console.log('fetch.put', url, request)
    return fetch(url, {
      method: 'PUT',
      headers: reqHeaders,
      credentials:"include",
      mode:'cors',
      body: JSON.stringify(request)
    }).then(parseResponse).then(checkStatus)
  },

  delete (url, headers = {}) {
    let reqHeaders = new Headers()
    reqHeaders.append('Content-Type', 'application/json')
    reqHeaders.append('Accept', 'application/json')
    reqHeaders.append('Authentication', getUserToken())
    reqHeaders.append('User-ID', getUserId())
    console.log('fetch.delete', url)
    return fetch(url, {
      method: 'DELETE',
      credentials:"include",
      headers: reqHeaders,
      mode:'cors'
    }).then(parseResponse).then(checkStatus)
  }
}
