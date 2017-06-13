import $ from 'jquery'

function addKeyEventListener (store) {
  $(window).keydown((event) => {
    if (event.which === 37) {
      event.preventDefault()
      store.dispatch('prevSlide')
    } else if (event.which === 38) {
      event.preventDefault()
      store.dispatch('prevSlide')
    } else if (event.which === 39) {
      event.preventDefault()
      store.dispatch('nextSlide')
    } else if (event.which === 40) {
      event.preventDefault()
      store.dispatch('nextSlide')
    } else if (event.which === 27) {
      event.preventDefault()
      self.close()
    }
  })
}

export default addKeyEventListener
