import {SensorData} from './SensorData';
let dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
export class Sensor {
    constructor(data) {
        this.name = data.key.replace(/([0-9])/g, ' $1');
        this.sensorData = Object.keys(data.Data).map(key => new SensorData({...data.Data[key], key}));
        this.param = "pH";
    }
}