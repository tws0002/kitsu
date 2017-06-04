import peopleApi from '../api/people'
import {
  LOAD_PEOPLE_START,
  LOAD_PEOPLE_ERROR,
  LOAD_PEOPLE_END,

  DELETE_PEOPLE_START,
  DELETE_PEOPLE_ERROR,
  DELETE_PEOPLE_END,
  SHOW_DELETE_PEOPLE_MODAL,
  HIDE_DELETE_PEOPLE_MODAL,

  EDIT_PEOPLE_START,
  EDIT_PEOPLE_ERROR,
  EDIT_PEOPLE_END,
  SHOW_EDIT_PEOPLE_MODAL,
  HIDE_EDIT_PEOPLE_MODAL,

  RESET_ALL
} from '../mutation-types'

const state = {
  people: [],
  isPeopleLoading: false,
  isPeopleLoadingError: true,

  isDeleteModalShown: false,
  isDeleteLoading: false,
  isDeleteLoadingError: false,
  personToDelete: undefined,

  isEditModalShown: false,
  isEditLoading: false,
  isEditLoadingError: false,
  personToEdit: {}
}

const getters = {
  people: state => state.people,
  isPeopleLoading: state => state.isPeopleLoading,
  isPeopleLoadingError: state => state.isPeopleLoadingError,

  isDeleteModalShown: state => state.isDeleteModalShown,
  isDeleteLoading: state => state.isDeleteLoading,
  isDeleteLoadingError: state => state.isDeleteLoadingError,
  personToDelete: state => state.personToDelete,

  isEditModalShown: state => state.isEditModalShown,
  isEditLoading: state => state.isEditLoading,
  isEditLoadingError: state => state.isEditLoadingError,
  personToEdit: state => state.personToEdit
}

const actions = {
  loadPeople ({ commit, state }, callback) {
    commit(LOAD_PEOPLE_START)
    peopleApi.getPeople((err, people) => {
      if (err) {
        commit(LOAD_PEOPLE_ERROR)
      } else {
        commit(LOAD_PEOPLE_END, people.map((person) => {
          person.departments = person.departments || ''
          return person
        }))
      }
      if (callback) callback(err)
    })
  },

  editPeople ({ commit, state }, payload) {
    commit(EDIT_PEOPLE_START, payload.data)
    peopleApi.updatePerson(state.personToEdit, (err, people) => {
      if (err) {
        commit(EDIT_PEOPLE_ERROR)
      } else {
        commit(EDIT_PEOPLE_END)
        commit(HIDE_EDIT_PEOPLE_MODAL)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  deletePeople ({ commit, state }, callback) {
    commit(DELETE_PEOPLE_START)
    peopleApi.deletePerson(state.personToDelete.id, (err, people) => {
      if (err) {
        commit(DELETE_PEOPLE_ERROR)
      } else {
        commit(DELETE_PEOPLE_END)
        commit(HIDE_DELETE_PEOPLE_MODAL)
      }
      if (callback) callback(err)
    })
  },

  showPersonEditModal ({ commit, state }, personId) {
    commit(SHOW_EDIT_PEOPLE_MODAL, personId)
  },

  hidePersonEditModal ({ commit, state }, personId) {
    commit(HIDE_EDIT_PEOPLE_MODAL, personId)
  },

  showPersonDeleteModal ({ commit, state }, personId) {
    commit(SHOW_DELETE_PEOPLE_MODAL, personId)
  },

  hidePersonDeleteModal ({ commit, state }, personId) {
    commit(HIDE_DELETE_PEOPLE_MODAL, personId)
  }
}

const mutations = {
  [LOAD_PEOPLE_START] (state) {
    state.isPeopleLoading = true
    state.isPeopleLoadingError = false
  },

  [LOAD_PEOPLE_ERROR] (state) {
    state.isPeopleLoading = false
    state.isPeopleLoadingError = true
  },

  [LOAD_PEOPLE_END] (state, people) {
    state.isPeopleLoading = false
    state.isPeopleLoadingError = false
    state.people = people.sort((a, b) => {
      if (a.first_name !== a.last_name) {
        return a.first_name.localeCompare(b.first_name)
      } else {
        return a.last_name.localeCompare(b.last_name)
      }
    })
    state.people.forEach((person) => {
      person.name = `${person.first_name} ${person.last_name}`
    })
  },

  [DELETE_PEOPLE_START] (state) {
    state.isDeleteLoading = true
    state.isDeleteLoadingError = false
  },

  [DELETE_PEOPLE_END] (state) {
    state.isDeleteLoading = false
    const personToDeleteIndex = state.people.findIndex(
      (person) => person.id === state.personToDelete.id
    )
    state.people.splice(personToDeleteIndex, 1)
    state.personToDelete = undefined
  },

  [DELETE_PEOPLE_ERROR] (state) {
    state.isDeleteLoading = false
    state.isDeleteLoadingError = true
  },

  [SHOW_DELETE_PEOPLE_MODAL] (state, personId) {
    state.isDeleteModalShown = true
    state.isDeleteLoadingError = false
    state.isDeleteLoading = false
    state.personToDelete = state.people.find(
      (person) => person.id === personId.person_id
    )
  },

  [HIDE_DELETE_PEOPLE_MODAL] (state, personId) {
    state.isDeleteModalShown = false
    state.personToDelete = undefined
  },

  [EDIT_PEOPLE_START] (state, data) {
    state.isEditLoading = true
    state.isEditLoadingError = false
    state.personToEdit = Object.assign(state.personToEdit, data)
  },

  [EDIT_PEOPLE_END] (state) {
    state.isEditLoading = false
    state.isEditLoadingError = false
    const personToEditIndex = state.people.findIndex(
      (person) => person.id === state.personToEdit.id
    )
    state.people[personToEditIndex] = state.personToEdit
    state.personToEdit = {}
  },

  [EDIT_PEOPLE_ERROR] (state) {
    state.isEditLoading = false
    state.isEditLoadingError = true
  },

  [SHOW_EDIT_PEOPLE_MODAL] (state, personId) {
    state.isEditModalShown = true
    state.isEditLoadingError = false
    state.isEditLoading = false
    state.personToEdit = state.people.find(
      (person) => person.id === personId.person_id
    )
  },

  [HIDE_EDIT_PEOPLE_MODAL] (state, personId) {
    state.isEditModalShown = false
    state.personToEdit = {}
  },

  [RESET_ALL] (state, people) {
    state.isPeopleLoading = false
    state.isPeopleLoadingError = false

    state.isDeleteModalShown = false
    state.isDeleteLoading = false
    state.isDeleteLoadingError = false
    state.personToDelete = {}

    state.isEditModalShown = false
    state.isEditLoading = false
    state.isEditLoadingError = false
    state.personToEdit = {}

    state.people = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}