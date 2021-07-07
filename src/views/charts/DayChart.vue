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
  name: 'DayChart',
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
    processedDatasets() {
      const infoStyle = getStyle('info') || '#20a8d8'
      const successStyle = getStyle('success2') || '#4dbd74'
      const dangerStyle = getStyle('danger') || '#f86c6b'

      const temp = []
      const tds = []
      const ph = []

      for(let item in this.allData){
        ph.push(this.allData[item][0].pH)
        temp.push(this.allData[item][0].temperature)
        tds.push(this.allData[item][0].tds)
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
