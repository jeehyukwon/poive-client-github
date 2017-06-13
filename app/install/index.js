const electronSettings = require('electron-settings')

const defaultConf = require('./config.json')
const defaultView = require('./view.json')

function install () {
  // console.log('installing...')
  var conf = {}
  conf.lang = defaultConf.lang
  conf.scale = defaultConf.scale
  conf.defaultTemplate = defaultConf.defaultTemplate
  conf.version = defaultConf.version
  conf.outputDisplay = defaultConf.outputDisplay
  electronSettings.set('poive.conf', conf)

  var view = defaultView
  electronSettings.set('poive.view', view)

  // assets/templates에 저장된 기본 템플릿들을 불러온다
  // console.log('[Poive] Installing default templates...')
  var templates = []
  templates.push(require('./templates/wwdc.json'))
  templates.push(require('./templates/heartofgold.json'))
  electronSettings.set('poive.templates', templates)
  // console.log('install complete')
}

module.exports = install
