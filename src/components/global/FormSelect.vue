<template>
  <div
    @keydown.escape="close"
    v-click-outside="close"
    class="relative inline-block text-left"
  >
    <div>
      <span class="rounded-md shadow-sm">
        <Button @click="toggle" class="justify-between w-full">
          {{ label }}
          <SelectorIcon class="-mr-1 ml-2 h-5 w-5" />
        </Button>
      </span>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="open"
        class="absolute mt-2 w-56 max-h-50vh overflow-y-auto rounded-md shadow-lg"
        :class="`origin-top-${position} ${position}-0 ${bodyClass}`"
      >
        <div class="rounded-md bg-white shadow-xs">
          <div class="py-1">
            <span
              v-for="item in items"
              :key="item.value"
              class="block px-4 py-3 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
              @click="select(item.value)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import SelectorIcon from '@/assets/selector.svg'

export default {
  components: {
    SelectorIcon
  },
  data() {
    return {
      open: false
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    bodyClass: {
      type: String
    },
    position: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  computed: {
    label() {
      const item = this.items.find((item) => item.value === this.value)
      return item && item.label
    }
  },
  methods: {
    select(value) {
      this.$emit('input', value)
      this.close()
    },
    toggle() {
      this.open = !this.open
    },
    close() {
      this.open = false
    }
  }
}
</script>
