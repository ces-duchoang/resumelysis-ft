import { notification } from "antd";

export default err => {
  if (err.name === "Error")
    notification.error({
      message: "Error " + err.response.status,
      description: err.response.data.message
    });
  else console.log(err);
};
