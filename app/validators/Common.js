import { startCase } from "lodash";

export const getError = (error, field) => {
  if (!error) return;
  return {
    validateStatus: "error",
    help: `${field}${error.details[0].message.slice(
      error.details[0].message.lastIndexOf('"') + 1
    )}`
  };
};

export const getMapError = error => {
  if (!error) return;
  return {
    validateStatus: "error",
    help: `${startCase(error.details[0].path[0])} is invalid format`
  };
};


export const getSummaryError = (error, field) => {
  if(!error) return;
  return {
    validateStatus: "error",
    help: `${field} is invalid format`
  }
}