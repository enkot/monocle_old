<template>
  <div class="flex flex-col">
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="flex flex-grow justify-center items-center h-full"
      >
        <SpinThinIcon class="animate-spin -ml-1 mr-3 h-10 w-10" />
      </div>
      <div v-else class="flex flex-col overflow-hidden">
        <div class="flex-shrink-0 mt-6 px-6">
          <span class="text-xl font-semibold">Курси валют</span>
          <div class="relative flex justify-between items-center mt-6 z-10">
            <div
              class="transform transition-transform duration-500 ease-in-out"
              :class="{ 'translate-x-47': reversed }"
            >
              <Button variant="secondary" class="justify-start w-32">
                {{ from }}
              </Button>
            </div>
            <SwitchHorizontalIcon
              class="h-6 w-6 mx-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-transform duration-500 ease-in-out transform"
              :class="{ 'rotate-180': reversed }"
              @click="swap"
            />
            <div
              class="transform transition-transform duration-500 ease-in-out"
              :class="{ '-translate-x-47': reversed }"
            >
              <FormSelect
                v-model="to"
                :items="toCurrency"
                class="w-32"
                bodyClass="w-full"
              ></FormSelect>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <FormInput
              v-model="fromValue"
              type="number"
              class="w-32"
            ></FormInput>
            <FormInput
              :value="toValue"
              type="number"
              class="w-32"
              disabled
            ></FormInput>
          </div>
        </div>
        <div class="flex flex-col flex-grow mt-6 overflow-hidden">
          <div class="flex flex-shrink-0 px-6 text-sm">
            <div class="w-2/3 py-2 text-left text-gray-600">Валюта</div>
            <div class="w-1/4 py-2 text-left text-gray-600">Купівля</div>
            <div class="w-1/4 py-2 text-left text-gray-600">Продаж</div>
          </div>
          <div class="px-6 overflow-y-scroll">
            <div
              v-for="(item, index) in currency"
              :key="index"
              class="flex flex-grow border-b border-gray-200 last:border-b-0"
            >
              <div class="w-2/3 py-3 text-base">
                <span class="font-semibold mr-2">{{ item.symbol }}</span>
                <span>{{ item.code }}</span>
              </div>
              <div class="w-1/4 py-3 text-base tracking-wide">
                {{ item.rateBuy.toFixed(2) }}
              </div>
              <div class="w-1/4 py-3 text-base tracking-wide">
                {{ item.rateSell.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import currencyCodes from 'currency-codes'
import getSymbolFromCurrency from 'currency-symbol-map'
import SwitchHorizontalIcon from '@/assets/switch-horizontal.svg'
import SpinThinIcon from '@/assets/spin-thin.svg'

export default {
  components: {
    SwitchHorizontalIcon,
    SpinThinIcon
  },
  data() {
    return {
      loading: false,
      keyword: '',
      fromValue: 1,
      from: 'UAN',
      to: 'USD',
      reversed: true
    }
  },
  computed: {
    toCurrency() {
      return this.currency
        .filter(item => item.code !== this.from)
        .map(item => ({
          value: item.code,
          label: item.code
        }))
    },
    currentCurrency() {
      return this.currency.find(item => item.code === this.to)
    },
    toValue() {
      if (!this.currentCurrency) return 1
      return this.reversed
        ? this.fromValue * this.currentCurrency.rateBuy
        : this.fromValue / this.currentCurrency.rateSell
    },
    currency() {
      return this.$store.state.currency
        .filter(
          item =>
            item.currencyCodeB === 980 &&
            currencyCodes.number(item.currencyCodeA)
        )
        .map(item => ({
          ...item,
          rateBuy: item.rateCross || item.rateBuy,
          rateSell: item.rateCross || item.rateSell
        }))
        .map(item => {
          const { code } = currencyCodes.number(item.currencyCodeA)

          return {
            ...item,
            code,
            symbol: getSymbolFromCurrency(code)
          }
        })
    }
  },
  methods: {
    async getCurrency() {
      this.loading = true
      try {
        await this.$store.dispatchPromise('getCurrency')
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.loading = false
      }
    },
    swap() {
      this.fromValue = this.reversed
        ? this.currentCurrency.rateSell * this.fromValue
        : this.toValue
      this.reversed = !this.reversed
    }
  },
  created() {
    this.getCurrency()
  }
}
</script>
