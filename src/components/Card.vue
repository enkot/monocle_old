<template>
  <div class="card" :class="account.type === 'white' ? 'bg-white' : 'bg-black'">
    <div class="flex flex-col">
      <div class="flex justify-between items-start">
        <div class="flex flex-col">
          <span
            class="text-sm text-gray-500 uppercase font-semibold tracking-widest"
          >
            Баланс
          </span>
          <span
            class="text-xl font-bold tracking-wide"
            :class="account.type === 'white' ? 'text-black' : 'text-white'"
          >
            {{ currencySymbol }} {{ balance.toFixed(2) }}
          </span>
        </div>
        <VisaLogo v-if="account.type === 'white'" class="w-16" />
        <MastercardLogo v-else class="w-16" />
      </div>
      <span
        class="mt-1 text-xxs text-gray-500 uppercase font-semibold tracking-widest"
      >
        Кредитний ліміт: {{ currencySymbol }} {{ creditLimit.toFixed(2) }}
      </span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-500 text-sm tracking-widest">{{
        account.maskedPan[0]
      }}</span>
      <span class="text-gray-500 text-sm">{{ currencyCode }}</span>
    </div>
  </div>
</template>

<script>
import currencyCodes from 'currency-codes'
import getSymbolFromCurrency from 'currency-symbol-map'
import MastercardLogo from '@/assets/mastercard.svg'
import VisaLogo from '@/assets/visa.svg'

export default {
  components: {
    MastercardLogo,
    VisaLogo
  },
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  computed: {
    balance() {
      return (this.account.balance - this.account.creditLimit) / 100
    },
    creditLimit() {
      return this.account.creditLimit / 100
    },
    currencyCode() {
      return currencyCodes.number(this.account.currencyCode).code
    },
    currencySymbol() {
      return getSymbolFromCurrency(this.currencyCode)
    }
  }
}
</script>

<style lang="postcss">
.card {
  @apply flex flex-col justify-between py-5 px-5 rounded-lg shadow-2lg;
  width: 280px;
  height: 160px;
}
</style>
