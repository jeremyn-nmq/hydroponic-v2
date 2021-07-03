<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm  @submit.prevent="login">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput v-model="email"
                    placeholder="Email"
                    autocomplete="username email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput v-model="password" type="password"
                    placeholder="Password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" type="submit">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                      <CButton color="link" class="d-lg-none">Register now!</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
        email: "",
        password: ""
    }
  },
  methods: {
    login: function () {
      let email = this.email
      let password = this.password
      console.log("logging in");
      this.$store.dispatch('login', { email, password })
          .then(() => this.$router.push('/dashboard'))
          .catch(err => console.log(err))
    }
  }
}
</script>
