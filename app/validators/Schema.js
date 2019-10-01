import Joi from "@hapi/joi";

export const StringName = Joi.string()
  .min(3)
  .max(32);

export const StringDescription = Joi.string()
  .min(3)
  .max(256);

export const StringFbProfile = Joi.string().regex(
  /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/i
);

export const StringTwitter = Joi.string().regex(
  /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/
);

export const StringLink = Joi.string().regex(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

export const StringEmail = Joi.string().email({ minDomainSegments: 2 });

export const SocialMap = Joi.object().keys({
  facebook: StringFbProfile,
  twitter: StringTwitter,
  link: StringLink
});
