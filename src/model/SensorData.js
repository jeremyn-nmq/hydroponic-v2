let dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
export class SensorData {
    constructor(data) {
        this.date = data.key;
        this.convertedDate = (!dateFormat.test(data.key)) ? new Date(data.key * 1000).toJSON() :  new Date(data.key);
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