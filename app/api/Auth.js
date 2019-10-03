import APICaller from "./APICaller";

const prefix = "auth";

export default {
  auth(email, password, remember) {
    return APICaller(prefix, "POST", { email, password, remember });
  },
  get() {
    return APICaller(prefix, "GET");
  }
};
