<template>
  <div class="task-types page">
    <div class="task-types-list">
      <h1 class="title">{{ $t('task_types.title') }}</h1>

      <div class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <button-link
              class="level-item"
              :text="$t('task_types.new_task_type')"
              path="/task-types/new"
            >
            </button-link>
          </div>
        </div>
      </div>

      <task-type-list
        :entries="taskTypes"
        :is-loading="isTaskTypesLoading"
        :is-error="isTaskTypesLoadingError"
      ></task-type-list>
    </div>

    <edit-task-type-modal
      :active="modals.isNewDisplayed"
      :is-loading="editTaskType.isLoading"
      :is-error="editTaskType.isError"
      :cancel-route="'/task-types'"
      :task-type-to-edit="taskTypeToEdit"
      @confirm="confirmEditTaskType"
    >
    </edit-task-type-modal>

    <delete-modal
      :active="modals.isDeleteDisplayed"
      :is-loading="deleteTaskType.isLoading"
      :is-error="deleteTaskType.isError"
      :cancel-route="'/task-types'"
      :text="deleteText()"
      :error-text="$t('task_types.delete_error')"
      @confirm="confirmDeleteTaskType"
    >
    </delete-modal>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TaskTypeList from './lists/TaskTypeList'
import EditTaskTypeModal from './modals/EditTaskTypeModal'
import DeleteModal from './widgets/DeleteModal'
import ButtonLink from './widgets/ButtonLink'

export default {
  name: 'menu',

  components: {
    TaskTypeList,
    DeleteModal,
    EditTaskTypeModal,
    ButtonLink
  },

  data () {
    return {
      modals: {
        isNewDisplayed: false,
        isDeleteDisplayed: false
      },
      taskTypeToDelete: null,
      taskTypeToEdit: null,
      choices: []
    }
  },

  computed: {
    ...mapGetters([
      'taskTypes',
      'isTaskTypesLoading',
      'isTaskTypesLoadingError',
      'editTaskType',
      'deleteTaskType',
      'getTaskType'
    ])
  },

  created () {
    this.loadTaskTypes((err) => {
      if (!err) this.handleModalsDisplay()
    })
  },

  methods: {
    ...mapActions([
      'loadTaskTypes'
    ]),

    confirmEditTaskType (form) {
      let action = 'newTaskType'
      if (this.taskTypeToEdit && this.taskTypeToEdit.id) {
        action = 'editTaskType'
        form.id = this.taskTypeToEdit.id
      }

      this.$store.dispatch(action, {
        data: form,
        callback: (err) => {
          if (!err) {
            this.modals.isNewDisplayed = false
            this.$router.push('/task-types')
          }
        }
      })
    },

    confirmDeleteTaskType () {
      this.$store.dispatch('deleteTaskType', {
        taskType: this.taskTypeToDelete,
        callback: (err) => {
          if (!err) this.modals.isDeleteDisplayed = false
        }
      })
    },

    deleteText () {
      const taskType = this.taskTypeToDelete
      if (taskType) {
        return this.$t('task_types.delete_text', {name: taskType.name})
      } else {
        return ''
      }
    },

    handleModalsDisplay () {
      const path = this.$store.state.route.path
      const taskTypeId = this.$store.state.route.params.task_type_id

      if (path.indexOf('new') > 0) {
        this.taskTypeToEdit = {color: '#FFFFFF'}
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('edit') > 0) {
        this.taskTypeToEdit = this.getTaskType(taskTypeId)
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('delete') > 0) {
        this.taskTypeToDelete = this.getTaskType(taskTypeId)
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
.task-types-list {
  margin-top: 2em;
}
</style>
