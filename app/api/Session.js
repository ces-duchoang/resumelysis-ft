const USER_TOKEN = '_uid';
const USER_INFO = '_info';
const _SETTING = '_setting';
import AuthApi from './Auth';

export const isValidSession = async () => {
    try {
        if (!getToken()) return false;
        const userSession = await AuthApi.get();
        if (userSession.status === 200) {
            updateUserInfo(userSession.data.user);
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

export const getToken = () => localStorage.getItem(USER_TOKEN);

export const save = session => {
    localStorage.setItem(USER_TOKEN, session.session);
    localStorage.setItem(USER_INFO, JSON.stringify(session.user));
    return true;
};

export const getSetting = () => {
    const setting = localStorage.getItem(_SETTING);
    const rs = setting ? JSON.parse(setting) : {};
    return rs;
};

export const getSettingValue = key => {
    const setting = getSetting();
    return setting[key]===true;
};

export const saveSetting = (key, value) => {
    const setting = getSetting();
    setting[key] = value;
    localStorage.setItem(_SETTING, JSON.stringify(setting));
};

export const updateUserInfo = userInfo =>
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo));

export const clearSession = () => localStorage.clear();

export const getUserInfo = () => JSON.parse(localStorage.getItem(USER_INFO));
