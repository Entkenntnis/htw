function goBack() {
  if (document.referrer && document.referrer.includes('/map')) {
    window.history.back()
  } else {
    window.location.href = '/map'
  }
}