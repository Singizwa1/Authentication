import joi from "joi";

 export const subscribeSchema = joi.object({
  email: joi.string().email().required()
});