// constants

var app = angular.module("app");
/*
 * Application Action
 */
app.constant("APP_NAME", "Smart Paper!");
app.constant("ENCRYPT_DECRYPT_STATUS", "1"); //0 =decrypt,1=encrypt
app.constant("APP_PARAM", {
  ROLE_TYPE_NH: "NH",
  ROLE_TYPE_PH: "PH",
  ROLE_TYPE_UNIT: "UN",
  PHARMACY_ADMIN_ROLE_CODE: "PHADM",
  STORE_ADMIN_ROLE_CODE: "STRADM",
  LEXMARK_PRINTER_MODEL_CODE: "LEXMARK",
  HP_PRINTER_MODEL_CODE: "PML_HP",
  PKEY: "",
  TPL_GROUP_NEWADMISSION: "NEWADMISSION",
  TPL_GROUP_PRESCRIPTION: "PRESCRIPTION",
  TPL_GROUP_PMR: "PMR",
});
app.constant("APP_ACTION", {
  LOGIN: "loginUser",
  REGISTER_COMPANY: "registerCompany",
  GET_DASHBORD_DATA: "getDashbordData",
  GET_DRP_USER_FACILITY_BY_STORE: "getDrpUserFacilityByStore",
  GET_DRP_UNIT_BY_FACILITY: "getDrpUnitByFacility",
  GET_DRP_SELECTED_FACILITY_BY_USER: "getDrpSelectedFacilityByUser",
  GET_DRP_SELECTED_WARD_BY_USER: "getDrpSelectedWardByUser",
  GET_DRP_USER_WARD_BY_STORE: "getDrpUserWardByStore",
  GET_DRP_FACILITY: "getDrpfacility",
  GET_DRP_FACILITY_BY_STORE: "getDrpFacilityByStore",
  GET_ORDER_LIST_BY_Book: "getOrderListByBook",
  GET_ORDER_LIST_BINDER: "getOrderListBinder",
  GET_BINDER_ORDER_DETAILS: "getBinderOrderDetail",
  GET_DRP_STORE: "getDrpStore",
  GET_DRP_STORE_BY_FACILITY: "getDrpStoreByfacility",
  GET_DRP_FACILITY_TYPE: "getDrpfacilityType",
  ADD_STORE: "addStore",
  UPDATE_STORE: "updateStore",
  DELETE_STORE: "deleteStore",
  GET_STORE: "getAllStore",
  GET_STORE_BY_ID: "getStore",
  ADD_PRINTER: "addPrinter",
  UPDATE_PRINTER: "updatePrinter",
  DELETE_PRINTER: "deletePrinter",
  GET_PRINTER: "getAllPrinter",
  ADD_FACILITY: "addFacility",
  UPDATE_FACILITY: "updateFacility",
  DELETE_FACILITY: "deleteFacility",
  GET_FACILITY: "getAllFacility",
  ADD_ROLE: "addRole",
  UPDATE_ROLE: "updateRole",
  DELETE_ROLE: "deleteRole",
  GET_ROLE: "getAllRole",
  ADD_WARD: "addUnit",
  UPDATE_WARD: "updateUnit",
  DELETE_WARD: "deleteUnit",
  GET_WARD: "getAllUnit",
  ADD_NHUSER: "addNhUser",
  UPDATE_NHUSER: "updateNhUser",
  DELETE_NHUSER: "deleteNhUser",
  GET_NHUSER: "getAllNhUser",
  ADD_PHUSER: "addPhUser",
  UPDATE_PHUSER: "updatePhUser",
  DELETE_PHUSER: "deletePhUser",
  GET_PHUSER: "getAllPhUser",
  ADD_COMPANY_TYPE: "addCompanyType",
  UPDATE_COMPANY_TYPE: "updateCompanyType",
  DELETE_COMPANY_TYPE: "deleteCompanyType",
  GET_COMPANY_TYPE: "getAllCompanyType",
  ADD_PAPER_TYPE: "addPaperType",
  UPDATE_PAPER_TYPE: "updatePaperType",
  DELETE_PAPER_TYPE: "deletePaperType",
  GET_PAPER_TYPE: "getAllPaperType",
  CMB_PG_USER: "getDrpPgUser",
  CHANGE_PASSWORD: "changePassword",
  USER_ACTIVE_DEACTIVE: "userActiveDeactive",
  FACILITY_ACTIVE_DEACTIVE: "facilityActiveDeactive",
  ADD_PH_USER_FACILITY_MAPPING: "addPhUserFacilityMapping",
  ADD_NH_USER_UNIT_MAPPING: "addNhUserUnitMapping",
  GET_ALL_PAGE_INFO: "getAllPageInfo",
  GET_ALL_UNPRINT_PAGE_INFO: "getAllUnprintPageInfo",
  GET_ALL_NH_PAPER_DATA: "getAllNhPaperData",
  GET_ALL_NH_PAPER_DATA_VIEWER: "getAllNhPaperDataViewer",
  GET_PATIENT_LIST: "getPatientList",
  GET_PATIENT: "getPatient",
  GET_PATIENT_LIST_BINDER: "getPatientListBinder",
  ADD_PATIENT: "addPatient",
  UPDATE_PATIENT: "updatePatient",
  ADD_PATIENT_ALLERGY: "addPatientAllergy",
  ADD_PATIENT_CONDITION: "addPatientCondition",
  ADD_POA_CONTACT_INFO: "addPOAContactInfo",
  GET_PATIENT_ALLERGY: "getPatientAllergy",
  GET_PATIENT_CONDITION: "getPatientCondition",
  GET_POA_CONTACT_INFO: "getPOAContactInfo",
  DELETE_PATIENT_ALLERGY: "deletePatientAllergy",
  DELETE_PATIENT_CONDITION: "deletePatientCondition",
  ADD_THEME_SETTING: "addThemeSetting",
  DELETE_POA_CONTACT: "deletePOAContact",
  GET_PEN_DASHBORD_DATA: "getPenDashbordData",
  ADD_PRINT_QUEUE: "addPaperPrintQueue",
  DELETE_PAGE_INFO: "deleteByIdPageInfo",
  UPDATE_COMPANY_PLAN: "updatePlan",
  GET_DASHBORD_INFO_DATA: "getDashboardInfoData",
  GET_DASHBORD_PRINT_INFO_DATA: "getDashboardPrintInfoData",
  GET_PRINT_SERVICE: "getPrintService",
  GET_ALL_PRINT_INFO: "getAllPrintInfo",
  GET_UNIT_BY_FACILITY_AND_USER: "getUnitByFacilityAndUser",
  GET_FACILITY_BY_ID: "getFacility",
  GET_LOGIN_USER_DATA: "getLoginUserData",
  UPDATE_PROFILE: "updateProfile",
  LOGOUT_USER: "logoutUser",
  GET_ALL_LOGCAT: "getAllLogcat",
  UPDATE_PROFILE_LOGO: "updateCompanyProfileLogo",
  FORGOT_PASSWORD: "forgotPassword",
  GET_ALL_LCD: "getAllLcd",
  GET_LCD: "getLcd",
  ADD_LCD: "addLcd",
  DELETE_LCD: "deleteLcd",
  UPDATE_LCD: "updateLcd",
  GET_DASHBORD_PEN_INFO_DATA: "getDashboardPenInfoData",
  UPDATE_USER_CONFIG: "updateUserConfig",
  SEND_PRINT_MAIL: "mailViewerPrint",
  GET_APPLICATION_DATA: "getApplicationData",
  ADD_PRINTER_TRAY: "addPrinterTray",
  UPDATE_PRINTER_TARY: "updatePrinterTray",
  DELETE_PRINTER_TRAY: "deletePrinterTray",
  GET_ALL_PRINTER_TRAY: "getAllPrinterTray",
  GET_PRINTER_TRAY: "getPrinterTray",
  GET_DRP_FACILITY_WITH_PRINTER: "getDrpFacilityWithPrinter",
  GET_APP_SYS_LOG: "getApplicationSystemLog",
  ADD_DEFAULT_UNIT_PAGE: "addUnitDefaultPage",
  ADD_STORE_SETTING: "addStoreSetting",
  GENERATE_PACKING_SLIP: "generatePackingSlip",
  GENERATE_PAPER_DATA_RECIEVE_WEEKLY_OR_DAILY:
    "generatePaperDataRecieveWeeklyOrDaily",
  ADD_FAX_CONFIG: "addFaxConfig",
  UPDATE_APP_SYS_LOG_COMMENT: "updateApplicationSystemLogComment",
  GET_PAPER_AREA: "getPaperArea",
  ADD_UPDATE_PAPER_AREA: "addUpdatePaperArea",
  GET_ALL_LEVEL: "getAllLevel",
  GET_USER_GUIDE: "getUserGuide",
  ADD_USER_GUIDE: "addUserGuide",
  GET_ALL_PAPER_TYPE_PATTERN: "getAllPaperTypePattern",
  GET_PAPER_TYPE_PATTERN: "getPaperTypePattern",
  ADD_PAPER_TYPE_PATTERN: "addPaperTypePattern",
  UPDATE_PAPER_TYPE_PATTERN: "updatePaperTypePattern",
  GET_DRP_PAPER_TYPE_PATTERN: "getDrpPaperPatternData",
  ADD_PAPER_TYPE_AREA: "addPaperTypeArea",
  UPDATE_PAPER_TYPE_AREA: "updatePaperTypeArea",
  GET_PAPER_TYPE_AREA: "getPaperTypeArea",
  GET_ALL_MACHINE: "getAllMachineData",
  ACTIVE_MACHINE: "updateDeviceActivationStatus",
  //    CONFIG_MACHINE: 'configDevice',
  //    CONFIG_MACHINE: 'updateAppConfig',
  CONFIG_MACHINE: "machineConfig",
  GET_DRP_MACHINE: "getDrpMachineData",
  GET_APPLICATION_DETAIL_DATA: "getApplicationDetailData",
  RESET_FAX_RETRY: "resetFaxRetry",
  GET_ALL_PAPER_LICENCE: "getAllPaperLicence",
  GET_PAPER_LICENCE: "getPaperLicence",
  ADD_LICENCE_FILE: "addPaperLicence",
  UPDATE_LICENCE_FILE: "updatePaperLicence",
  DELETE_LICENCE_FILE: "deletePaperLicence",
  ORDER_PAPER_PATTERN: "portalOrderPaperPattern",
  GET_ALL_ORDER: "getAllOrder",
  ADD_COMPLETE_OREDRE: "addCompleteOrder",
  ADD_PAPER_TYPE_FROM_VERSION: "addPaperTypeFromVersion",
  COUNT_PATIENT_UNIT: "countPatientToUnit",
  //    KROLL ACTION
  ADD_RESIDENT_QUEUE_KROLL: "addResidentQueueForKroll",
  GET_FACILITY_KROLL: "getFacilityKroll",
  GET_KROLL_FACILITY_BY_STORE: "getKrollFacilityByStore",
  GET_KROLL_UNIT_BY_STORE: "getKrollUnitByStore",
  GET_FACILITY_PAPERTYPEVERSION: "getFacilityPaperTypeVersion",
  ADD_FACILITY_PAPER_TYPE_VERSION: "addFacilityPaperTypeVersion",
  GET_PAPER_TYPE_VERSION_DATA: "getPaperTypeVersionByPaperType",
  GET_ALL_PAPER_TEMPLATE: "getAllPaperTemplate",
  GET_FACILITY_ASSIGN_PAPER_TYPE: "getFacilityAssignPaperType",
  GET_ALL_SETTING: "getAllSetting",
  GET_SETTING: "getByType",
  ADD_SETTING: "addSetting",
  GET_ALL_PAPER_FIELDS_BY_VERSION: "getAllPaperFieldsByVersion",
  UPDATE_PAPER_FIELDS: "updatePaperFields",
  GET_PAPER_PACKING_SLIP: "getPaperPackingSlipPortal",
  GET_ORDER_QUEUE_LOG_FILE: "getOrderQueueLogFile",
  SAVE_DEFAULT_PAGE: "saveDefaultPage",
  GET_FACILITY_BY_CODE: "getFacilityByCode",
  GET_SELECTED_ROLE_DATA: "getSelectedRoleData",
  GET_ALL_RESIDENT_QUEUE: "getAllResidentQueue",
  ORDER_STOP_RESUME: "orderStopResume",
  ORDER_STOP_COMMENT: "orderStopWithComment",
  GENERATE_PAPER_OREDR_REPORT: "generatePaperOrderByIDRpt",
  GET_DASHBOARD_CHART_DATA: "getDashboardChartData",
  ADD_DISCARDED_REOREDRE: "addDiscardedReOrder",
  GET_UNIT_INFO_BY_UNIT: "getUnitInfoByUnit",
  GET_CONTACT: "getContact",
  VIEW_FACILITY_DETAIL: "viewFacilityDetail",
  GENERATE_KROLL_PATIENT_STATUS_DETAIL: "generateKrollPatientStatusDetail",
  GET_COMMENT_FILTER_MST: "getCommentFilterMst",
  INSERT_COMMENT_FILTER_MST: "insertCommentFilterMst",
  UPDATE_COMMENT_FILTER_MST: "updateCommentFilterMst",
  DELETE_COMMENT_FILTER_MST: "deleteCommentFilterMst",
  INSERT_QAS_CONFIG_MST: "insertQasConfigMst",
  UPDATE_QAS_CONFIG_MST: "updateQasConfigMst",
  DELETE_QAS_CONFIG_MST: "deleteQasConfigMst",
  GET_QAS_CONFIG_MST: "getQasConfigMst",
  GET_DRP_TIME_ZONE: "getDrpTimeZone",
  GET_PRINTER_MODEL: "getPrinterModel",
  GET_ARCHIVE_PAGE_DATA: "getArchivePageData",
  GET_ARCHIVE_VIEWER_DATA: "getArchiveViewerData",
  ADD_MASTER_QUEUE_FOR_KROLL: "addMasterQueueForKroll",
  ADD_RESIDENT_RX_QUEUE_FOR_KROLL: "addResidentRxQueueForKroll",

  // smart priscriber
  GET_PRESCRIPTION_ORDERS: "getPrescriptionOrders",
  GET_PRESCRIPTION_ORDERS_VIEWER: "getPrescriptionOrdersViewer",
  GET_PATIENT_DETAILS: "getPatientDetail",
  GET_PAPERTYPE_AND_AREA: "getPaperTypeAndArea",
  CREATE_ORDER: "createOrder",
  CREATE_NEW_ADMISSION_ORDER: "createNewAdmissionOrder",
  VIEW_ORDER: "viewOrder",
  GET_PATIENT_RX: "getPatientRx",
  GET_PATIENT_NEXTPREV_PAGE_INFO: "getPatientNextPrevPageInfo",
  GET_SCHEDULE_TIME: "getScheduleTime",
  GET_ALL_APPOINTMENT: "getAllAppointment",
  GET_DRUG: "getDrug",
  GET_SIG: "getSig",
  GET_DRP_PHYSICIAN: "getDrpPhysician",
  GET_PHYSICIAN_FOR_MAKE_DOCTOR: "getPhysicianForMakeDoctor",
  ADD_APPOINTMENT: "addAppointment",
  START_APPOINTMENT: "startAppointment",
  CANCEL_VIRTUAL_VISIT: "changeVirtualVisitStatus",
  GET_PAPER_TYPE_FIELDS: "getPaperTypeFields",
  GET_NEW_ADMISSIONFORM: "getNewAdmissionForm",
  GET_NEW_ADMISSION_LIST: "getNewAdmissionList",
  GET_AVAILABLE_TIMESLOTS: "getAvailableTimeSlots",
  SAVE_ASDRAFT_NEWADMISSION: "saveAsDraftNewAdmission",
  GET_NEW_ADMISSION_DRAFT_LIST: "getNewAdmissionDraftList",
  REMOVE_FROM_DRAFT: "removeFromDraft",
  ADD_BULK_KEYBOARD_ORDER: "addBulkKeyboardOrder",
  FORGOT_PASSWORD_BY_OTP: "forgotPasswordByOTP",
  CHECK_OTP: "checkOTP",
  RESET_USER_PASSWORD: "resetUserPassword",
  GET_FACILITY_WITH_UNIT: "getFacilityWithUnit",
  GET_RESIDENT_PMR_FIELDS: "getResidentPMRFields",
  GET_INSTRUCTION_BY_PAPER_TYPE: "getInstructionByPaperType",
  GET_INSTRUCTION_BY_PAPER_TYPE_VERSION: "getInstructionByPaperTypeVersion",
  UPDATE_INSTRUCTION: "updateInstruction",
  GET_TODO_LIST:"getTodoList",
  GET_TODO_ORDER_DETAIL:"getTodoOrderDetail",
  VERIFY_TO_DO_ORDER:"verifiedTodoOrder"
});
/*
 * Application Messages
 */
app.constant("APP_MESSAGE", {
  DELETE_MESSAGE: "Are you sure you want to delete?",
  COMPLETE_OREDER_MESSAGE: "Are you sure you want to complete order?",
  DISCARD_REOREDER_MESSAGE:
    "Are you sure you want to order which was discarded?",
  PRINT_QUEUE_MESSAGE: "Are you sure you want to reprint?",
  SERVER_RESPONSE_FAIL_MESSAGE: "Server response fail",
  MESSAGE: "Message",
  ERROR_MESSAGE: "Error",
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * Production URL
 */
app.constant("FILEURL", "https://qampgl.smartrxhub.com/qa/");
app.constant(
  "URL",
  "https://qampgl.smartrxhub.com/qa/prescriber_panel_api/api/index.php?"
);
app.constant("FILESPURL", "https://smartpaper.smartrxhub.com/api/");
app.constant("SPURL", "https://smartpaper.smartrxhub.com/api/index.php?");

//app.constant('FILEURL', 'http://localhost/eRx/');
//app.constant('URL', 'http://localhost/eRx/v1_3erx/portal/api/index.php?');
//app.constant('FILESPURL', 'http://localhost/eRx/v1_3erx/portal/api/');
//app.constant('SPURL', 'https://smartpaper.smartrxhub.com/api/index.php?');

app.constant("ToDoSteps", {
  step1: "Doctor Sign Missing",
  step2: "Nurse 1 Sign",
  step3: "Nurse 2 Sign",
  step4: "Care Plan",
  step5: "Consent",
  step6: "Mar/Tar",
  step7: "Lab Order",
});
app.constant("SIGNATURE_TYPE",{
  TYPE_MINUS_1:"-1",
  TYPE_0:"0",
  TYPE_1:"1",
  TYPE_2:"2",
  TYPE_3:"3",
  TYPE_4:"4"
})
app.constant("EPAPER_MENU_CODE",{
  DOCTOR_SIG_MISSING:"DOCTOR_SIG_MISSING",
  NURSE_1:"NURSE_1",
  NURSE_2:"NURSE_2",
  CARE_PLAN:"CARE_PLAN",
  CONSENT:"CONSENT",
  MAR_TAR:"MAR_TAR",
  LAB:"LAB"
})
app.constant("EPAPER_MENU_KEY",{
  SIGNATURE:"signature",
  NURSE_1:"nurse_1",
  NURSE_2:"nurse_2",
  CARE_PLAN:"care_plan",
  CONSENT:"consent",
  MAR_TAR:"mar_tar",
  LAB:"lab"
})
