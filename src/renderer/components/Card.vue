<template>
  <div class="shadow-wrap">
    <div
      class="card"
      :class="account.type === 'white' ? 'bg-white' : 'bg-black'"
    >
      <Toast v-model="copied" />
      <div class="flex flex-col">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <span
              class="text-sm text-gray-500 uppercase font-semibold tracking-widest"
            >
              Баланс
            </span>
            <span
              class="text-xl font-bold"
              :class="account.type === 'white' ? 'text-black' : 'text-white'"
            >
              {{ account.currency.symbol }} {{ account.balance.toFixed(2) }}
            </span>
          </div>
          <VisaLogo v-if="account.type === 'white'" class="w-16" />
          <MastercardLogo v-else class="w-16" />
        </div>
        <span
          class="mt-1 text-xxs text-gray-500 uppercase font-semibold tracking-widest"
        >
          Кредитний ліміт: {{ account.currency.symbol }}
          {{ account.creditLimit.toFixed(2) }}
        </span>
      </div>
      <div class="flex justify-between space-x-1 text-sm">
        <div
          class="text-gray-500 truncate cursor-pointer"
          :class="
            account.type === 'white'
              ? 'hover:text-gray-800'
              : 'hover:text-gray-200'
          "
          @mouseenter="showIBAN = true"
          @mouseleave="showIBAN = false"
          @click="copyIBAN(account.iban)"
        >
          {{ showIBAN ? account.iban : account.maskedPan[0] }}
        </div>
        <span class="text-gray-500">{{ account.currency.code }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { clipboard } from 'electron'

import Toast from '@/components/Toast'
import MastercardLogo from '@/assets/mastercard.svg'
import VisaLogo from '@/assets/visa.svg'

export default {
  components: {
    MastercardLogo,
    VisaLogo,
    Toast
  },
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showIBAN: false,
      copied: false
    }
  },
  methods: {
    copyIBAN(value) {
      clipboard.writeText(value)
      this.copied = true
    }
  }
}
</script>

<style lang="postcss">
.card {
  @apply relative flex flex-col justify-between py-5 px-5 rounded-lg overflow-hidden;
  width: 280px;
  height: 160px;
}
</style>
