<script>
export default {
  props: {
    href: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary'].includes(val)
    }
  },
  render(h) {
    return h(
      this.href ? 'a' : 'button',
      {
        attrs: {
          type: 'button',
          href: this.href || undefined,
          target: this.href ? 'blank' : undefined
        },
        class: this.variant,
        on: this.$listeners
      },
      this.$slots.default
    )
  }
}
</script>

<style lang="postcss" scoped>
.base {
  @apply inline-flex items-center px-4 py-3 border shadow text-base leading-4 font-medium rounded-md transition ease-in-out duration-150;
}
.primary {
  @apply base bg-primary-600 border-transparent text-white;
}
.primary:hover {
  @apply bg-primary-500;
}
.primary:focus {
  @apply outline-none border-primary-700 shadow-outline-primary;
}
.primary:active {
  @apply bg-primary-700;
}
.secondary {
  @apply base bg-white border-gray-300 text-gray-900;
}
.secondary:hover {
  @apply text-gray-700;
}
.secondary:focus {
  @apply outline-none border-primary-300 shadow-outline-primary;
}
.secondary:active {
  @apply shadow-outline-primary;
}
</style>
