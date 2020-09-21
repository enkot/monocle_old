<template>
  <div class="flex flex-col justify-center h-screen p-8">
    <div>
      <Logo />
      <FormInput v-model="token" placeholder="Введіть ваш токен" class="mt-10">
        <LockIcon class="h-5 w-5 text-gray-500" />
      </FormInput>
      <span v-if="error" class="inline-block mt-2 text-red-400">
        {{ error }}
      </span>
      <Button class="mt-3 w-full justify-center" @click="submit">
        Авторизуватись
      </Button>
      <Button
        href="https://api.monobank.ua/"
        class="mt-6 w-full justify-center"
        variant="secondary"
      >
        Згенерувати токен
      </Button>
    </div>
  </div>
</template>

<script>
import Logo from '@/assets/logo.svg'
import LockIcon from '@/assets/lock.svg'

export default {
  components: {
    Logo,
    LockIcon
  },
  data() {
    return {
      token: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async submit() {
      this.loading = true

      try {
        await this.$store.dispatch('getUser', this.token)
        this.$router.push({ name: 'Home' })
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
