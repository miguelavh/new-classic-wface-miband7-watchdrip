import {ALARM_UPDATE_INTERVAL} from "./constants";

export const WATCHDRIP_APP_ID = "28962";

export const WF_INFO = "watchdrip_info";
export const WF_INFO_LAST_UPDATE = "watchdrip_info_last";
export const WF_INFO_LAST_UPDATE_ATTEMPT = "watchdrip_last_attempt";
export const WF_INFO_LAST_UPDATE_SUCCESS = "watchdrip_last_success";

export const WATCHDRIP_CONFIG = "watchdrip_config";
export const WATCHDRIP_CONFIG_LAST_UPDATE = "watchdrip_config_time";

export const WF_INFO_DIR = "/storage/watchdrip";
export const WF_INFO_FILE = WF_INFO_DIR + "/info.json";

export const WATCHDRIP_CONFIG_DEFAULTS = {
    disableUpdates: false,
    showLog: false,
    useAppFetch: false,
};

export const WATCHDRIP_ALARM_CONFIG_DEFAULTS = {
    fetchInterval: ALARM_UPDATE_INTERVAL,
    fetchParams: "graph=1"
};