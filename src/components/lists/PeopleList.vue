<template>
<div class="data-list">
  <table class="table">
    <tbody>
      <tr v-for="entry in entries">
        <people-name-cell class="name" v-bind:entry="entry"></people-name-cell>
        <td class="email">{{ entry.email }}</td>
        <td class="phone">{{ entry.phone }}</td>
        <row-actions
          :entry-id="entry.id"
          :edit-route="'/people/edit/' + entry.id"
          :delete-route="'/people/delete/' + entry.id"
        >
        </row-actions>
       </tr>
    </tbody>
  </table>
  <div class="has-text-centered" v-if="isLoading">
    <img src="../../assets/spinner.svg">
  </div>
  <div class="has-text-centered" v-if="isError">
    <span class="tag is-danger">An error occured while loading data</span>
  </div>
  <p class="has-text-centered footer-info" v-if="!isLoading">
    {{ entries.length }} {{ $tc('people.persons', entries.length) }}
  </p>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PeopleNameCell from '../cells/PeopleNameCell'
import RowActions from '../widgets/RowActions'

export default {
  name: 'list',
  components: {
    PeopleNameCell,
    RowActions
  },
  props: [
    'entries',
    'isLoading',
    'isError',
    'onEditClicked',
    'onDeleteClicked'
  ],
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    ...mapActions([
    ]),
    taskColor (nbTasks) {
      if (nbTasks < 1 || nbTasks > 4) {
        return 'red'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.name {
  width: 230px;
  min-width: 230px;
}
.email {
  width: 210px;
  min-width: 210px;
}
.phone {
  width: 140px;
  min-width: 140px;
}
.skills {
  width: 250px;
}

.data-list {
  flex: 1 1 auto;
  height: 0px;
  overflow-y: auto;
}
</style>
