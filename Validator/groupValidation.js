const Joi = require("joi");
const formidable = require("formidable");

const validCategoryNames = [
  "sport",
  "jobopportunity",
  "diaspora",
  "startup",
  "shaibuna"
];
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
          req.value = {};
        }
        console.log("req.file", req.file);
        req.fields = fields;

        next();
      });
    };
  },
  validateParams: () => {
    return (req, res, next) => {
      const categoryName = req.params.name;
      const validate = validCategoryNames.includes(categoryName);

      if (!validate) {
        return res.status(400).json({ error: "Invalid category name" });
      }

      next();
    };
  },
  schemas: {
    groupSchema: Joi.object().keys({
      title: Joi.string().required(),
      bio: Joi.string()
    })
  }
};
