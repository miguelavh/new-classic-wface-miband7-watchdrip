import {BgData} from "./model/bgData";
import {StatusData} from "./model/statusData";
import {MINUTE_IN_MS, niceTime} from "../../shared/date";
import {TreatmentData} from "./model/treatmentData";
import {PumpData} from "./model/pumpData";
import {GraphData} from "./model/graphData";
import {ExternalData} from "./model/externalData";


const BG_STALE_TIME_MS = 13 * MINUTE_IN_MS;
const TIMEAGO_STALE = 24* 60 * MINUTE_IN_MS;

export class WatchdripData {
    constructor(timeSensor) {
        this.timeSensor = timeSensor;
        /** @var BgData $object */
        this.bg = BgData.createEmpty();
        /** @var StatusData $object */
        this.status = StatusData.createEmpty();
        /** @var TreatmentData $object */
        this.treatment = TreatmentData.createEmpty();
        /** @var PumpData $object */
        this.pump = PumpData.createEmpty();
        /** @var GraphData $object */
        this.graph = GraphData.createEmpty();
        /* defines the difference in time between phone and watch*/
        this.timeDiff = 0;
    }

    updateTimeDiff() {
        if (!this.getStatus().now) {
            this.timeDiff = 0;
        } else {
            this.timeDiff = this.timeSensor.utc - this.getStatus().now;
        }
    }

    setData(data) {
        if (data['bg'] === undefined) {
            this.bg = BgData.createEmpty();
        } else {
            this.bg = Object.assign(BgData.prototype, data['bg']);
        }

        if (data['status'] === undefined) {
            this.status = StatusData.createEmpty();
        } else {
            this.status = Object.assign(StatusData.prototype, data['status']);
        }
        if (data['treatment'] === undefined) {
            this.treatment = TreatmentData.createEmpty();
        } else {
            this.treatment = Object.assign(TreatmentData.prototype, data['treatment']);
        }
        if (data['pump'] === undefined) {
            this.pump = PumpData.createEmpty();
        } else {
            this.pump = Object.assign(PumpData.prototype, data['pump']);
        }

        if (data['graph'] === undefined) {
            this.graph = GraphData.createEmpty();
        } else {
            this.graph = Object.assign(GraphData.prototype, data['graph']);
        }

        if (data['external'] === undefined) {
            this.external = ExternalData.createEmpty();
        } else {
            this.external = Object.assign(ExternalData.prototype, data['external']);
        }
    }

    /** @return BgData $object */
    getBg() {
        return this.bg;
    }

    /** @return StatusData $object */
    getStatus() {
        return this.status;
    }

    /** @return TreatmentData $object */
    getTreatment() {
        return this.treatment;
    }

    /** @return PumpData $object */
    getPump() {
        return this.pump;
    }

    /** @return ExternalData $object */
    getExternal() {
        return this.external;
    }

    /** @return GraphData $object */
    getGraph() {
        return this.graph;
    }

    isBgStale() {
        if (this.getBg().isHasData()) {
            return this.getBg().isStale || (this.timeSensor.utc - this.getBg().time - this.timeDiff) > BG_STALE_TIME_MS;
        } else {
            return false;
        }
    }

    getTimeAgo(time) {
        if (time == null || 0) return "";
        let timeInt = parseInt(time);
        let timeAgo =  this.timeSensor.utc - timeInt - this.timeDiff;
        if (timeAgo > TIMEAGO_STALE) return "";
        return niceTime(timeAgo);
    }
}
