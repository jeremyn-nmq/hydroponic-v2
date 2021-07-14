<template>
  <CChartLine
    :datasets="processedDatasets"
    :options="chartOptions"
    :labels="this.labels"
  />
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'
import _ from "lodash";

export default {
  name: 'WeekChart',
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
    }
  },
  mounted(){
    this.initData = {}
    this.allData = []
    this.initData = this.currentSensorData;
    let dates = Object.keys(this.initData)
    for (let date in dates){
      this.initData[dates[date]][0].hour = this.initData[dates[date]][0].day + ' ' + this.initData[dates[date]][0].hour
    }
    this.allData = _.flatten(Object.values(this.initData))
    this.labels = [];
    for(let item in this.allData){
      this.labels.push(this.allData[item].hour)
    }

  },
  methods: {
    // calculateData (data){
    //   let dates = Object.keys(data)
    //   for (let date in dates){
    //     data[dates[date]][0].hour = data[dates[date]][0].day + ' ' + data[dates[date]][0].hour
    //   }
    //   return data
    // },
    // calculateLabel (data){
    //   let labelsArray = []
    //   for(let item in data){
    //     labelsArray.push(data[item].hour)
    //   }
    // }
  },
  computed: {
    processedDatasets() {
      const infoStyle = getStyle('info') || '#20a8d8'
      const successStyle = getStyle('success2') || '#4dbd74'
      const dangerStyle = getStyle('danger') || '#f86c6b'

      const temp = []
      const tds = []
      const ph = []

      for(let item in this.allData){
        ph.push(this.allData[item].pH)
        temp.push(this.allData[item].temperature)
        tds.push(this.allData[item].tds)
      }

      let color = (this.currentParam === 'pH') ? infoStyle : (this.currentParam === 'TDS') ? successStyle : dangerStyle;
      let returnedData = (this.currentParam === 'pH') ? ph : (this.currentParam === 'TDS') ? tds : temp;

      return [{
        label: this.currentParam,
        backgroundColor: hexToRgba(color, 10),
        borderColor: color,
        pointHoverBackgroundColor: color,
        borderWidth: 2,
        data: returnedData
      }]
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
  // watch: {
  //   myProp: {
  //     immediate: true,
  //     handler (val, oldVal) {
  //       console.log("Props changed")
  //       console.log(val)
  //     }
  //   }
  // }
}
</script>
