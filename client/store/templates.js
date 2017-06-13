import fs from 'fs'
import electronSettings from 'electron-settings'
import { remote } from 'electron'
const { dialog } = remote

export default {
  state: {
    templates: []
  },
  getters: {},
  mutations: {
    installTemplate (state) {
      dialog.showOpenDialog({
        filters: [
          { name: 'Poive 템플릿', extensions: ['json'] }
        ]
      }, function (filenames) {
        if (filenames !== undefined) {
          fs.readFile(filenames[0], 'utf-8', function (err, data) {
            if (err) {
              window.alert('파일을 읽어오는 중에 오류가 발생했습니다. :' + err.message)
              return
            } else {
              state.templates.push(JSON.parse(data))
            }
          })
        }
      })
      electronSettings.set('poive.templates', state.templates)
    },
    changeDefaultTemplate (state, i) {
      state.conf.defaultTemplate = i
      electronSettings.set('poive.conf.defaultTemplate', i)
    },
    deleteTemplate (state, pk) {
      state.templates.splice(pk, 1)
      electronSettings.set('poive.templates', state.templates)
    }
  },
  actions: {
  }
}
