export function throttle(func, limit) {
  let inThrottle

  return function(...args) {
    const context = this

    if (!inThrottle) {
      return func.apply(context, args).catch(error => {
        if (error.response.status === 429) {
          inThrottle = true
          setTimeout(() => {
            inThrottle = false
          }, limit)
        }
      })
    }
  }
}
