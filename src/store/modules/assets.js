import assetsApi from '../api/assets'
import {
  LOAD_ASSETS_START,
  LOAD_ASSETS_ERROR,
  LOAD_ASSETS_END,

  ASSET_CSV_FILE_SELECTED,
  IMPORT_ASSETS_START,
  IMPORT_ASSETS_END,

  LOAD_ASSET_TYPES_START,
  LOAD_ASSET_TYPES_ERROR,
  LOAD_ASSET_TYPES_END,

  LOAD_OPEN_PRODUCTIONS_END,

  EDIT_ASSET_START,
  EDIT_ASSET_ERROR,
  EDIT_ASSET_END,

  DELETE_ASSET_START,
  DELETE_ASSET_ERROR,
  DELETE_ASSET_END,

  RESET_ALL
} from '../mutation-types'

const sortAssets = (assets) => {
  return assets.sort((a, b) => {
    if (a.project_name !== b.project_name) {
      return a.project_name.localeCompare(b.project_name)
    } else if (a.asset_type_name !== b.asset_type_name) {
      return a.asset_type_name.localeCompare(b.asset_type_name)
    } else {
      return a.name.localeCompare(b.name)
    }
  })
}

const state = {
  assets: [],
  assetTypes: [],
  openProductions: [],
  isAssetsLoading: false,
  isAssetsLoadingError: false,
  assetsCsvFormData: null,

  editAsset: {
    isLoading: false,
    isError: false
  },

  deleteAsset: {
    isLoading: false,
    isError: false
  }
}

const getters = {
  assets: state => state.assets,

  isAssetsLoading: state => state.isAssetsLoading,
  isAssetsLoadingError: state => state.isAssetsLoadingError,

  editAsset: state => state.editAsset,
  deleteAsset: state => state.deleteAsset,

  assetsCsvFormData: state => state.assetsCsvFormData,

  getAsset: (state, getters) => (id) => {
    return state.assets.find((asset) => asset.id === id)
  },

  getOpenProduction: (state, getters) => (id) => {
    return state.openProductions.find((project) => project.id === id)
  },

  getAssetTypeOptions: state => state.assetTypes.map(
    (type) => { return { label: type.name, value: type.id } }
  )
}

const actions = {

  loadAssets ({ commit, state }, callback) {
    commit(LOAD_ASSETS_START)
    assetsApi.getAssets((err, assets) => {
      if (err) commit(LOAD_ASSETS_ERROR)
      else commit(LOAD_ASSETS_END, assets)
      if (callback) callback(err)
    })
  },

  newAsset ({ commit, state }, payload) {
    commit(EDIT_ASSET_START, payload.data)
    assetsApi.newAsset(payload.data, (err, asset) => {
      if (err) {
        commit(EDIT_ASSET_ERROR)
      } else {
        commit(EDIT_ASSET_END, asset)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  editAsset ({ commit, state }, payload) {
    commit(EDIT_ASSET_START)
    assetsApi.updateAsset(payload.data, (err, asset) => {
      if (err) {
        commit(EDIT_ASSET_ERROR)
      } else {
        commit(EDIT_ASSET_END, asset)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  deleteAsset ({ commit, state }, payload) {
    commit(DELETE_ASSET_START)
    const asset = payload.asset
    assetsApi.deleteAsset(asset, (err) => {
      if (err) {
        commit(DELETE_ASSET_ERROR)
      } else {
        commit(DELETE_ASSET_END, asset)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  uploadAssetFile ({ commit, state }, callback) {
    commit(IMPORT_ASSETS_START)
    assetsApi.postCsv(state.assetsCsvFormData, (err) => {
      commit(IMPORT_ASSETS_END)
      if (callback) callback(err)
    })
  }

}

const mutations = {
  [LOAD_ASSETS_START] (state) {
    state.isAssetsLoading = true
    state.isAssetsLoadingError = false
  },

  [LOAD_ASSETS_ERROR] (state) {
    state.isAssetsLoading = false
    state.isAssetsLoadingError = true
  },

  [LOAD_ASSETS_END] (state, assets) {
    state.isAssetsLoading = false
    state.isAssetsLoadingError = false
    state.assets = assets
    state.assets = sortAssets(state.assets)
  },

  [ASSET_CSV_FILE_SELECTED] (state, formData) {
    state.assetsCsvFormData = formData
  },
  [IMPORT_ASSETS_START] (state) {},
  [IMPORT_ASSETS_END] (state) {
    state.assetsCsvFormData = null
  },

  [LOAD_ASSET_TYPES_START] (state) {},
  [LOAD_ASSET_TYPES_ERROR] (state) {},
  [LOAD_ASSET_TYPES_END] (state, assetTypes) {
    state.assetTypes = assetTypes
  },
  [LOAD_OPEN_PRODUCTIONS_END] (state, projects) {
    state.openProductions = projects
  },

  [EDIT_ASSET_START] (state, data) {
    state.editAsset.isLoading = true
    state.editAsset.isError = false
  },

  [EDIT_ASSET_ERROR] (state) {
    state.editAsset.isLoading = false
    state.editAsset.isError = true
  },

  [EDIT_ASSET_END] (state, newAsset) {
    const asset = getters.getAsset(state)(newAsset.id)
    const assetType = state.assetTypes.find(
      (assetType) => assetType.id === newAsset.entity_type_id
    )
    newAsset.asset_type_name = assetType.name

    const production = state.openProductions.find(
      (production) => production.id === newAsset.project_id
    )
    newAsset.project_name = production.name

    if (asset) {
      Object.assign(asset, newAsset)
    } else {
      state.assets.push(newAsset)
      state.assets = sortAssets(state.assets)
    }
    state.editAsset = {
      isLoading: false,
      isError: false
    }
  },

  [DELETE_ASSET_START] (state) {
    state.deleteAsset = {
      isLoading: true,
      isError: false
    }
  },
  [DELETE_ASSET_ERROR] (state) {
    state.deleteAsset = {
      isLoading: false,
      isError: true
    }
  },
  [DELETE_ASSET_END] (state, assetToDelete) {
    const assetToDeleteIndex = state.assets.findIndex(
      (asset) => asset.id === assetToDelete.id
    )
    state.assets.splice(assetToDeleteIndex, 1)

    state.deleteAsset = {
      isLoading: false,
      isError: false
    }
  },

  [RESET_ALL] (state) {
    state.assets = []
    state.assetTypes = []
    state.isAssetsLoading = false
    state.isAssetsLoadingError = false
    state.assetsCsvFormData = null

    state.editAsset = {
      isLoading: false,
      isError: false
    }

    state.deleteAsset = {
      isLoading: false,
      isError: false
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
