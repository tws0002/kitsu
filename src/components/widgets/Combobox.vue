<template>
<div class="field">
  <label class="label">{{ label }}</label>
  <p class="control">
    <span class="select">
      <select
        ref="select"
        @change="updateValue"
      >
        <option
          v-for="option in options"
          :value="option.value || option.label"
          :selected="value === option.value"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
    </span>
  </p>
</div>
</template>

<script>
export default {
  name: 'combobox',
  props: {
    label: {
      default: '',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    options: {
      default: [],
      type: Array
    },
    localeKeyPrefix: {
      default: '',
      type: String
    }
  },
  computed: {
  },
  methods: {
    updateValue () {
      this.$emit('input', this.$refs.select.value)
    },
    getOptionLabel (option) {
      if (this.localeKeyPrefix.length > 0) {
        return this.$t(this.localeKeyPrefix + option.label.toLowerCase())
      } else {
        return option.label
      }
    }
  }
}
</script>
