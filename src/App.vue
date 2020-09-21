<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="loading"
      class="flex justify-center items-center h-screen bg-white"
    >
      <vue-loading
        type="spin"
        color="#000"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </div>
    <div v-else class="font-sans flex flex-col h-screen bg-white">
      <router-view class="flex-grow overflow-hidden" />
      <div
        v-if="$route.name !== 'Authorize'"
        class="flex justify-around border-t border-gray-200 text-sm"
      >
        <router-link
          :to="{ name: 'Home' }"
          class="flex flex-1 flex-col items-center p-2 text-gray-600 hover:text-gray-900"
        >
          <CardIcon class="h-6 w-6" />
          Виписка
        </router-link>
        <router-link
          :to="{ name: 'Stocks' }"
          class="flex flex-1 flex-col items-center p-2 text-gray-600 hover:text-gray-900"
        >
          <SwitchVerticalIcon class="h-6 w-6" />
          Курси валют
        </router-link>
        <a
          href="#"
          class="flex flex-1 flex-col items-center p-2 text-gray-600 hover:text-gray-900"
          @click="logout"
        >
          <LogoutIcon class="h-6 w-6" />
          Вихід
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
// import firebaseInit from './firebaseInit'
import CardIcon from '@/assets/card.svg'
import LogoutIcon from '@/assets/logout.svg'
import SwitchVerticalIcon from '@/assets/switch-vertical.svg'

export default {
  name: 'App',
  components: {
    CardIcon,
    LogoutIcon,
    SwitchVerticalIcon
  },
  data() {
    return {
      loading: true,
      navItems: [
        {
          name: 'Home',
          icon: 'card'
        }
      ]
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  async created() {
    try {
      await this.$store.dispatch('getUser')

      this.$router.push({ name: 'Home' })
    } catch (e) {
      this.$router.push({ name: 'Authorize' })
    } finally {
      this.loading = false
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('removeUser')
      this.$router.push({ name: 'Authorize' })
    }
  }
}
</script>

<style lang="postcss">
@import './assets/tailwind.css';

html {
  width: 360px;
  height: 600px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.router-link-exact-active {
  @apply text-gray-900 border-b-2 border-primary-500;
}
</style>
