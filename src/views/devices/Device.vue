<template>
  <CRow>
    <CCol col="12" lg="6">
      <CCard>
        <CCardHeader>
          Device id:  {{ $route.params.id }}
        </CCardHeader>
        <CCardBody>
          <CDataTable
            striped
            small
            fixed
            :items="visibleData"
            :fields="fields"
          />
        </CCardBody>
        <CCardFooter>
          <CButton color="primary" @click="goBack">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import devicesData from './DevicesData'
export default {
  name: 'User',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.devicesOpened = from.fullPath.includes('devices')
    })
  },
  data () {
    return {
      devicesOpened: null
    }
  },
  computed: {
    fields () {
      return [
        { key: 'key', label: this.username, _style: 'width:150px'},
        { key: 'value', label: '', _style: 'width:150px;' }
      ]
    },
    deviceData () {
      const id = this.$route.params.id
      const device = devicesData.find((device, index) => index + 1 == id)
      const deviceDetails = device ? Object.entries(device) : [['id', 'Not found']]
      return deviceDetails.map(([key, value]) => { return { key, value } })
    },
    visibleData () {
      return this.deviceData.filter(param => param.key !== 'username')
    },
    username () {
      return this.deviceData.filter(param => param.key === 'username')[0].value
    }
  },
  methods: {
    goBack() {
      this.devicesOpened ? this.$router.go(-1) : this.$router.push({path: '/devices'})
    }
  }
}
</script>
