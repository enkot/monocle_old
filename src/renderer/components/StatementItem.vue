<template>
  <li
    class="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
  >
    <div class="flex items-center overflow-hidden mr-1">
      <div
        class="flex justify-center items-center flex-shrink-0 h-8 w-8 rounded-full mr-2"
        :class="`bg-${mcc.color}-500`"
      >
        <component :is="`${mcc.name}-icon`" class="h-5 w-5 text-white" />
      </div>
      <div class="flex flex-col overflow-hidden pr-2">
        <div class="text-sm text-gray-900 w-full truncate">
          {{ item.description }}
        </div>
        <span class="flex items-center text-sm text-gray-700 rounded">
          {{ mcc.title }}
        </span>
      </div>
    </div>
    <div class="flex flex-col justify-center text-right">
      <span class="text-base font-semibold">
        {{ amount }}
      </span>
      <span
        v-if="item.cashbackAmount"
        class="flex justify-end items-center text-sm text-green-400 font-semibold"
      >
        <GiftIcon class="h-4 w-4 mr-1" /> {{ cashback }}
      </span>
    </div>
  </li>
</template>

<script>
import mcc from '../mcc.json'

import GiftIcon from '@/assets/gift.svg'
import CafeIcon from '@/assets/cafe.svg'
import CardIcon from '@/assets/card.svg'
import TravelIcon from '@/assets/travel.svg'
import MedicineIcon from '@/assets/medicine.svg'
import SportIcon from '@/assets/sport.svg'
import ProductsIcon from '@/assets/products.svg'
import CarIcon from '@/assets/car.svg'
import ClothesIcon from '@/assets/clothes.svg'
import TaxiIcon from '@/assets/taxi.svg'
import AnimalsIcon from '@/assets/animals.svg'
import BooksIcon from '@/assets/books.svg'
import FlowersIcon from '@/assets/flowers.svg'

export default {
  components: {
    GiftIcon,
    CafeIcon,
    CardIcon,
    TravelIcon,
    MedicineIcon,
    SportIcon,
    ProductsIcon,
    CarIcon,
    ClothesIcon,
    TaxiIcon,
    AnimalsIcon,
    BooksIcon,
    FlowersIcon
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    amount() {
      return (this.item.amount / 100).toFixed(2)
    },
    cashback() {
      return (this.item.cashbackAmount / 100).toFixed(2)
    },
    mcc() {
      return this.item.comment
        ? {
            title: this.item.comment,
            name: 'card',
            color: 'indigo'
          }
        : getMCCFromCode(this.item.mcc) || {
            title:
              this.item.amount > 0 ? 'Поповнення картки' : 'Переказ на картку',
            name: 'card',
            color: 'indigo'
          }
    }
  }
}

function getMCCFromCode(code) {
  return mcc.find(item =>
    item.items
      .map(item => item.split('-').map(item => +item))
      .some(([from, to]) => (to ? code >= from && code <= to : code === from))
  )
}
</script>
