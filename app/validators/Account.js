import Joi from "@hapi/joi";
import { getError } from "./Common";

const EmailSchema = Joi.string().email();
const PasswordSchema = Joi.string()
  .min(6)
  .max(32);

export const validateEmail = email =>
  getError(EmailSchema.validate(email).error, "Email");
export const validatePassword = password =>
  getError(PasswordSchema.validate(password).error, "Password");
