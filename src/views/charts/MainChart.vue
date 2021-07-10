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
      labels: [],
      transformedData: []
    }
  },
  props: {
    currentSensor: {
      type: Object,
      default() {
        return {};
      },
    },
    currentParam: {
      type: String,
    },
  },
  mounted(){
    let latestDay = this.currentSensor.sensorData[0].day;

    this.transformedData = _.groupBy(_.groupBy(this.currentSensor.sensorData, 'day')[latestDay], 'hour')
    this.labels = Object.keys(this.transformedData);
  },
  computed: {
    pHDatasets () {
      const brandInfo = getStyle('info') || '#20a8d8'

      const pH = []

      let allData = Object.values(this.transformedData);
      for(let item in allData){
        pH.push(allData[item][0].pH)
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

      let allData = Object.values(this.transformedData);
      for(let item in allData){
        tds.push(allData[item][0].tds)
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

      let allData = Object.values(this.transformedData);
      for(let item in allData){
        temp.push(allData[item][0].temperature)
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
            radius: 5,
            hitRadius: 15,
            hoverRadius: 10,
            hoverBorderWidth: 3
          }
        }
      }
    }
  }
}
</script>
