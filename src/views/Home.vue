<template>
  <div class="flex flex-col">
    <div class="cards-container">
      <div class="flex flex-col">
        <Swiper
          ref="swiper"
          class="swiper"
          :options="swiperOption"
          @slideChange="changeSwiperIndex"
        >
          <SwiperSlide v-for="account in userAccounts" :key="account.id">
            <Card :account="account" />
          </SwiperSlide>
        </Swiper>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div class="px-6 pt-4 pb-2">
      <FormInput v-model="keyword" placeholder="Пошук по виписці">
        <SearchIcon class="h-5 w-5 text-gray-500" />
      </FormInput>
      <!-- <Button @click="setWebhook">Set Webhook</Button> -->
    </div>
    <div class="flex flex-grow justify-center px-6 overflow-y-auto">
      <transition name="fade" mode="out-in">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <vue-loading
            type="spin"
            color="#000"
            :size="{ width: '50px', height: '50px' }"
          />
        </div>
        <ul v-else-if="filteredAccountStatementByDate.length" class="w-full">
          <li
            v-for="dayItem in filteredAccountStatementByDate"
            :key="dayItem.day"
          >
            <div
              class="sticky top-0 w-full bg-white py-1.5 text-sm text-center text-gray-600"
            >
              {{ dayItem.day }}
            </div>
            <ul>
              <StatementItem
                v-for="statementItem in dayItem.items"
                :key="statementItem.id"
                :item="statementItem"
              />
            </ul>
          </li>
        </ul>
        <div v-else class="flex flex-col items-center mt-8">
          <CatIllustration class="w-32 h-32" />
          <span class="mt-1 text-base text-center text-gray-500">{{
            keyword
              ? `За запитом "${keyword}" нічого не знайдено :(`
              : 'Не густо тут у Вас :)'
          }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import Card from '@/components/Card'
import StatementItem from '@/components/StatementItem'
import SearchIcon from '@/assets/search.svg'
import CatIllustration from '@/assets/cat.svg'

export default {
  name: 'Home',
  components: {
    Swiper,
    SwiperSlide,
    Card,
    StatementItem,
    SearchIcon,
    CatIllustration
  },
  data() {
    return {
      loading: false,
      currentIndex: 0,
      errorMessage: null,
      keyword: '',
      swiperOption: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 160,
          modifier: 1,
          slideShadows: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  computed: {
    currentAccountId() {
      return this.userAccounts[this.currentIndex].id
    },
    userAccounts() {
      return [...this.$store.state.user.accounts].sort((a, b) => {
        return b.balance - a.balance
      })
    },
    accountStatement() {
      return this.$store.state.statements[this.currentAccountId]
    },
    filteredAccountStatement() {
      return this.accountStatement
        ? this.accountStatement.filter(item =>
            item.description.toLowerCase().includes(this.keyword.toLowerCase())
          )
        : []
    },
    filteredAccountStatementByDate() {
      return this.filteredAccountStatement.reduce((acc, item) => {
        const day = this.$date(item.time * 1000).format('LL')
        const dayItem = acc.find(item => item.day === day)

        if (dayItem) {
          dayItem.items.push(item)
        } else {
          acc.push({
            day,
            items: [item]
          })
        }

        return acc
      }, [])
    }
  },
  methods: {
    async setWebhook() {
      try {
        // await browser.runtime.sendMessage({
        //   type: 'setWebhook'
        // })
      } catch (error) {
        console.log(error)
      }
    },
    async getStatement() {
      this.loading = true
      try {
        await this.$store.dispatch('getStatement', this.currentAccountId)
        console.log('Im here 2', this.currentAccountId)
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.loading = false
      }
    },
    async changeSwiperIndex() {
      this.currentIndex = this.$refs.swiper.$swiper.activeIndex
      this.getStatement()
    }
  },
  created() {
    this.getStatement()
  }
}
</script>

<style lang="postcss">
.cards-container {
  @apply flex justify-center items-center flex-shrink-0;
  height: 210px;
  background: rgb(214, 209, 251);
  background: linear-gradient(
    45deg,
    rgba(214, 209, 251, 1) 0%,
    rgba(251, 234, 238, 1) 100%
  );
}
.swiper-slide {
  @apply flex justify-center items-center;
  width: 290px;
  height: 200px;
}
.swiper-pagination {
  @apply relative -mt-3;
}
.swiper-pagination-bullet {
  @apply mx-0.5;
}
.swiper-pagination-bullet-active {
  @apply bg-black opacity-50;
}
</style>
