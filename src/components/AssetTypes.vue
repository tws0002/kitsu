<template>
  <div class="asset-types page">
    <div class="asset-types-list">
      <h1 class="title">{{ $t('asset_types.title') }}</h1>

      <div class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <button-link
              class="level-item"
              :text="$t('asset_types.new_asset_type')"
              path="/asset-types/new"
            >
            </button-link>
          </div>
        </div>
      </div>

      <asset-type-list
        :entries="assetTypes"
        :is-loading="isAssetTypesLoading"
        :is-error="isAssetTypesLoadingError"
      ></asset-type-list>
    </div>

    <edit-asset-type-modal
      :active="modals.isNewDisplayed"
      :is-loading="editAssetType.isLoading"
      :is-error="editAssetType.isError"
      :cancel-route="'/asset-types'"
      :asset-type-to-edit="assetTypeToEdit"
      @confirm="confirmEditAssetType"
    >
    </edit-asset-type-modal>

    <delete-modal
      :active="modals.isDeleteDisplayed"
      :is-loading="deleteAssetType.isLoading"
      :is-error="deleteAssetType.isError"
      :cancel-route="'/asset-types'"
      :text="deleteText()"
      :error-text="$t('asset_types.delete_error')"
      @confirm="confirmDeleteAssetType"
    >
    </delete-modal>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AssetTypeList from './lists/AssetTypeList'
import EditAssetTypeModal from './modals/EditAssetTypeModal'
import DeleteModal from './widgets/DeleteModal'
import ButtonLink from './widgets/ButtonLink'

export default {
  name: 'menu',

  components: {
    AssetTypeList,
    DeleteModal,
    EditAssetTypeModal,
    ButtonLink
  },

  data () {
    return {
      modals: {
        isNewDisplayed: false,
        isDeleteDisplayed: false
      },
      assetTypeToDelete: null,
      assetTypeToEdit: null,
      choices: []
    }
  },

  computed: {
    ...mapGetters([
      'assetTypes',
      'isAssetTypesLoading',
      'isAssetTypesLoadingError',
      'editAssetType',
      'deleteAssetType',
      'getAssetType'
    ])
  },

  created () {
    this.loadAssetTypes((err) => {
      if (!err) this.handleModalsDisplay()
    })
  },

  methods: {
    ...mapActions([
      'loadAssetTypes'
    ]),

    confirmEditAssetType (form) {
      let action = 'newAssetType'
      if (this.assetTypeToEdit && this.assetTypeToEdit.id) {
        action = 'editAssetType'
        form.id = this.assetTypeToEdit.id
      }

      this.$store.dispatch(action, {
        data: form,
        callback: (err) => {
          if (!err) {
            this.modals.isNewDisplayed = false
            this.$router.push('/asset-types')
          }
        }
      })
    },

    confirmDeleteAssetType () {
      this.$store.dispatch('deleteAssetType', {
        assetType: this.assetTypeToDelete,
        callback: (err) => {
          if (!err) this.modals.isDeleteDisplayed = false
        }
      })
    },

    deleteText () {
      const assetType = this.assetTypeToDelete
      if (assetType) {
        return this.$t('asset_types.delete_text', {name: assetType.name})
      } else {
        return ''
      }
    },

    handleModalsDisplay () {
      const path = this.$store.state.route.path
      const assetTypeId = this.$store.state.route.params.asset_type_id

      if (path.indexOf('new') > 0) {
        this.assetTypeToEdit = {color: '#FFFFFF'}
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('edit') > 0) {
        this.assetTypeToEdit = this.getAssetType(assetTypeId)
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('delete') > 0) {
        this.assetTypeToDelete = this.getAssetType(assetTypeId)
        this.modals.isDeleteDisplayed = true
      } else {
        this.modals.isNewDisplayed = false
        this.modals.isDeleteDisplayed = false
      }
    }
  },

  watch: {
    $route () { this.handleModalsDisplay() }
  }
}
</script>

<style scoped>
.asset-types-list {
  margin-top: 2em;
}
</style>
