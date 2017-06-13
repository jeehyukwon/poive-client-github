import $ from 'jquery'
import fs from 'fs'

import { ipcRenderer, remote } from 'electron'

const { dialog } = remote

export default {
  state: {
    sheet: {
      groups: [],
      selected: {
        groupNum: 0,
        sceneNum: 0,
        slideNum: 0
      },
      playing: {
        groupNum: 0,
        sceneNum: 0,
        slideNum: 0
      },
      filter: '',
      path: false,
      isModified: false
    }
  },
  getters: {
    filename: state => (state.sheet.path) ? state.sheet.path.split('\\').pop().split('/').pop().split('.')[0] : state.lang[state.conf.lang].top.file.untitled,
    groups: state => state.sheet.groups,
    selected: state => state.sheet.selected,
    playing: state => state.sheet.playing,
    selectedSlide (state) {
      if (state.sheet.groups[state.sheet.selected.groupNum] === undefined ||
          state.sheet.groups[state.sheet.selected.groupNum].scenes[state.sheet.selected.sceneNum] === undefined ||
          state.sheet.groups[state.sheet.selected.groupNum].scenes[state.sheet.selected.sceneNum].slides[state.sheet.selected.slideNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.selected.groupNum].scenes[state.sheet.selected.sceneNum].slides[state.sheet.selected.slideNum]
      }
    },
    selectedScene (state) {
      if (state.sheet.groups[state.sheet.selected.groupNum] === undefined ||
          state.sheet.groups[state.sheet.selected.groupNum].scenes[state.sheet.selected.sceneNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.selected.groupNum].scenes[state.sheet.selected.sceneNum]
      }
    },
    selectedGroup (state) {
      if (state.sheet.groups[state.sheet.selected.groupNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.selected.groupNum]
      }
    },
    selectedSlideElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.selected.groupNum).find('ul.scenes > .scene').eq(state.sheet.selected.sceneNum).find('.slides .slide').eq(state.sheet.selected.slideNum)
    },
    selectedSlideElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.selected.groupNum).find('.scenes > .scene').eq(state.sheet.selected.sceneNum).find('.slides .slide-timeline').eq(state.sheet.selected.slideNum)
    },
    selectedSceneElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.selected.groupNum).find('ul.scenes > .scene').eq(state.sheet.selected.sceneNum)
    },
    selectedSceneElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.selected.groupNum).find('.scenes > .scene').eq(state.sheet.selected.sceneNum)
    },
    selectedGroupElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.selected.groupNum)
    },
    selectedGroupElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.selected.groupNum)
    },
    playingSlide (state) {
      if (state.sheet.groups[state.sheet.playing.groupNum] === undefined ||
          state.sheet.groups[state.sheet.playing.groupNum].scenes[state.sheet.playing.sceneNum] === undefined ||
          state.sheet.groups[state.sheet.playing.groupNum].scenes[state.sheet.playing.sceneNum].slides[state.sheet.playing.slideNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.playing.groupNum].scenes[state.sheet.playing.sceneNum].slides[state.sheet.playing.slideNum]
      }
    },
    playingScene (state) {
      if (state.sheet.groups[state.sheet.playing.groupNum] === undefined ||
          state.sheet.groups[state.sheet.playing.groupNum].scenes[state.sheet.playing.sceneNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.playing.groupNum].scenes[state.sheet.playing.sceneNum]
      }
    },
    playingGroup (state) {
      if (state.sheet.groups[state.sheet.playing.groupNum] === undefined) {
        return false
      } else {
        return state.sheet.groups[state.sheet.playing.groupNum]
      }
    },
    playingSlideElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.playing.groupNum).find('ul.scenes > .scene').eq(state.sheet.playing.sceneNum).find('.slides .slide').eq(state.sheet.playing.slideNum)
    },
    playingSlideElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.playing.groupNum).find('.scenes > .scene').eq(state.sheet.playing.sceneNum).find('.slides .slide-timeline').eq(state.sheet.playing.slideNum)
    },
    playingSceneElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.playing.groupNum).find('ul.scenes > .scene').eq(state.sheet.playing.sceneNum)
    },
    playingSceneElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.playing.groupNum).find('.scenes > .scene').eq(state.sheet.playing.sceneNum)
    },
    playingGroupElementInControl (state) {
      return $('#control > .control-main > .control-slides').find('ul.groups > .group').eq(state.sheet.playing.groupNum)
    },
    playingGroupElementInTimeline (state) {
      return $('#timeline > .timeline-wrapper').find('.groups > .group').eq(state.sheet.playing.groupNum)
    }
  },
  mutations: {
    updateSheet (state, obj) {
      state.sheet.groups = obj.groups
      state.sheet.playing = obj.playing
      state.sheet.selected = obj.selected
      state.sheet.filter = obj.filter
    },
    updateGroups (state, obj) {
      state.sheet.groups = obj
    },
    eraseSceneMarkdown (state, data) {
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].markdown.text = ''
    },
    setSceneTemplate (state, data) { // data = groupNum, sceneNum, template
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].style = data.template.sceneStyle
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].obj = JSON.parse(JSON.stringify(data.template.sceneObj))
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].template = data.template
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].selectedTemplate = state.templates.indexOf(data.template)
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].markdown.layoutNum = data.template.defaultSlideLayout
    },
    setSlideLayout (state, data) { // data = groupNum, sceneNum, slideNum, layoutNum
      if (data.layoutNum !== -1) {
        var layout = state.sheet.groups[data.groupNum].scenes[data.sceneNum].template.slideLayout[data.layoutNum]
        var slide = state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum]
        slide.selectedLayout = data.layoutNum
        slide.layout.title = layout.title
        slide.layout.obj = layout.obj
        // slide.isSceneObj = true
        for (var i = 0; i < Math.max(layout.obj.length, slide.obj.length); i++) {
          // 만약 슬라이드에 오브젝트가 부족하다면 추가
          if (!slide.obj[i]) {
            slide.obj.push(JSON.parse(JSON.stringify(layout.obj[i])))
          // 만약 슬라이드에 오브젝트가 남는다면 삭제
          } else if (!layout.obj[i]) {
            slide.obj.splice(i, 1)
            i--
          // 존재하는 오브젝트에 타이틀, 타입, 스타일을 첨가해줌
          } else {
            if (slide.obj[i].type === 'image' && layout.obj[i].type !== 'image') {
              slide.obj[i].img = ''
            }
            slide.obj[i].title = layout.obj[i].title
            slide.obj[i].typeSelectable = layout.obj[i].typeSelectable
            slide.obj[i].type = layout.obj[i].type
            slide.obj[i].editable = layout.obj[i].editable
            slide.obj[i].style = layout.obj[i].style
            slide.obj[i].styleSelectable = layout.obj[i].styleSelectable
            slide.obj[i].isAltStyle = layout.obj[i].isAltStyle
            slide.obj[i].altStyle = layout.obj[i].altStyle
          }
        }
      }
    },
    addSlide (state, data) {
      var objects = ((data.objects === undefined) ? [] : data.objects)
      const slide = {
        obj: objects,
        isSceneObj: true,
        selectedLayout: 0,
        layout: {
          title: '',
          ignoreSceneObj: false,
          obj: []
        }
      }
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.push(slide)
    },
    addScene (state, groupNum) {
      const scene = {
        title: state.lang[state.conf.lang].control.sheet.newScene,
        obj: [],
        template: null,
        style: { backgroundColor: 'black' },
        selectedTemplate: 0,
        slides: [],
        markdown: {
          layoutNum: 0,
          text: ''
        }
      }
      state.sheet.groups[groupNum].scenes.push(scene)
    },
    addGroup (state) {
      const group = {
        title: state.lang[state.conf.lang].control.sheet.newGroup,
        scenes: []
      }
      state.sheet.groups.push(group)
    },
    deleteGroup (state, data) {
      state.sheet.groups.splice(data.groupNum, 1)
    },
    deleteScene (state, data) {
      state.sheet.groups[data.groupNum].scenes.splice(data.sceneNum, 1)
    },
    deleteSlide (state, data) {
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.splice(data.slideNum, 1)
    },
    insertScene (state, data) {
      state.sheet.groups[data.groupNum].scenes.splice(data.sceneNum, 0, data.scene)
    },
    deleteAndInsertScene (state, data) {
      state.sheet.groups[data.beforeGroupNum].scenes.splice(data.beforeSceneNum, 1)
      state.sheet.groups[data.afterGroupNum].scenes.splice(data.afterSceneNum, 0, data.scene)
    },
    insertSlide (state, data) {
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.splice(data.slideNum, 0, data.slide)
    },
    deleteAndInsertSlide (state, data) {
      state.sheet.groups[data.beforeGroupNum].scenes[data.beforeSceneNum].slides.splice(data.beforeSlideNum, 1)
      state.sheet.groups[data.afterGroupNum].scenes[data.afterSceneNum].slides.splice(data.afterSlideNum, 0, data.slide)
    },
    extendSceneSlides (state, data) {
      state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.push.apply(state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides, data.slides)
    }
  },
  actions: {
    select ({ state, commit, dispatch }, data) {
      if (data.groupNum === state.sheet.selected.groupNum &&
          data.sceneNum === state.sheet.selected.sceneNum &&
          data.slideNum === state.sheet.selected.slideNum &&
          data.sceneNum !== -1 && data.slideNum !== -1) {
        dispatch('play', {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: data.slideNum
        })
      } else {
        state.sheet.selected = {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: data.slideNum
        }
      }
      // $('#control').focus()
    },
    scrollToPlaying ({ state, getters }) {
      const control = $('#control > .control-main > .control-slides')
      const timeline = $('#timeline > .timeline-wrapper')
      const slideElementInControl = getters.playingSlideElementInControl
      const slideElementInTimeline = getters.playingSlideElementInTimeline
      control.stop().animate({}, 300)
      timeline.stop().animate({}, 300)
      control.animate({
        scrollTop: slideElementInControl.offset().top + control.scrollTop() - (control.height() / 2) + (slideElementInControl.height() / 2) - control.offset().top,
        scrollLeft: slideElementInControl.offset().left + control.scrollLeft() - (control.width() / 2) + (slideElementInControl.width() / 2) - control.offset().left
      }, 300)
      timeline.animate({
        scrollLeft: slideElementInTimeline.offset().left + timeline.scrollLeft() - (timeline.width() / 2) + (slideElementInTimeline.width() / 2) - timeline.offset().left
      }, 300)
    },
    scrollToSelected ({ state, getters }) {
      const control = $('#control > .control-main > .control-slides')
      const timeline = $('#timeline > .timeline-wrapper')
      const slideElementInControl = getters.selectedSlideElementInControl
      const slideElementInTimeline = getters.selectedSlideElementInTimeline
      // console.log(slideElementInControl)
      control.stop().animate({}, 300)
      timeline.stop().animate({}, 300)
      control.animate({
        scrollTop: slideElementInControl.offset().top + control.scrollTop() - (control.height() / 2) + (slideElementInControl.height() / 2) - control.offset().top,
        scrollLeft: slideElementInControl.offset().left + control.scrollLeft() - (control.width() / 2) + (slideElementInControl.width() / 2) - control.offset().left
      }, 300)
      timeline.animate({
        scrollLeft: slideElementInTimeline.offset().left + timeline.scrollLeft() - (timeline.width() / 2) + (slideElementInTimeline.width() / 2) - timeline.offset().left
      }, 300)
    },
    play ({ state, commit, getters, dispatch }, data) {
      if (data.sended === undefined) {
        state.sheet.playing = {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: data.slideNum
        }
        if (state.output.isPlaying) {
          if (state.output.isOutputScreen) {
            ipcRenderer.send('sendIndexBack', state.sheet.playing)
          } else {
            // console.log('sended')
            ipcRenderer.send('sendIndex', state.sheet.playing)
          }
        }
      } else {
        state.sheet.playing = {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: data.slideNum
        }
        if (!state.output.isOutputScreen) {
          dispatch('scrollToPlaying')
        }
      }
    },
    addGroupAndSet ({ commit, dispatch, state }) {
      commit('addGroup')
      dispatch('select', {
        groupNum: state.sheet.groups.length - 1,
        sceneNum: -1,
        slideNum: -1
      })
    },
    addSceneAndSet ({ commit, dispatch, state }, groupNum) {
      commit('addScene', groupNum)
      var sceneNum = state.sheet.groups[groupNum].scenes.length - 1
      commit('setSceneTemplate', {
        groupNum: groupNum,
        sceneNum: sceneNum,
        template: (state.templates[state.conf.defaultTemplate] === undefined) ? state.templates[0] : state.templates[state.conf.defaultTemplate]
      })
      commit('addSlide', {
        groupNum: groupNum,
        sceneNum: sceneNum
      })
      commit('setSlideLayout', {
        groupNum: groupNum,
        sceneNum: sceneNum,
        slideNum: 0,
        layoutNum: state.templates[state.conf.defaultTemplate].defaultSlideLayout
      })
      dispatch('select', {
        groupNum: groupNum,
        sceneNum: sceneNum,
        slideNum: -1
      })
      state.view.inspectorTab = 0
      state.view.inspector = true
    },
    addSlideAndSet ({ commit, dispatch, state }, data) {
      commit('addSlide', {
        groupNum: data.groupNum,
        sceneNum: data.sceneNum
      })
      commit('setSlideLayout', {
        groupNum: data.groupNum,
        sceneNum: data.sceneNum,
        slideNum: state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length - 1,
        layoutNum: state.sheet.groups[data.groupNum].scenes[data.sceneNum].template.defaultSlideLayout
      })
      dispatch('select', {
        groupNum: data.groupNum,
        sceneNum: data.sceneNum,
        slideNum: state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length - 1
      })
      state.view.inspectorTab = 1
      state.view.inspector = true
    },
    setSceneTemplateAndSet ({ commit, state }, data) {
      commit('setSceneTemplate', {
        groupNum: data.groupNum,
        sceneNum: data.sceneNum,
        template: data.template
      })
      for (var i = 0; i < state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length; i++) {
        commit('setSlideLayout', {
          groupNum: data.groupNum,
          sceneNum: data.sceneNum,
          slideNum: i,
          layoutNum: state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[i].selectedLayout
        })
      }
    },
    setSlideLayoutAndSet ({ commit }, data) {
      commit('setSlideLayout', data)
    },
    saveSheet ({ commit, state }) {
      const sheet = state.sheet
      if (state.sheet.path !== false) {
        fs.writeFile(state.sheet.path, JSON.stringify(sheet), 'utf8', function (err) {
          if (err) {
            window.alert('파일을 쓰는 중에 오류가 발생했습니다. ' + err.message)
            return
          }
          state.sheet.isModified = false
          commit('updateSheet', sheet)
        })
      } else {
        setTimeout(() => {
          dialog.showSaveDialog({
            filters: [
              { name: 'Poive Sheet', extensions: ['pvd'] }
            ]
          }, function (path) {
            if (path === undefined) {
              return
            }
            fs.writeFile(path, JSON.stringify(sheet), 'utf8', function (err) {
              if (err) {
                window.alert('파일을 쓰는 중에 오류가 발생했습니다. ' + err.message)
              }
              state.sheet.path = path
              state.sheet.isModified = false
              commit('updateSheet', sheet)
            })
          })
        }, 10)
      }
    },
    saveAsSheet ({ commit, state }) {
      const sheet = state.sheet
      dialog.showSaveDialog({
        filters: [
          { name: 'Poive 시트', extensions: ['pvd'] }
        ]
      }, function (path) {
        if (path === undefined) {
          return
        }
        fs.writeFile(path, JSON.stringify(sheet), 'utf8', function (err) {
          if (err) {
            window.alert('파일을 쓰는 중에 오류가 발생했습니다. ' + err.message)
          }
          state.sheet.path = path
          state.sheet.isModified = false
          commit('updateSheet', sheet)
        })
      })
    },
    newSheet ({ commit, dispatch, state }) {
      dispatch('playOff')
      state.sheet.groups = []
      dispatch('addGroupAndSet')
      dispatch('addSceneAndSet', 0)
      state.sheet.filter = ''
      state.sheet.path = false
      state.sheet.isModified = false
      dispatch('select', {
        groupNum: 0,
        sceneNum: 0,
        slideNum: 0
      })
    },
    openSheet ({ commit, dispatch, state }) {
      let sheet, path
      dialog.showOpenDialog({
        filters: [
          { name: 'Poive 시트', extensions: ['pvd'] }
        ]
      }, function (filenames) {
        if (filenames !== undefined) {
          fs.readFile(filenames[0], 'utf8', function (err, data) {
            if (err) {
              window.alert('파일을 읽어오는 중에 오류가 발생했습니다. :' + err.message)
              return
            }
            sheet = JSON.parse(data)
            path = filenames[0]
            dispatch('playOff')
            state.sheet.path = path
            state.sheet.isModified = false
            commit('updateSheet', sheet)
            dispatch('play', {
              groupNum: 0,
              sceneNum: 0,
              slideNum: 0
            })
            dispatch('select', {
              groupNum: 0,
              sceneNum: 0,
              slideNum: 0
            })
          })
        }
      })
    },
    nextSlide ({ commit, dispatch, state }, data = (state.output.isPlaying) ? {
      groupNum: state.sheet.playing.groupNum,
      sceneNum: state.sheet.playing.sceneNum,
      slideNum: state.sheet.playing.slideNum
    } : {
      groupNum: state.sheet.selected.groupNum,
      sceneNum: state.sheet.selected.sceneNum,
      slideNum: state.sheet.selected.slideNum
    }) {
      // console.log('next')
      if (state.sheet.groups[data.groupNum].scenes[data.sceneNum] !== undefined && data.slideNum < state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length - 1) {
        // 해당 번호에 씬이 존재하고 속한 씬에 마지막 슬라이드가 아닌 경우
        // 슬라이드 번호를 높이고 플레이 한다
        data.slideNum++
        if (state.output.isPlaying) {
          dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
          if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
        } else {
          dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
          if (!state.output.isOutputScreen) dispatch('scrollToSelected')
        }
      } else if (state.sheet.groups[data.groupNum] !== undefined && data.sceneNum < state.sheet.groups[data.groupNum].scenes.length - 1) {
        // 해당 번호에 그룹이 존재하고 속한 그룹에 마지막 씬이 아닌 경우
        // 씬 번호를 하나 높인 뒤 첫번째 슬라이드를 선택한다
        data.sceneNum++
        data.slideNum = 0
        if (state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum] === undefined) {
          // 만약 그 슬라이드가 없는 경우
          // 다음 슬라이드를 호출한다
          dispatch('nextSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else {
          // 만약 그 슬라이드가 있는 경우
          // 플레이 한다
          if (state.output.isPlaying) {
            dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
          } else {
            dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToSelected')
          }
        }
      } else if (data.groupNum < state.sheet.groups.length - 1) {
        // 전체 시트에 마지막 그룹이 아닌 경우
        // 그룹 번호를 하나 높이고 첫번째 씬에 첫번째 슬라이드를 선택한다
        data.groupNum++
        data.sceneNum = 0
        data.slideNum = 0
        if (state.sheet.groups[data.groupNum].scenes[0] === undefined) {
          // 만약 그 씬이 없을 경우
          // 다음 슬라이드를 호출한다
          dispatch('nextSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else if (state.sheet.groups[data.groupNum].scenes[0].slides[0] === undefined) {
          // 만약 그 슬라이드가 없을 경우
          // 다음 슬라이드를 호출한다
          dispatch('nextSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else {
          // 있는 경우
          // 플레이 한다
          if (state.output.isPlaying) {
            dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
          } else {
            dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToSelected')
          }
        }
      } else {
      // 위의 사항에 모두 해당하지 않는다면
      // 마지막 슬라이드
      }
    },
    prevSlide ({ commit, dispatch, state }, data = (state.output.isPlaying) ? {
      groupNum: state.sheet.playing.groupNum,
      sceneNum: state.sheet.playing.sceneNum,
      slideNum: state.sheet.playing.slideNum
    } : {
      groupNum: state.sheet.selected.groupNum,
      sceneNum: state.sheet.selected.sceneNum,
      slideNum: state.sheet.selected.slideNum
    }) {
      // console.log('prev')
      if (state.sheet.groups[data.groupNum].scenes[data.sceneNum] !== undefined && data.slideNum > 0) {
        // 해당 번호에 씬이 존재하고 속한 씬에 첫번째 슬라이드가 아닌 경우
        // 슬라이드 번호를 내리고 플레이 한다
        data.slideNum--
        if (state.output.isPlaying) {
          dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
          if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
        } else {
          dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
          if (!state.output.isOutputScreen) dispatch('scrollToSelected')
        }
      } else if (state.sheet.groups[data.groupNum] !== undefined && data.sceneNum > 0) {
        // 해당 번호에 그룹이 존재하고 속한 그룹에 첫번째 씬이 아닌 경우
        // 씬 번호를 하나 낮춘 뒤 해당 씬의 마지막 슬라이드를 선택한다
        data.sceneNum--
        data.slideNum = state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length - 1
        if (state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum] === undefined) {
          // 만약 그 슬라이드가 없는 경우
          // 이전 슬라이드를 호출한다
          dispatch('prevSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else {
          // 있는 경우
          // 플레이 한다
          if (state.output.isPlaying) {
            dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
          } else {
            dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToSelected')
          }
        }
      } else if (data.groupNum > 0) {
        // 전체 시트에 첫번째 그룹이 아닌 경우
        // 그룹 번호를 하나 내리고 해당 그룹 마지막 씬을 선택한다
        data.groupNum--
        data.sceneNum = state.sheet.groups[data.groupNum].scenes.length - 1

        if (state.sheet.groups[data.groupNum].scenes[data.sceneNum] !== undefined) {
          // 만약 그 씬이 존재한다면
          // 그 씬의 마지막 슬라이드를 선택한다
          data.slideNum = state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides.length - 1
        } else {
          // 존재하지 않으면 가상의 슬라이드 번호 -1을 넣어준다
          data.slideNum = -1
        }
        if (state.sheet.groups[data.groupNum].scenes[data.sceneNum] === undefined) {
          // 만약 그 씬이 없을 경우 (sl == -1)
          // 이전 슬라이드를 호출한다
          dispatch('prevSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else if (state.sheet.groups[data.groupNum].scenes[data.sceneNum].slides[data.slideNum] === undefined) {
          // 만약 그 슬라이드가 없을 경우
          // 이전 슬라이드를 호출한다
          dispatch('prevSlide', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
        } else {
          if (state.output.isPlaying) {
            dispatch('play', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToPlaying')
          } else {
            dispatch('select', { groupNum: data.groupNum, sceneNum: data.sceneNum, slideNum: data.slideNum })
            if (!state.output.isOutputScreen) dispatch('scrollToSelected')
          }
        }
      } else {
      // 위의 사항에 모두 해당하지 않는다면
      // 첫번째 슬라이드
      }
    }
  }
}
