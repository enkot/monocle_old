<template>
  <transition
    enter-active-class="transition ease-out duration-150"
    enter-class="transform opacity-0 -translate-y-full"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 -translate-y-full"
    appear
  >
    <div
      v-if="value"
      class="absolute top-0 left-0 w-full bg-green-500 text-white text-xs py-1 text-center z-50"
    >
      IBAN скопійовано
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(value) {
      if (value) setTimeout(() => this.$emit('input', false), 2200)
    }
  }
}
</script>
