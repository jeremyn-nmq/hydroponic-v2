export class SensorData {
    constructor(data) {
        this.date = data.key;
        this.convertedDate = new Date(data.key * 1000).toJSON();
        this.day = new Date(this.convertedDate).toLocaleDateString("en-GB");
        this.hour = new Date(this.convertedDate).toLocaleTimeString("en-GB");
        this.pump1 = data["Pump 1 status"];
        this.pump2 = data["Pump 2 status"];
        this.pH = data.pH;
        this.tds = data.tds;
        this.temperature = data.temperature;
        this.waterLevel = data["water level"];
    }
}