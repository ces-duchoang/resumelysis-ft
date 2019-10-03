const USER_TOKEN = "_uid";
const USER_INFO = "_info";
import AuthApi from "./Auth";

export const isValidSession = async () => {
  try {
    if (!getToken()) return false;
    const userSession = await AuthApi.get();
    if (userSession.status === 200) {
      updateUserInfo(userSession.data);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const getToken = () => localStorage.getItem(USER_TOKEN);

export const save = session => {
  localStorage.setItem(USER_TOKEN, session.token);
  localStorage.setItem(USER_INFO, JSON.stringify(session.user));
  return true;
};

export const updateUserInfo = userInfo =>
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo));

export const clearSession = () => localStorage.clear();

export const getUserInfo = () => JSON.parse(localStorage.getItem(USER_INFO));
