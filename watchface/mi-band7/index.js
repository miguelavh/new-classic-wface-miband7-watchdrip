//import {DebugText} from "../../shared/debug";
import {Watchdrip} from "../../utils/watchdrip/watchdrip";
import {WatchdripData} from "../../utils/watchdrip/watchdrip-data";
import {getGlobal} from "../../shared/global";
import {PointStyle} from "../../utils/watchdrip/graph/pointStyle";

import {
    BG_DELTA_TEXT,
    BG_STALE_IMG,
    BG_TIME_TEXT,
    BG_TREND_IMAGE,
    BG_VALUE_NO_DATA_TEXT,
    BG_VALUE_TEXT_IMG,
    BG_VALUE_TEXT_IMG_LOW,
    BG_VALUE_TEXT_IMG_HIGH,
    BG_VALUE_TEXT_IMG_AOD,
	BG_VALUE_TEXT_IMG_LOW_AOD,
	BG_VALUE_TEXT_IMG_HIGH_AOD,
    DIGITAL_TIME_H,
    DIGITAL_TIME_V,
    DIGITAL_TIME_AOD_H,
    DIGITAL_TIME_AOD_V,
    IMG_LOADING_PROGRESS,
    IMG_STATUS_BT_DISCONNECTED,
    XDRIP_TEXT1,
    XDRIP_TEXT2,
    // Edit masks
    EDIT_MASK_70,
    EDIT_MASK_100,
    EDIT_GROUP_XDRIP,
    CUSTOM_WIDGETS,
    // Default edit group styles
    EDIT_GROUP_DEFAULTS,
    EDIT_GROUP_W_DEFAULTS,
    EDIT_DEFAULT_IMG,
    EDIT_DEFAULT_ARC_PROGRESS,
    EDIT_DEFAULT_TEXT_IMG,
    // Top Edit Group
    EDIT_TOP_GROUP,
    EDIT_TOP_IMG,
    EDIT_TOP_ARC_PROGRESS,
    EDIT_TOP_TEXT_IMG,
	
	EDIT_LARGE_GROUP,
    EDIT_LARGE_IMG,
    EDIT_LARGE_ARC_PROGRESS,
    EDIT_LARGE_TEXT_IMG,
    // Bottom Edit Group
    EDIT_BOTTOM_GROUP,
    EDIT_BOTTOM_IMG,
    EDIT_BOTTOM_ARC_PROGRESS,
    EDIT_BOTTOM_TEXT_IMG,
    // Editable Widgets specific styles
    EDIT_HEART_IMG,
    EDIT_HEART_IMG_LEVEL,
    EDIT_HEART_TEXT_IMG,
    EDIT_STEP_IMG,
    EDIT_STEP_ARC_PROGRESS,
    EDIT_STEP_TEXT_IMG,
    EDIT_DISTANCE_IMG,
    EDIT_DISTANCE_TEXT_IMG,
    EDIT_WEATHER_CONDITION_IMG_LEVEL,
    EDIT_WEATHER_CURRENT_TEXT_IMG,
    EDIT_PAI_IMG,
    EDIT_PAI_ARC_PROGRESS,
    EDIT_PAI_TEXT_IMG,
    EDIT_UVI_IMG,
    EDIT_UVI_ARC_PROGRESS,
    EDIT_UVI_TEXT_IMG,
    EDIT_ALTIMETER_IMG,
    EDIT_ALTIMETER_TEXT_IMG,
    EDIT_MOON_IMG_LEVEL,
    EDIT_CAL_IMG,
    EDIT_CAL_ARC_PROGRESS,
    EDIT_CAL_TEXT_IMG,
    EDIT_AQI_IMG,
    EDIT_AQI_TEXT_IMG,
    EDIT_SPO2_IMG,
    EDIT_SPO2_TEXT_IMG,
    EDIT_STAND_IMG,
    EDIT_STAND_ARC_PROGRESS,
    EDIT_STAND_TEXT_IMG,
    EDIT_HUMIDITY_IMG,
    EDIT_HUMIDITY_ARC_PROGRESS,
    EDIT_HUMIDITY_TEXT_IMG,
    GRAPH_SETTINGS, 
	EDIT_GROUP_XDRIP2
} from "./styles";
//import {BG_IMG, BG_FILL_RECT} from "../../utils/config/styles_global";
import {Colors, PROGRESS_ANGLE_INC, PROGRESS_UPDATE_INTERVAL_MS, TEST_DATA} from "../../utils/config/constants";
import {DEVICE_HEIGHT, DEVICE_WIDTH} from "../../utils/config/device";

let bgValNoDataTextWidget, bgValTextImgWidget,bgValTextImgLowWidget,bgValTextImgHighWidget, bgValTimeTextWidget, bgDeltaTextWidget, bgTrendImageWidget, bgStaleLine, 
    progress,editGroupLarge;// editGroupxDrip1,editGroupxDrip2, xDripText1, xDripText2;

let batterySensor,time;

let globalNS, progressTimer, progressAngle, screenType;

let watchdrip,debug;

export const logger = Logger.getLogger("timer-page");

const IMG = 'images/'
const DW = 192
const DH = 490
const T_WIDTH = 72
const T_HEIGHT = 94
const T_SPACE = 10

const S_WIDTH = 70
const S_HEIGHT = 17
const S_SPACE = 6
const PROGRESS_TH = 22
const PROGRESS_R = (DW-PROGRESS_TH)/2-5
const P_START = 90
const P_END = 10
const P_DISABLED = 0.3
const PROGRESSES = [
    [DW/2, DW/2, -P_START, -P_END, 0],
    [DW/2, DW/2, P_START, P_END, 1],
    [DW/2, DH-DW/2, -P_START, P_END-180, 3],
    [DW/2, DH-DW/2, P_START, 180-P_END, 4]
]

const EDIT_TYPES = [
    hmUI.data_type.STEP,
    hmUI.data_type.CAL,
    hmUI.data_type.HEART,
    hmUI.data_type.PAI_WEEKLY,
    hmUI.data_type.BATTERY
]
const DEFAULTS_ORDER = [0, 1, 3, 4]

const I_DIR = IMG+'icons/'
const IL_DIR = IMG+'icons_l/'
const EDITS = [
    ['step.png', 0xffd801],
    ['cal.png',  0xff8a00],
    ['heart.png', 0xf82010],
    ['pai.png', 0x5252ff],
    ['battery.png', 0x02fa7a]
]
const I_SIZE = 20
const IL_SIZE = 30
const I_SPACE_H = 3
const I_SPACE_V = 10

const EDIT_GROUP_PROP = {
    tips_BG: IMG+'nothing.png',
    tips_x: 0,
    tips_y: 0,
    tips_width: 110
}

const C_SIZE = 70
const C1_DEFAULT = hmUI.data_type.HEART
const C2_DEFAULT = hmUI.data_type.WEATHER
const C_POS = [DH-DW/2-5, PROGRESS_TH+10]

const W_SIZE = 40

const S_I_SIZE = 16
const S_I_SPACE = 10

const timeNums = []
for (let i = 0; i < 10; i++) {
    timeNums.push(`${IMG}time_numbers/${i}.png`)
}
const dayNames = []
for (let i = 1; i <= 7; i++) {
    dayNames.push(`${IMG}days/${i}.png`)
}
const statNums = []
for (let i = 0; i < 10; i++) {
    statNums.push(`${IMG}status_numbers/s${i}.png`)
}
const statSlash = IMG+'status_numbers/slash.png'
const statInvalid = IMG+'status_numbers/dashes.png'

const wNums = []
for (let i = 0; i < 10; i++) {
    wNums.push(`${IMG}weather_numbers/w${i}.png`)
}
const wMinus = IMG+'weather_numbers/minus.png'
const wDegree = IMG+'weather_numbers/degree.png'

const weathers = []
for (let i = 1; i < 26; i++) {
    weathers.push(`${IMG}weather/${i}.png`)
}
for (let i = 0; i < 4; i++) {
    weathers.push(IMG+'nothing.png')
}

function updateTime() {
    if (typeof time !== 'undefined') 
	{
		/*const brillo = hmSetting.getBrightness();
		if(time.hour>=8 && time.hour<22 && brillo!==100)
		{
			const result = hmSetting.setBrightness(100);	
		}
		else if((time.hour>=22 || time.hour<8) && brillo!==0)
		{
			const result = hmSetting.setBrightness(0);
		}*/	
		//watchdrip.checkUpdates();
    }
}

function setBrightness(c, b) {
    let blue = c % 256
    let green = Math.floor(c/256) % 256
    let red = Math.floor(c/256/256) % 256
    return Math.floor(red*b)*256*256 + Math.floor(green*b)*256 + Math.floor(blue*b)
}

/*function initDebug() {
    globalNS.debug = new DebugText();
    debug = globalNS.debug;
	debug.setEnabled(false);
    debug.setLines(12);
}*/

function startLoader() {
    progress.setProperty(hmUI.prop.VISIBLE, true);
    progressAngle = 0;
    progress.setProperty(hmUI.prop.MORE, {angle: progressAngle});
    progressTimer = globalNS.setInterval(() => {
        updateLoader();
    }, PROGRESS_UPDATE_INTERVAL_MS);

}

function updateLoader() {
    progressAngle = progressAngle + PROGRESS_ANGLE_INC;
    if (progressAngle >= 360) progressAngle = 0;
    progress.setProperty(hmUI.prop.MORE, {angle: progressAngle});
}

function stopLoader() {
    if (progressTimer !== null) {
        globalNS.clearInterval(progressTimer);
        progressTimer = null;
    }
    progress.setProperty(hmUI.prop.VISIBLE, false);
}

function mergeStyles(styleObj1, styleObj2, styleObj3 = {}) {
    return Object.assign({}, styleObj1, styleObj2, styleObj3);
}

/*function updatexDripGroupWidgets(textWidget, editType, watchdripData) {
    if (editType === CUSTOM_WIDGETS.NONE){
        return;
    }
    const treatmentObj = watchdripData.getTreatment();
    const externalStatusObj = watchdripData.getExternal();
    let text = "";
    switch (editType) {
        case CUSTOM_WIDGETS.XDRIP_PREDICT_IOB:
            text= treatmentObj.getPredictIOB();
            break;
        case CUSTOM_WIDGETS.XDRIP_PREDICT_BWP:
            text = treatmentObj.getPredictBWP();
            break;
        case CUSTOM_WIDGETS.XDRIP_PREDICT_IOB_BWP:
            text = treatmentObj.getPredictIOB() + " " + treatmentObj.getPredictBWP();
            break;
        case CUSTOM_WIDGETS.XDRIP_TREATMENT:
            text = treatmentObj.getTreatments();
            break;
        // default xDrip data
        case CUSTOM_WIDGETS.XDRIP_TREATMENT_AND_TIME:
            let treatmentsText = treatmentObj.getTreatments();
            if (treatmentsText !== "") {
                text = treatmentsText + " " + watchdripData.getTimeAgo(treatmentObj.time);
            }
            break;
        case CUSTOM_WIDGETS.XDRIP_TREATMENT_TIME:
            let treatmentsText3 = treatmentObj.getTreatments();
            if (treatmentsText3 !== "") {
                text = watchdripData.getTimeAgo(treatmentObj.time);
            }
            break;
        case CUSTOM_WIDGETS.AAPS:
            text = externalStatusObj.getStatusLine();
            break;
        case CUSTOM_WIDGETS.AAPS_AND_TIME:
            text = externalStatusObj.getStatusLine() + " " +  watchdripData.getTimeAgo(externalStatusObj.getTime());
            break;
        case CUSTOM_WIDGETS.AAPS_TIME:
            text = watchdripData.getTimeAgo(externalStatusObj.getTime());
            break;
    }
    textWidget.setProperty(hmUI.prop.TEXT, text);
}*/

WatchFace({
    // Init View

    drawWidget(imgStyle, arcProgressStyle, textImgStyle, editType){
        switch (editType) {
            case hmUI.edit_type.HEART:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_HEART_IMG));
                hmUI.createWidget(hmUI.widget.IMG_LEVEL, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_HEART_IMG_LEVEL));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_HEART_TEXT_IMG));
                break;
            case hmUI.edit_type.STEP:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_STEP_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_STEP_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_STEP_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_STEP_TEXT_IMG));
                break;
            case hmUI.edit_type.WEATHER:
                hmUI.createWidget(hmUI.widget.IMG_LEVEL, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_WEATHER_CONDITION_IMG_LEVEL));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_WEATHER_CURRENT_TEXT_IMG));
                break;
            case hmUI.edit_type.DISTANCE:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_DISTANCE_IMG));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_DISTANCE_TEXT_IMG));
                break; 
            case hmUI.edit_type.ALTIMETER:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_ALTIMETER_IMG));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_ALTIMETER_TEXT_IMG));
                break;
            case hmUI.edit_type.UVI:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_UVI_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_UVI_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_UVI_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_UVI_TEXT_IMG));
                break;
            case hmUI.edit_type.PAI:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_PAI_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_PAI_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_PAI_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_PAI_TEXT_IMG));
                break;
            case hmUI.edit_type.MOON:
                hmUI.createWidget(hmUI.widget.IMG_LEVEL, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_MOON_IMG_LEVEL));
                break;
            case hmUI.edit_type.AQI:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_AQI_IMG));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_AQI_TEXT_IMG));
                break; 
            case hmUI.edit_type.SPO2:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_SPO2_IMG));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_SPO2_TEXT_IMG));
                break;
            case hmUI.edit_type.CAL:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_CAL_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_CAL_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_CAL_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_CAL_TEXT_IMG));
                break;
            case hmUI.edit_type.STAND:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_STAND_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_STAND_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_STAND_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_STAND_TEXT_IMG));
                break;
            case hmUI.edit_type.HUMIDITY:
                hmUI.createWidget(hmUI.widget.IMG, mergeStyles(EDIT_DEFAULT_IMG, imgStyle, EDIT_HUMIDITY_IMG));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.left, arcProgressStyle.left, EDIT_HUMIDITY_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.ARC_PROGRESS, mergeStyles(EDIT_DEFAULT_ARC_PROGRESS.right, arcProgressStyle.right, EDIT_HUMIDITY_ARC_PROGRESS));
                hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(EDIT_DEFAULT_TEXT_IMG, textImgStyle, EDIT_HUMIDITY_TEXT_IMG));
                break;
        }
    },
	
    initView() {
        screenType = hmSetting.getScreenType();

        function makeEditGroup(props) {
            return hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, props)
        }

        let opt_types = [];
        for (let [i, t] of EDIT_TYPES.entries()) {
            opt_types.push({
                type: t,
                preview: IL_DIR+EDITS[i][0]
            })
        }
		
        let c_opt_types = [
            ...opt_types,
            {
                type: hmUI.data_type.WEATHER,
                preview: IL_DIR+'weather.png'
            }
        ]
		
        let groups = [];
        for (let i of PROGRESSES.keys()) {
            groups.push(makeEditGroup({
                edit_id: 101+i,
                x: [0, DW/2][i % 2],
                y: [0, DH-DW/2][Math.floor(i/2) % 2],
                w: DW/2,
                h: DW/2,
                select_image: IMG+'masks/select.png',
                un_select_image: IMG+'masks/unselect.png',
                default_type: EDIT_TYPES[DEFAULTS_ORDER[i]],
                optional_types: opt_types,
                count: opt_types.length,
                ...EDIT_GROUP_PROP
            }))
        }
		
        const centerInfo = {
            x: (DW-C_SIZE)/2,
            w: C_SIZE,
            h: C_SIZE,
            select_image: IMG+'masks/select-c.png',
            un_select_image: IMG+'masks/unselect-c.png',
            optional_types: c_opt_types,
            count: c_opt_types.length,
            ...EDIT_GROUP_PROP
        }
		
        let centerGroup1 = makeEditGroup({
            edit_id: 110,
            y: C_POS[0]-C_SIZE,
            default_type: C1_DEFAULT,
            ...centerInfo
        })
		
        let centerGroup2 = makeEditGroup({
            edit_id: 111,
            y: C_POS[1]+C_SIZE,
            default_type: C2_DEFAULT,
            ...centerInfo
        })		
        const dateline = DH/2+T_HEIGHT+T_SPACE/2+12;
		
        editGroupLarge = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, mergeStyles(EDIT_GROUP_W_DEFAULTS, EDIT_LARGE_GROUP));
        this.drawWidget(EDIT_LARGE_IMG, EDIT_LARGE_ARC_PROGRESS, EDIT_LARGE_TEXT_IMG, editGroupLarge.getProperty(hmUI.prop.CURRENT_TYPE));

        hmUI.createWidget(hmUI.widget.IMG, { 
            x: 73,
            y: -10,
            src: IMG+'bright.png',
            show_level: hmUI.show_level.ONLY_NORMAL
        }).addEventListener(hmUI.event.CLICK_UP, function (info) {
			hmApp.startApp({url: "Settings_lightAdjustScreen", native: true})
        });

		
        let largeGroupType = editGroupLarge.getProperty(hmUI.prop.CURRENT_TYPE);
		
        // Time
        if (largeGroupType === CUSTOM_WIDGETS.NONE) 
		{
			if (screenType === hmSetting.screen_type.AOD) 
			{	
				const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, mergeStyles(DIGITAL_TIME_V, DIGITAL_TIME_AOD_V));
			}
			else
			{
				const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, DIGITAL_TIME_V);
			}
        }
		else
		{
			if (screenType === hmSetting.screen_type.AOD) 
			{	
				const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, mergeStyles(DIGITAL_TIME_H, DIGITAL_TIME_AOD_V));
			}
			else
			{
				const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, DIGITAL_TIME_H);
			}
        } 
		

        const btDisconnected = hmUI.createWidget(hmUI.widget.IMG_STATUS, IMG_STATUS_BT_DISCONNECTED);
		//time = hmSensor.createSensor(hmSensor.id.TIME);
        //time.addEventListener(time.event.MINUTEEND, updateTime);
		
        // xdrip formatting edit groups
        //editGroupxDrip1 = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, mergeStyles(EDIT_GROUP_W_DEFAULTS, EDIT_GROUP_XDRIP));
        //editGroupxDrip2 = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, mergeStyles(EDIT_GROUP_W_DEFAULTS,EDIT_GROUP_XDRIP, EDIT_GROUP_XDRIP2));
        // END editable components init

        // From modified xDrip ExternalStatusService.getLastStatusLine()
        //xDripText1 = hmUI.createWidget(hmUI.widget.TEXT, XDRIP_TEXT1);
        // From modified xDrip ExternalStatusService.getLastStatusLineTime()
        //xDripText2 = hmUI.createWidget(hmUI.widget.TEXT, XDRIP_TEXT2);
        // Weekday
        let weekW = hmUI.createWidget(hmUI.widget.IMG_WEEK, {
            x: 62,
            y: dateline,
            week_en: dayNames,
            week_tc: dayNames,
            week_sc: dayNames,
            show_level: hmUI.show_level.ONLY_NORMAL
        })

        // Date
        hmUI.createWidget(hmUI.widget.IMG_DATE, {
            day_startX: 109,
            day_startY: dateline,
            day_zero: 1,
            day_space: 1,
            day_en_array: statNums,
            day_sc_array: statNums,
            day_tc_array: statNums,
            day_unit_sc: statSlash,
            day_unit_tc: statSlash,
            day_unit_en: statSlash,

            month_startX: 144,
            month_startY: dateline,
            month_zero: 1,
            month_space: 1,
            month_en_array: statNums,
            month_sc_array: statNums,
            month_tc_array: statNums,
            show_level: hmUI.show_level.ONLY_NORMAL
        })

        // Progress bars
        function makeProgress(i, typei) {
			p = PROGRESSES[i]
            let props = {
                center_x: p[0],
                center_y: p[1],
                radius: PROGRESS_R,
                start_angle: p[2],
                end_angle: p[3],
                show_level: hmUI.show_level.ONLY_NORMAL
            }
            hmUI.createWidget(hmUI.widget.ARC_PROGRESS, { // background
                ...props,
                line_width: PROGRESS_TH-2,
                color: setBrightness(EDITS[typei][1], P_DISABLED),
                level: 100
            })
            hmUI.createWidget(hmUI.widget.ARC_PROGRESS, { // progress
                ...props,
                line_width: PROGRESS_TH,
                color: EDITS[typei][1],
                type: EDIT_TYPES[typei],
            })
            hmUI.createWidget(hmUI.widget.IMG, { // icon
                x: [I_SPACE_H, DW-I_SIZE-I_SPACE_H][i % 2],
                y: [DW/2+I_SPACE_V, DH-DW/2-I_SIZE-I_SPACE_V][Math.floor(i/2) % 2],
                src: I_DIR+EDITS[typei][0],
                show_level: hmUI.show_level.ONLY_NORMAL
            })
            hmUI.createWidget(hmUI.widget.TEXT_IMG, { // text
                x: [I_SIZE+2*S_SPACE, DW-I_SIZE-2*S_SPACE-S_WIDTH][i % 2],
                y: [DW/2+I_SPACE_V+I_SIZE-S_HEIGHT, DH-DW/2][Math.floor(i/2) % 2],
                w: S_WIDTH,
                h: I_SIZE,
                font_array: statNums,
                h_space: 2,
                align_h: [hmUI.align.LEFT, hmUI.align.RIGHT][i % 2],
                type: EDIT_TYPES[typei],
                invalid_image: statInvalid,
                show_level: hmUI.show_level.ONLY_NORMAL
            })
        }
		
        for (let i of PROGRESSES.keys()) {
            makeProgress(i, EDIT_TYPES.indexOf(groups[i].getProperty(hmUI.prop.CURRENT_TYPE)))
        }
        for (let i of PROGRESSES.keys()) {
            if (groups[i].getProperty(hmUI.prop.CURRENT_TYPE) === hmUI.data_type.PAI_WEEKLY) {
                hmUI.createWidget(hmUI.widget.IMG, {
                    x: [0, DW / 2][i % 2],
                    y: [0, DH - DW / 2 - I_SIZE - I_SPACE_V][Math.floor(i / 2) % 2],
                    w: DW / 2,
                    h: DW / 2 + I_SIZE + I_SPACE_V,
                    //type: groups[i].getProperty(hmUI.prop.CURRENT_TYPE)
                }).addEventListener(hmUI.event.CLICK_UP, function (info) {
                    hmApp.startApp({ url: 'pai_app_Screen', native: true })
                });
            } else {
                hmUI.createWidget(hmUI.widget.IMG_CLICK, {
                    x: [0, DW / 2][i % 2],
                    y: [0, DH - DW / 2 - I_SIZE - I_SPACE_V][Math.floor(i / 2) % 2],
                    w: DW / 2,
                    h: DW / 2 + I_SIZE + I_SPACE_V,
                    type: groups[i].getProperty(hmUI.prop.CURRENT_TYPE)
                })
            }
        }

        // Center widgets
        function makeWidget(cType, current_y) {
            // Center widget
            hmUI.createWidget(hmUI.widget.IMG, { // icon
                x: (DW-IL_SIZE)/2,
                y: current_y,
                src: IL_DIR+EDITS[EDIT_TYPES.indexOf(cType)][0],
                show_level: hmUI.show_level.ONLY_NORMAL
            })
            hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                x: 0,
                y: current_y+IL_SIZE+I_SPACE_V,
                w: DW,
                align_h: hmUI.align.CENTER_H,
                h_space: 2,
                font_array: wNums,
                type: cType,
                show_level: hmUI.show_level.ONLY_NORMAL
            })
            hmUI.createWidget(hmUI.widget.IMG_CLICK, {
                x: (DW-IL_SIZE)/2,
                y: current_y,
                w: IL_SIZE,
                h: IL_SIZE+I_SPACE_V+20,
                type: cType
            })
        }
        function makeWeather(current_y) {
            // Weather
            let weatherWidget = hmUI.createWidget(hmUI.widget.IMG_LEVEL, { // icon
                x: (DW-W_SIZE)/2,
                y: current_y,
                image_array: weathers,
                image_length: weathers.length,
                type: hmUI.data_type.WEATHER,
                show_level: hmUI.show_level.ONLY_NORMAL
            })
            hmUI.createWidget(hmUI.widget.TEXT_IMG, { // temperature
                x: 0,
                y: current_y+W_SIZE+I_SPACE_V,
                w: DW,
                align_h: hmUI.align.CENTER_H,
                h_space: 2,
                font_array: wNums,
                negative_image: wMinus,
                unit_sc: wDegree,
                unit_en: wDegree,
                unit_tc: wDegree,
                type: hmUI.data_type.WEATHER_CURRENT,
                show_level: hmUI.show_level.ONLY_NORMAL
            })/*.addEventListener(hmUI.event.CLICK_UP, function (info) {
					hmApp.startApp({url: "Settings_lightAdjustScreen", native: true})
					//hmApp.startApp({url: "Settings_displayBrightScreen", native: true})
					//hmApp.startApp({ appid: 33904, url: 'page/MainScreen', native: false })
                    //hmApp.startApp({ url: 'BrightnessScreen', native: true })
					//hmApp.gotoPage({ url: 'brigthness', param: '...' })
					//hmApp.gotoPage({ appid: 1, url: 'Settings_lightAdjustScreen', native: true})
                });*/
            hmUI.createWidget(hmUI.widget.IMG_CLICK, {
                x: (DW-W_SIZE)/2,
                y: current_y,
                w: W_SIZE,
                h: W_SIZE+I_SPACE_V+20,
                type: hmUI.data_type.WEATHER
            })
        }
        let cTypes = [
            centerGroup1.getProperty(hmUI.prop.CURRENT_TYPE),
            centerGroup2.getProperty(hmUI.prop.CURRENT_TYPE)
        ]
        for (let i in cTypes) {
            if (cTypes[i] === hmUI.data_type.WEATHER) {
                makeWeather(C_POS[i])
            } else {
                makeWidget(cTypes[i], C_POS[i])
            }
        }

        // Status
        /*hmUI.createWidget(hmUI.widget.IMG_STATUS, { // bluetooth
            x: 2,
            y: DH/2-S_I_SIZE-S_I_SPACE/2,
            type: hmUI.system_status.DISCONNECT,
            src: IMG+'bt0.png',
            show_level: hmUI.show_level.ONLY_NORMAL
        })*/
        /*hmUI.createWidget(hmUI.widget.IMG_STATUS, { // dnd
            x: 2,
            y: DH/2+S_I_SPACE/2,
            type: hmUI.system_status.DISTURB,
            src: IMG+'dnd1.png',
            show_level: hmUI.show_level.ONLY_NORMAL
        })*/
		
        hmUI.createWidget(hmUI.widget.IMG, { 
            x: 73,
            y: -10,
            src: IMG+'bright.png',
            show_level: hmUI.show_level.ONLY_NORMAL
        }).addEventListener(hmUI.event.CLICK_UP, function (info) {
			hmApp.startApp({url: "Settings_lightAdjustScreen", native: true})
        });

        if (screenType === hmSetting.screen_type.AOD) {
            bgValTextImgWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(BG_VALUE_TEXT_IMG, BG_VALUE_TEXT_IMG_AOD));
			bgValTextImgLowWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(BG_VALUE_TEXT_IMG_LOW, BG_VALUE_TEXT_IMG_LOW_AOD));
			bgValTextImgHighWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, mergeStyles(BG_VALUE_TEXT_IMG_HIGH, BG_VALUE_TEXT_IMG_HIGH_AOD));
        } else {
            bgValTextImgWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG);
			bgValTextImgLowWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG_LOW);
			bgValTextImgHighWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG_HIGH);
        };
		
        bgValNoDataTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_VALUE_NO_DATA_TEXT);
        bgValTimeTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_TIME_TEXT);
        bgDeltaTextWidget = hmUI.createWidget(hmUI.widget.TEXT, BG_DELTA_TEXT);
        bgTrendImageWidget = hmUI.createWidget(hmUI.widget.IMG, BG_TREND_IMAGE);
        bgStaleLine = hmUI.createWidget(hmUI.widget.IMG, BG_STALE_IMG);
        progress = hmUI.createWidget(hmUI.widget.IMG, IMG_LOADING_PROGRESS);
        stopLoader();
	},


    updateStart() {
        bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, false);
        bgDeltaTextWidget.setProperty(hmUI.prop.VISIBLE, false);
        bgTrendImageWidget.setProperty(hmUI.prop.VISIBLE, false);
        startLoader();
    },
    updateFinish(isSuccess) {
        stopLoader();
        bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, true);
        bgDeltaTextWidget.setProperty(hmUI.prop.VISIBLE, true);
        bgTrendImageWidget.setProperty(hmUI.prop.VISIBLE, true);
    },

    /**
     * @param {WatchdripData} watchdripData The watchdrip data info
     */
    updateValuesWidget(watchdripData) {
		
        if (watchdripData === undefined) return;
        const bgObj = watchdripData.getBg();

        if (bgObj.isHasData()) {
            if (bgObj.isHigh || bgObj.isLow) {
                if (bgObj.isHigh) {
					bgValTextImgHighWidget.setProperty(hmUI.prop.TEXT, bgObj.getBGVal());
                    bgValTextImgHighWidget.setProperty(hmUI.prop.VISIBLE, true);
					bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, false);
					bgValTextImgLowWidget.setProperty(hmUI.prop.VISIBLE, false);
                };
                if (bgObj.isLow) {
					bgValTextImgLowWidget.setProperty(hmUI.prop.TEXT, bgObj.getBGVal());
                    bgValTextImgLowWidget.setProperty(hmUI.prop.VISIBLE, true);
					bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, false);
					bgValTextImgHighWidget.setProperty(hmUI.prop.VISIBLE, false);
                };
            } else {
				bgValTextImgWidget.setProperty(hmUI.prop.TEXT, bgObj.getBGVal());
                bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, true);
				bgValTextImgLowWidget.setProperty(hmUI.prop.VISIBLE, false);
				bgValTextImgHighWidget.setProperty(hmUI.prop.VISIBLE, false);
            }
            
            bgValNoDataTextWidget.setProperty(hmUI.prop.VISIBLE, false);
//			bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, true);
        } else {
            bgValNoDataTextWidget.setProperty(hmUI.prop.VISIBLE, true);
            bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, false);
            bgValTextImgLowWidget.setProperty(hmUI.prop.VISIBLE, false);
            bgValTextImgHighWidget.setProperty(hmUI.prop.VISIBLE, false);
        }
		

        bgDeltaTextWidget.setProperty(hmUI.prop.TEXT, bgObj.delta);
        bgTrendImageWidget.setProperty(hmUI.prop.SRC, bgObj.getArrowResource());

        //updatexDripGroupWidgets(xDripText1,editGroupxDrip1.getProperty(hmUI.prop.CURRENT_TYPE), watchdripData);
        //updatexDripGroupWidgets(xDripText2,editGroupxDrip2.getProperty(hmUI.prop.CURRENT_TYPE), watchdripData);

        if (TEST_DATA) {
            bgStatusLow.setProperty(hmUI.prop.VISIBLE, true);
            bgStatusOk.setProperty(hmUI.prop.VISIBLE, true);
            bgStatusHigh.setProperty(hmUI.prop.VISIBLE, true);
            bgValTimeTextWidget.setProperty(hmUI.prop.VISIBLE, true);
        }
    },

    /**
     * @param {WatchdripData} watchdripData The watchdrip data info
     */
    updateTimesWidget(watchdripData) {
        if (watchdripData === undefined) return;
        const bgObj = watchdripData.getBg();
        bgValTimeTextWidget.setProperty(hmUI.prop.TEXT, watchdripData.getTimeAgo(bgObj.time));

        bgStaleLine.setProperty(hmUI.prop.VISIBLE, watchdripData.isBgStale());

        //updatexDripGroupWidgets(xDripText1,editGroupxDrip1.getProperty(hmUI.prop.CURRENT_TYPE), watchdripData);
        //updatexDripGroupWidgets(xDripText2,editGroupxDrip2.getProperty(hmUI.prop.CURRENT_TYPE), watchdripData);
    },

    onInit() {
        logger.log("wf on init invoke");
    },

    build() {
                try{
                    logger.log("wf on build invoke");
                    globalNS = getGlobal();
                    //initDebug();
                    //debug.log("build");
                    this.initView();
                    globalNS.watchdrip = new Watchdrip();
                    watchdrip = globalNS.watchdrip;
                    watchdrip.prepare();
                    watchdrip.setUpdateValueWidgetCallback(this.updateValuesWidget);
                    watchdrip.setUpdateTimesWidgetCallback(this.updateTimesWidget);
                    watchdrip.setOnUpdateStartCallback(this.updateStart);
                    watchdrip.setOnUpdateFinishCallback(this.updateFinish);

                    //graph configuration
                    let largeGroupType = editGroupLarge.getProperty(hmUI.prop.CURRENT_TYPE);

                    let lineStyles = {};
                    const POINT_SIZE = GRAPH_SETTINGS.point_size
                    const TREATMENT_POINT_SIZE = GRAPH_SETTINGS.treatment_point_size
                    const LINE_SIZE = GRAPH_SETTINGS.line_size
                    lineStyles['predict'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
                    lineStyles['high'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
                    lineStyles['low'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
                    lineStyles['inRange'] = new PointStyle(POINT_SIZE, POINT_SIZE, POINT_SIZE);
                    if (largeGroupType === CUSTOM_WIDGETS.GRAPH_LOW_HIGH_LINES) {
                        lineStyles['lineLow'] = new PointStyle("", LINE_SIZE);
                        lineStyles['lineHigh'] = new PointStyle("", LINE_SIZE);
                    }
                    lineStyles['treatment'] = new PointStyle(TREATMENT_POINT_SIZE, TREATMENT_POINT_SIZE);

                    var RECT = {
                        x: GRAPH_SETTINGS.x,
                        y: GRAPH_SETTINGS.y,
                        w: GRAPH_SETTINGS.w,
                        h: GRAPH_SETTINGS.h,
                        color: Colors.accent,
                    }
                    // hmUI.createWidget(hmUI.widget.FILL_RECT, RECT);
                    watchdrip.createGraph(GRAPH_SETTINGS.x,GRAPH_SETTINGS.y,GRAPH_SETTINGS.w,GRAPH_SETTINGS.h, lineStyles);
					if (largeGroupType === CUSTOM_WIDGETS.NONE) 
					{
                        watchdrip.graph.setVisibility(false);
                    }

                    /*if (editGroupxDrip1.getProperty(hmUI.prop.CURRENT_TYPE) === CUSTOM_WIDGETS.NONE){
                        xDripText1.setProperty(hmUI.prop.VISIBLE, false);
                    }

                    if (editGroupxDrip2.getProperty(hmUI.prop.CURRENT_TYPE) === CUSTOM_WIDGETS.NONE){
                        xDripText2.setProperty(hmUI.prop.VISIBLE, false);
                    }*/

                    watchdrip.start();
                }
                catch (e) {
                    /*debug.log('LifeCycle Error: ', e)
                    e && e.stack && e.stack.split(/\n/).forEach((i) => debug.log('error stack', i))*/
                }
    },
       onDestroy() {
           logger.log("wf on destroy invoke");
           watchdrip.destroy();
           stopLoader();
       },

       onShow() {
           //debug.log("onShow");
       },

       onHide() {
           //debug.log("onHide");
       },
});
