
// let token: null | string = localStorage.getItem('jwt-token') || null

  function token(): string | null {
    // const expDate = new Date(localStorage.getItem('jwt-token-exp'))
    // if (new Date() > expDate) {
    //   logout()
    //   return null
    // }
    return localStorage.getItem('jwt-token')
  }

  export function isAuthenticated(): boolean {
    return !!token()
  }

  export function login(token = 'test'): void {
    localStorage.setItem('jwt-token', token)
    // const expDate = new Date(new Date().getTime() + +response.time * 1000)
    // localStorage.setItem('jwt-token-exp', expDate.toString())
  }

  export function logout() {
    localStorage.removeItem('jwt-token')
  }
