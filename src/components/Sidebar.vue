<template>
  <div class="navbar">
    <aside v-bind:class="{'hidden': isSidebarHidden}">
      <div>
        <p class="company-logo has-text-centered">
          <img src="../assets/kitsu.png" />
          <h2 class="subtitle sidebar-title">Kitsu</h2>
        </p>
        <section>
         <h2>Fabrication</h2>
         <p @click="toggleSidebar()">
            <router-link to="/assets">
            {{ $t("assets.title") }}
            </router-link>
          </p>


         <h2>General</h2>
          <p @click="toggleSidebar()">
            <router-link to="/productions">
            {{ $t("productions.title") }}
            </router-link>
          </p>
          <p @click="toggleSidebar()">
            <router-link to="/people">
            {{ $t("people.title") }}
            </router-link>
          </p>
          <p @click="toggleSidebar()">
            <router-link to="/task-types">
            {{ $t("task_types.title") }}
            </router-link>
          </p>
          <p @click="toggleSidebar()">
            <router-link to="/asset-types">
            {{ $t("asset_types.title") }}
            </router-link>
          </p>

        </section>
      </div>
    </aside>
    <div id="c-mask" @click="toggleSidebar()"
         v-bind:class="{'is-active': !isSidebarHidden}"
    >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'menu',
  computed: {
    ...mapGetters([
      'isSidebarHidden'
    ])
  },
  methods: {
    ...mapActions([
      'toggleSidebar'
    ])
  }
}
</script>

<style scoped>
aside {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  background-color: white;
  padding: 20px 1em 1em 1em;
  overflow-y: auto;
  z-index: 200;
  box-shadow: 1px 0px 6px rgba(0,0,0,0.2);
  transition-property: all;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

aside.hidden {
  left: -200px;
}

aside p a {
  font-size: 1.2em;
  text-transform: uppercase;
  color: #999;
}

aside section {
  margin-bottom: 2em;
}

.sidebar-title {
  margin-top: 0;
  margin-bottom: 3em;
  text-align: center;
}

.company-logo {
  text-align: center;
}

#c-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 0;
  height: 0;
  background-color: #000;
  opacity: 0;
}

#c-mask.is-active {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 2em;
}
</style>
