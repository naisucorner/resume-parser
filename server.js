const express = require("express");
const next = require("next");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(fileUpload());

  server.post("/api/parser", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
      res.status(400);
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
