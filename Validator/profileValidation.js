const Joi = require("joi");
const formidable = require("formidable");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        const result = Joi.validate(fields, schema);

        if (err) {
          console.log("err", err);
          return res.status(400).json({
            error: "Image could not be uploaded"
          });
        }

        if (result.error) {
          return res.status(400).json(result.error);
        }
        if (!fields) {
          return res.status(400).json({
            error: "please fill all required fields"
          });
        }
        req.files = files.photo;
        req.fields = fields;

        next();
      });
    };
  },

  schemas: {
    profileSchema: Joi.object().keys({
      bio: Joi.string().required(),
      country: Joi.string(),
      city: Joi.string(),
      birthdate: Joi.date(),
      gender: Joi.string()
    })
  }
};
