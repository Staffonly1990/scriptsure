/**
 * Env Variable Initialization Module
 * @remark If the value of at least one variable is not found,
 * the application will immediately throw an error during module initialization
 * @module
 */

/**
 * Getting the env variable
 * @throwable
 */
export const getEnvVar = (key: string): string => {
  if (process.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`);
  }
  return process.env[key] || '';
};

/** Program start mode */
export const NODE_ENV = getEnvVar('NODE_ENV');
/** Development mode */
export const isDevEnv = NODE_ENV === 'development';
/** Production mode */
export const isProdEnv = NODE_ENV === 'production';

/** API KEY */
export const API_KEY = getEnvVar('REACT_APP_API_KEY');

/** API URL */
export const API_URL_SCRIPTSURE = getEnvVar('REACT_APP_API_URL_SCRIPTSURE');
export const API_URL_PLATFORM = getEnvVar('REACT_APP_API_URL_PLATFORM');

/** Breakpoints */
export const OBreakpoints = {
  '2xl': '(min-width: 1536px)',
  'xl': '(min-width: 1280px)',
  'lg': '(min-width: 1024px)',
  'md': '(min-width: 768px)',
  'sm': '(min-width: 640px)',
  'xs': '(min-width: 425px)',
} as const;

/**
 * Contains the paths of the application routes
 *
 * @example
 * user: {
 *  path: (username = ':username') => `/${username}`
 *  routes: {
 *    settings: {
 *      path: () => '/settings'
 *    }
 *  }
 * }
 */
export const routes = {
  root: { path: () => '/' },
  login: { path: () => '/login' },
  report: { path: () => '/report' },
  // setting: { path: () => '/settings' },
  message: { path: () => '/message' },
  profile: { path: () => '/profile' },
  notFound: { path: () => '/404' },
  chart: {
    path: (patientId: string | number = ':patientId') => `/chart/${patientId}`,
    routes: {
      prescriptions: { path: () => '/prescriptions' },
      demographics: { path: () => '/demographics' },
      allergies: { path: () => '/allergies' },
      pharmacy: { path: () => '/pharmacy' },
      diagnosis: { path: () => '/diagnosis' },
      vitals: { path: () => '/vitals' },
      notes: { path: () => '/notes' },
      education: { path: () => '/education' },
    },
  },
  setting: {
    path: () => '/settings',
    routes: {
      locations: { path: () => '/practice/locations' },
      notifications: { path: () => '/practice/notifications' },
      prescriptions: { path: () => '/practice/prescriptions' },
      approval: { path: () => '/practice/epics-approval' },
      advancedSetting: { path: () => '/practice/advanced-practice-setting' },
      opioid: { path: () => '/practice/opioid-limits' },
      pmpControlled: { path: () => '/practice/pmp-controlled' },
      userPendingAlerts: { path: () => '/user/pending-prescription-alerts' },
      practicePendingAlerts: { path: () => '/practice/pending-prescription-alerts' },
      restoreDefaults: { path: () => '/practice/restore-practice-defaults' },
      userProfile: { path: () => '/user/profile' },
      electronicOption: { path: () => '/user/electronic-option' },
      epicsLogin: { path: () => '/user/epics-login' },
      prescriptionWorkFlow: { path: () => '/user/prescription-work-flow' },
      checks: { path: () => '/user/checks-alerts' },
      print: { path: () => '/user/print' },
      adherence: { path: () => '/user/adherence' },
      termOsUse: { path: () => '/user/terms-of-use' },
      miscellaneousUser: { path: () => '/user/miscellaneous' },
      prescriptionAlerts: { path: () => '/user/prescription-alerts' },
      restoreUserDefaults: { path: () => '/user/restore-user-defaults' },
      userList: { path: () => '/manage/manage-user-list' },
      addUser: { path: () => '/manage/add-user' },
      security: { path: () => '/security' },
      billing: { path: () => '/billing' },
      miscellaneous: { path: () => '/miscellaneous' },
    },
  },
};
