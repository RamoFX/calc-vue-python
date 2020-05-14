const compIcon = Vue.component('comp-icon', {
  props: ['prop_icon', 'prop_size', 'prop_class'],

  template: `
    <span
      class="mdi"
      :class="[
        'mdi-' + prop_icon,
        prop_size ? 'icon-size-' + prop_size : '',
        prop_class ? prop_class : ''
      ]"
    ></span>
  `
})
