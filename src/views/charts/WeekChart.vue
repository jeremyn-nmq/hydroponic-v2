<template>
  <CChartLine
    :datasets="processedDatasets"
    :options="chartOptions"
    :labels="computedLabels"
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
      type: Array,
      default() {
        return [];
      },
    },
    currentParam: {
      type: String,
    }
  },
  mounted(){
    // this.initData = this.currentSensorData;
    // let dates = Object.keys(this.initData)
    // for (let date in dates){
    //   this.initData[dates[date]][0].hour = this.initData[dates[date]][0].day + ' ' + this.initData[dates[date]][0].hour
    // }
    this.allData = _.flatten(_.flatten(this.currentSensorData).filter((_,i) => i%2 === 1))
    console.log(this.allData)
    // for(let item in this.allData){
    //   this.labels.push(this.allData[item].hour)
    // }
    // console.log(this.labels)

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
    computedLabels(){
      let labels = [];
      let watcher = this.allData[0].day
      for(let item in this.allData){
        if (watcher !== this.allData[item].day){
          watcher = this.allData[item].day
          labels.push(this.allData[item].day + ' ' + this.allData[item].hour)
        }
        else labels.push(this.allData[item].hour)
      }
      labels[0] = this.allData[0].day + ' ' + this.allData[0].hour
      console.log(labels)
      return labels
    },
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
    currentSensorData: {
      immediate: true,
      deep: true,
      handler (val, oldVal) {
        console.log("Props changed")
        this.allData = _.flatten(_.flatten(val).filter((_,i) => i%2 === 1))
      }
    }
  }
}
</script>
