import $ from 'jquery'

export default {
  state: {
    context: {
      isActive: false,
      items: []
    },
    contexts: {
      copiedSlide: false
    }
  },
  getters: {},
  mutations: {
    openContext (state, args) {
      state.context.items = args.items
      $('#context-menu').css('top', args.event.clientY)
      $('#context-menu').css('left', args.event.clientX)
      state.context.isActive = true
    }
  },
  actions: {
    copySlide ({ state, getters, commit, dispatch }, data) {
      if (data === undefined) {
        state.contexts.copiedSlide = JSON.parse(JSON.stringify(getters.selectedSlide))
      } else {
        state.contexts.copiedSlide = JSON.parse(JSON.stringify(state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum]))
      }
    },
    cutSlide ({ state, getters, commit, dispatch }, data) {
      if (data === undefined) {
        state.contexts.copiedSlide = JSON.parse(JSON.stringify(getters.selectedSlide))
        commit('deleteSlide', {
          groupNum: state.sheet.selected.groupNum,
          sceneNum: state.sheet.selected.sceneNum,
          slideNum: state.sheet.selected.slideNum
        })
      } else {
        state.contexts.copiedSlide = JSON.parse(JSON.stringify(state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum]))
        commit('deleteSlide', {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: data.slideNum
        })
      }
    },
    pasteSlide ({ state, getters, commit, dispatch }, data) {
      if (state.contexts.copiedSlide !== false) {
        if (data === undefined) {
          if (getters.selectedSlide) {
            commit('insertSlide', {
              groupNum: state.sheet.selected.groupNum,
              sceneNum: state.sheet.selected.sceneNum,
              slideNum: state.sheet.selected.slideNum + 1,
              slide: JSON.parse(JSON.stringify(state.contexts.copiedSlide))
            })
            dispatch('select', {
              groupNum: state.sheet.selected.groupNum,
              sceneNum: state.sheet.selected.sceneNum,
              slideNum: state.sheet.selected.slideNum + 1
            })
          } else if (getters.selectedScene) {
            commit('insertSlide', {
              groupNum: state.sheet.selected.groupNum,
              sceneNum: state.sheet.selected.sceneNum,
              slideNum: 0,
              slide: JSON.parse(JSON.stringify(state.contexts.copiedSlide))
            })
            dispatch('select', {
              groupNum: state.sheet.selected.groupNum,
              sceneNum: state.sheet.selected.sceneNum,
              slideNum: 0
            })
          }
        } else {
          commit('insertSlide', {
            groupNum: data.groupNum,
            sceneNum: data.sceneNum,
            slideNum: data.slideNum + 1,
            slide: JSON.parse(JSON.stringify(state.contexts.copiedSlide))
          })
        }
      }
    }
  }
}
