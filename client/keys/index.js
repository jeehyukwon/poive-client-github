import globalKeys from 'keys/global'
import controlKeys from 'keys/control'
import timelineKeys from 'keys/timeline'

function addKeyEventListener (store) {
  globalKeys(store)
  controlKeys(store)
  timelineKeys(store)
}

export default addKeyEventListener
