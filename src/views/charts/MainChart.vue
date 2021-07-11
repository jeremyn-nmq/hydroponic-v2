<template>
  <CChartLine
    :datasets="(currentParam === 'pH') ? pHDatasets : (currentParam === 'TDS') ? tdsDatasets : tempDatasets"
    :options="chartOptions"
    :labels="this.labels"
  />
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'
import _ from "lodash";

export default {
  name: 'MainChart',
  components: {
    CChartLine
  },
  data () {
    return {
      initData: {},
      initDate: "",
      labels: [],
      allData: [],
    }
  },
  props: {
    currentSensorData: {
      type: Object,
      default() {
        return {};
      },
    },
    currentParam: {
      type: String,
    },
    currentDate: {
      type: String,
    },
  },
  mounted(){

    // let latestDay = this.currentSensor.sensorData[0].day;
    // this.transformedData = _.groupBy(_.groupBy(this.currentSensor.sensorData, 'day')[latestDay], 'hour')
    this.initData = this.calculateData(this.currentSensorData, this.currentDate);
    this.labels = Object.keys(this.initData);
    this.allData = Object.values(this.initData);
  },
  methods: {
    calculateData (data, date){
      return _.groupBy(data[date], 'hour');
    },
  },
  computed: {
    changeData(){
      const {currentSensorData, currentDate} = this
      return {currentSensorData, currentDate}
    },
    pHDatasets () {
      const brandInfo = getStyle('info') || '#20a8d8'

      const pH = []

      for(let item in this.allData){
        pH.push(this.allData[item][0].pH)
      }

      return [
        {
          label: 'pH',
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          data: pH
        }
      ]
    },
    tdsDatasets () {
      const brandSuccess = getStyle('success2') || '#4dbd74'

      const tds = []

      for(let item in this.allData){
        tds.push(this.allData[item][0].tds)
      }

      return [
        {
          label: 'TDS',
          backgroundColor: hexToRgba(brandSuccess, 10),
          borderColor: brandSuccess,
          pointHoverBackgroundColor: brandSuccess,
          borderWidth: 2,
          data: tds
        }
      ]
    },
    tempDatasets () {
      const brandDanger = getStyle('danger') || '#f86c6b'

      const temp = []

      for(let item in this.allData){
        temp.push(this.allData[item][0].temperature)
      }

      return [
        {
          label: 'Temperature',
          backgroundColor: hexToRgba(brandDanger, 10),
          borderColor: brandDanger,
          pointHoverBackgroundColor: brandDanger,
          borderWidth: 2,
          data: temp
        }
      ]
    },
    chartOptions () {
      return {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 2,
            hitRadius: 5,
            hoverRadius: 5,
            hoverBorderWidth: 2
          }
        }
      }
    }
  },
  watch: {
    changeData: {
      handler: function(val) {
        let newData = this.calculateData(val.currentSensorData, val.currentDate);
        this.labels = Object.keys(newData);
        this.allData = Object.values(newData);
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
