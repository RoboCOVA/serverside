const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    console.log("register tion try");
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        console.log("result.error", result.error);
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
