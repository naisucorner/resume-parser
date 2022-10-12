const express = require("express");
const next = require("next");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const validator = require("validator");
const textract = require("textract");
const mammoth = require("mammoth");

const port = parseInt(process.env.PORT, 10) || 4000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(fileUpload());

  server.post("/api/parser", (req, res) => {
    console.log({ files: req.files.resume });

    if (!req.files && !req.files.resume) {
      res.status(400);
    }

    if (
      req.files.resume.mimetype !== "application/pdf" &&
      req.files.resume.mimetype !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return res.status(400).json({
        error: "This file type is not supported",
      });
    }

    if (
      req.files.resume.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const resume = req.files.resume;
      console.log("docx", req.files.resume);

      // textract.fromBufferWithMime(
      //   resume.mimetype,
      //   resume.data,
      //   function (error, text) {
      //     console.log({ error, text });
      //   }
      // );

      mammoth
        .convertToHtml({ buffer: resume.data })
        .then(function (result) {
          var html = result.value; // The generated HTML
          var messages = result.messages; // Any messages, such as warnings during conversion

          console.log({ html, messages });
        })
        .done();

      return res.json({});
    }

    pdfParse(req.files.resume).then((result) => {
      const text = result.text;

      const splitAll = text.split("\n");

      const startSkill = splitAll.findIndex((text) => text === "SKILLS") + 1;
      const endSkill = splitAll.findIndex((text) => text === "WORK EXPERIENCE");

      const startEducation =
        splitAll.findIndex((text) => text === "EDUCATION") + 1;
      const endEducation = splitAll.findIndex((text) => text === "SKILLS");

      const name = splitAll[3];
      const phone = splitAll[4];
      const email = splitAll[5];
      const address = splitAll[6];
      const skills = splitAll.slice(startSkill, endSkill);
      const educations = splitAll.slice(startEducation, endEducation);

      if (!validator.isEmail(email) && splitAll[startSkill - 1] !== "SKILLS") {
        return res.status(400).json({
          error: "We currently do not support this format",
        });
      }

      res.json({
        data: result.text,
        name,
        phone,
        email,
        address,
        skills,
        educations,
      });
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
