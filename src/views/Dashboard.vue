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
            <select v-model="selectedSensorName" class="custom-select mb-2" id="sensor-select-1" v-on:change="onSelectedSensor($event)">
              <option class="custom-select" value="" disabled hidden>Select sensor</option>
              <option class="custom-select" v-bind:value="this.userSensors.name">
                {{this.userSensors.name}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow v-else>
          <CCol sm="12">
            <label for="sensor-select-2">Choose a sensor:</label>
            <select v-model="selectedSensorName" class="custom-select mb-2" id="sensor-select-2" v-on:change="onSelectedSensor($event)">
              <option class="custom-select" value="" disabled hidden>Select sensor</option>
              <option class="custom-select"  v-for="(item, key) in this.userSensors" v-bind:value="item.name">
                {{item.name}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <label for="sensor-date-select">Choose a date:</label>
            <select v-model="selectedSensorDate" class="custom-select mb-2" id="sensor-date-select" v-on:change="onSelectedSensorDate($event)">
              <option class="custom-select"  value="" disabled hidden>Select date</option>
              <option class="custom-select"  v-for="(item, key) in this.currentSelectedSensorData" v-bind:value="key">
                {{key}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <label for="sensor-time-select">Choose a time slot to view details:</label>
            <select v-model="selectedSensorTime" class="custom-select mb-2" id="sensor-time-select" v-on:change="onSelectedSensorDateTime($event)">
              <option class="custom-select" value="" disabled hidden>Select time slot</option>
              <option class="custom-select" v-for="(item, key) in this.currentSelectedSensorDataTime" v-bind:value="key">
                {{key}}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow class="mt-1" v-if="Object.entries(this.currentSelectSensorDataTimeValue).length !== 0">
          <CCol>
            <CCard>
              <CButton class="text-left shadow-none card-header" @click="cardCollapse = !cardCollapse">
                  <CIcon name="cil-justify-center"/>
                  <strong> Data for {{selectedSensorName.replace(/([^A-Za-z0-9])/g, ' $1')}} on
                    {{this.selectedSensorDate}} at {{this.selectedSensorTime}} </strong>
              </CButton>
              <CCollapse :show="cardCollapse">
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
              </CCollapse>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <div v-if="this.selectedSensorName.length && this.selectedSensorDate.length">
      <div v-bind:value="this.currentSelectedSensorData">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <h4 class="card-title mb-0">{{this.selectedSensorName}}</h4>
                <div v-show="selectedChart === 'Day'" class="text-muted mt-1">
                  Latest data on {{ this.selectedSensorDate}}
                </div>
                <div v-show="selectedChart === 'Week'" class="text-muted mt-1">
                  Latest data of the previous 7 days, from {{this.weekDayFromDate[this.weekDayFromDate.length-1]}} to {{ this.weekDayFromDate[0]}}
                </div>
              </CCol>
              <CCol sm="4" class="">
                <CButtonGroup class="d-flex flex-row mr-3">
                  <CButton
                      color="outline-secondary"
                      v-for="(value, key) in ['pH', 'Temperature', 'TDS']"
                      :key="key"
                      class="mx-0"
                      :pressed="value === selectedParam"
                      @click="selectedParam = value"
                  >
                    {{value}}
                  </CButton>
                </CButtonGroup>
              </CCol>
              <CCol sm="4" class="d-none d-md-block">
                <CButtonGroup class="float-right mr-3">
                  <CButton
                      color="outline-secondary"
                      v-for="(value, key) in ['Day', 'Week', 'Month']"
                      :key="key"
                      class="mx-0"
                      :pressed="value === selectedChart"
                      @click="selectedChart = value"
                  >
                    {{value}}
                  </CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
            <DayChart style="height:300px;margin-top:40px;"
                       v-show="selectedChart === 'Day'"
                       :current-sensor-data="this.currentSelectedSensorData"
                       :current-date="this.selectedSensorDate"
                       :current-param="selectedParam"/>
            <WeekChart style="height:300px;margin-top:40px;"
                      v-show="selectedChart === 'Week'"
                      :current-sensor-data="this.filteredWeekData"
                      :current-param="selectedParam"/>
          </CCardBody>
        </CCard>
      </div>
    </div>
  </div>
</template>

<script>
import DayChart from './charts/DayChart'
import WeekChart from './charts/WeekChart'
import _ from 'lodash';

export default {
  name: 'Dashboard',
  components: {
    DayChart,
    WeekChart
  },
  data () {
    return {
      cardCollapse: false,
      selectedParam: 'pH',
      selectedChart: 'Day',
      currentSelectedSensorData: [],
      currentSelectedSensorDataTime: [],
      currentSelectSensorDataTimeValue: [],
      filteredWeekData: [],
      userSensors: [],
      weekDayFromDate: [],
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
  },
  methods: {
    getCurrentDate(){
      return new Date().toLocaleDateString("en-GB");
    },
    onSelectedSensor: function(e){
      this.selectedSensorName = this.userSensors.hasOwnProperty('name') ? this.userSensors.name : e.target.value;
      this.selectedSensorDate = "";
      this.selectedSensorTime = "";
      this.currentSelectedSensorData = [];
      this.currentSelectedSensorDataTime = [];
      this.currentSelectSensorDataTimeValue = [];
      this.filteredWeekData = [];
      this.weekDayFromDate = [];
      if (this.userSensors.hasOwnProperty('name')){
        this.currentSelectedSensorData = _.groupBy(this.userSensors.sensorData, 'day')
        console.log("On selected sensor:");
        console.log(this.currentSelectedSensorData);
        this.$store.commit("SET_CURRENT_SENSOR_CHOICE", this.currentSelectedSensorData)
      }
      else{
        this.currentSelectedSensorData = _.filter(this.userSensors, ['name', this.selectedSensorName]);
        this.currentSelectedSensorData = _.groupBy(this.currentSelectedSensorData[0].sensorData, 'day')
        console.log("On selected sensor:");
        console.log(this.currentSelectedSensorData)
        this.$store.commit("SET_CURRENT_SENSOR_CHOICE", this.currentSelectedSensorData)
      }
    },
    onSelectedSensorDate: function(e){
      this.selectedSensorDate = e.target.value;
      this.selectedSensorTime = "";
      this.weekDayFromDate = [];
      this.currentSelectedSensorDataTime = [];
      this.currentSelectSensorDataTimeValue = [];

      //calculate data for week view
      let convertSelectedDate = Date.parse(this.selectedSensorDate.split('/').reverse().join('-'))
      this.weekDayFromDate = Array(7).fill(convertSelectedDate)
          .map((date, i) => date - 86400000 * i).map(day => new Date(day).toLocaleDateString('en-GB'))
      console.log(this.weekDayFromDate)
      this.filteredWeekData = [];
      this.filteredWeekData = Object.entries(this.currentSelectedSensorData).filter(d => this.weekDayFromDate.includes(d[0]))
      let divider = this.filteredWeekData.length
      console.log(divider)
      this.filteredWeekData.forEach(data => {
        data[1] = data[1].filter((value, index) => index % (divider === 1 ? 1 : divider < 3 ? 12 : divider === 7 ? 36 : 24) === 0)
      })


      //calculate data for timeslot selected
      this.currentSelectedSensorDataTime = _.groupBy(this.currentSelectedSensorData[this.selectedSensorDate], 'hour')
      // console.log("On selected date:")
      // console.log(this.currentSelectedSensorDataTime);
      this.$store.commit("SET_CURRENT_TIME_CHOICE", this.currentSelectedSensorDataTime)
    },
    onSelectedSensorDateTime: function(e){
      this.selectedSensorTime = e.target.value
      this.currentSelectSensorDataTimeValue = this.currentSelectedSensorDataTime[this.selectedSensorTime][0];
      // console.log("On selected time:")
      // console.log(this.currentSelectSensorDataTimeValue);
    }
  },
}
</script>
