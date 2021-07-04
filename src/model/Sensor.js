import {SensorData} from './SensorData';
export class Sensor {
    constructor(data) {
        this.name = data.key;
        this.sensorData = Object.keys(data.Data).map(key => new SensorData({...data.Data[key], key}));
    }
}