<template>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <slot />
    </div>
    <vue-numeric
      v-if="type === 'number'"
      separator=","
      :precision="2"
      :value="value"
      class="input px-3"
      :disabled="disabled"
      @input="$emit('input', $event)"
    />
    <input
      v-else
      :value="value"
      :type="type"
      :placeholder="placeholder"
      class="input px-3"
      :class="{ 'pl-10': $slots.default }"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss">
.input {
  @apply appearance-none block w-full py-2 bg-gray-100 border border-gray-200 rounded-md transition duration-150 ease-in-out text-base;
}
.input:focus {
  @apply bg-white outline-none border-primary-300 shadow-outline-primary;
}
</style>
