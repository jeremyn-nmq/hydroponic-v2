import {SensorData} from './SensorData';
export class Sensor {
    constructor(data) {
        this.name = data.key.replace(/([0-9])/g, ' $1');
        this.sensorData = Object.keys(data.Data).map(key => new SensorData({...data.Data[key], key}));
        this.param = "pH";
    }
}