<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="mb-3">
          <CCol sm="6">
            <h4 class="card-title mb-0">Data</h4>
          </CCol>
          <CCol sm="6" class="d-flex flex-row-reverse">
            {{getCurrentDate()}}
          </CCol>
        </CRow>
        <CRow v-if="this.userSensors.hasOwnProperty('name')">
          <CCol sm="12">
            <label for="sensor-select-1">Choose a sensor:</label>
            <select class="custom-select mb-2" id="sensor-select-1" v-on:change="onSelectedSensor($event)">
              <option selected disabled>Select sensor</option>
              <option v-bind:value="this.userSensors.name">
                {{this.userSensors.name}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow v-else>
          <CCol sm="12">
            <label for="sensor-select-2">Choose a sensor:</label>
            <select class="custom-select mb-2" id="sensor-select-2" v-on:change="onSelectedSensor($event)">
              <option selected disabled>Select sensor</option>
              <option v-for="(item, key) in this.userSensors" v-bind:value="item.name">
                {{item.name}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <label for="sensor-date-select">Choose a date:</label>
            <select class="custom-select mb-2" id="sensor-date-select" v-on:change="onSelectedSensorDate($event)">
              <option selected disabled>Select date</option>
              <option v-for="(item, key) in this.currentSelectedSensorData" v-bind:value="key">
                {{key}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <label for="sensor-time-select">Choose a time slot to view the data:</label>
            <select class="custom-select mb-2" id="sensor-time-select" v-on:change="onSelectedSensorDateTime($event)">
              <option selected disabled>Select time slot</option>
              <option v-for="(item, key) in this.currentSelectedSensorDataTime" v-bind:value="key">
                {{key}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow class="mt-1" v-if="Object.entries(this.currentSelectSensorDataTimeValue).length !== 0">
          <CCol>
            <CCard>
              <CCardHeader>
                <CIcon name="cil-justify-center"/>
                <strong> Data for {{selectedSensorName.replace(/([^A-Za-z0-9])/g, ' $1')}} on
                  {{this.selectedSensorDate}} at {{this.selectedSensorTime}} </strong>
              </CCardHeader>
              <CCardBody>
                <CListGroup>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>Pump 1 Status:</strong>
                    <CBadge class="large-badge" v-if="this.currentSelectSensorDataTimeValue['pump1'] === 'Normal'" color="success" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['pump1']}}</CBadge>
                    <CBadge class="large-badge" v-else color="warning" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['pump1']}}</CBadge>
                  </CListGroupItem>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>Pump 2 Status:</strong>
                    <CBadge class="large-badge" v-if="this.currentSelectSensorDataTimeValue['pump2'] === 'Normal'" color="success" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['pump2']}}</CBadge>
                    <CBadge class="large-badge" v-else color="warning" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['pump2']}}</CBadge>
                  </CListGroupItem>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>pH Level:</strong>
                    <CBadge class="large-badge" color="info" shape="pill">{{this.currentSelectSensorDataTimeValue['pH']}}</CBadge>
                  </CListGroupItem>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>TDS:</strong>
                    <CBadge class="large-badge" color="info" shape="pill">{{this.currentSelectSensorDataTimeValue['tds']}}</CBadge>
                  </CListGroupItem>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>Temperature:</strong>
                    <CBadge class="large-badge" color="info" shape="pill">{{this.currentSelectSensorDataTimeValue['temperature']}}</CBadge>
                  </CListGroupItem>
                  <CListGroupItem
                      class="d-flex justify-content-between align-items-center"
                  >
                    <strong>Water Level:</strong>
                    <CBadge class="large-badge" v-if="this.currentSelectSensorDataTimeValue['waterLevel'] === 'Normal'" color="success" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['waterLevel']}}</CBadge>
                    <CBadge class="large-badge" v-else color="warning" shape="pill">
                      {{this.currentSelectSensorDataTimeValue['waterLevel']}}</CBadge>
                  </CListGroupItem>
                </CListGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <div v-if="this.userSensors.hasOwnProperty('name')">
      <div v-bind:value="this.userSensors">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm="5">
                <h4 class="card-title mb-0">{{this.userSensors.name}}</h4>
                <div class="text-muted mt-1">
                  Latest data on {{ this.userSensors.sensorData[0].day}}
                </div>
              </CCol>
              <CCol sm="7" class="d-none d-md-block">
                <CButtonGroup class="float-right mr-3">
                  <CButton
                      color="outline-secondary"
                      v-for="(value, key) in ['pH', 'Temperature', 'TDS']"
                      :key="key"
                      class="mx-0"
                      :pressed="value === userSensors.param"
                      @click="userSensors.param = value"
                  >
                    {{value}}
                  </CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
            <MainChart style="height:300px;margin-top:40px;" :current-sensor="this.userSensors" :current-param="userSensors.param"/>
          </CCardBody>
        </CCard>
      </div>
    </div>
    <div v-else>
      <div v-for="(item, key) in this.userSensors" v-bind:value="item">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm="5">
                <h4 class="card-title mb-0">{{item.name}}</h4>
                <div class="text-muted">Latest data on {{ item.sensorData[0].day }}</div>
              </CCol>
              <CCol sm="7" class="d-none d-md-block">
                <CButtonGroup class="float-right mr-3">
                  <CButton
                      color="outline-secondary"
                      v-for="(value, key) in ['pH', 'Temperature', 'TDS']"
                      :key="key"
                      class="mx-0"
                      :pressed="value === item.param"
                      @click="item.param = value"
                  >
                    {{value}}
                  </CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
            <MainChart style="height:300px;margin-top:40px;" :current-sensor="item" :current-param="item.param"/>
          </CCardBody>
        </CCard>
      </div>
    </div>
  </div>
</template>

<script>
import MainChart from './charts/MainChart'
import _ from 'lodash';

export default {
  name: 'Dashboard',
  components: {
    MainChart
  },
  data () {
    return {
      currentSelectedSensorData: [],
      currentSelectedSensorDataTime: [],
      currentSelectSensorDataTimeValue: [],
      userSensors: [],
      selectedSensorName: "",
      selectedSensorDate: "",
      selectedSensorTime: "",
    }
  },
  mounted() {
    let allSensors = this.$store.state.sensor;
    let currentUser = this.$store.state.currentUser;
    this.userSensors = currentUser.role === 'admin' ? allSensors :
        allSensors.find(sen => sen.name.toLowerCase() === currentUser.access.replace(/([0-9])/g, ' $1').toLowerCase());
    console.log(this.userSensors)
  },
  methods: {
    getCurrentDate(){
      return new Date().toLocaleDateString("en-GB");
    },
    onSelectedSensor: function(e){
      this.selectedSensorName = this.userSensors.hasOwnProperty('name') ?this.userSensors.name : e.target.value;
      if (this.userSensors.hasOwnProperty('name')){
        this.currentSelectedSensorData = _.groupBy(this.userSensors.sensorData, 'day')
        console.log("On selected sensor:");
        console.log(this.currentSelectedSensorData);
      }
      else{
        this.currentSelectedSensorData = _.filter(this.userSensors, ['name', this.selectedSensorName]);
        this.currentSelectedSensorData = _.groupBy(this.currentSelectedSensorData[0].sensorData, 'day')
        console.log("On selected sensor:");
        console.log(this.currentSelectedSensorData)
      }
    },
    onSelectedSensorDate: function(e){
      this.selectedSensorDate = e.target.value;
      this.currentSelectedSensorDataTime = _.groupBy(this.currentSelectedSensorData[this.selectedSensorDate], 'hour')
      console.log("On selected date:")
      console.log(this.currentSelectedSensorDataTime);
    },
    onSelectedSensorDateTime: function(e){
      this.selectedSensorTime = e.target.value
      console.log(this.selectedSensorTime)
      this.currentSelectSensorDataTimeValue = this.currentSelectedSensorDataTime[this.selectedSensorTime][0];
      console.log("On selected time:")
      console.log(this.currentSelectSensorDataTimeValue);
    }
  },
}
</script>
