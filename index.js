const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const sequelize = new Sequelize("learndb", "root", "Uwak123%%", {
//   dialect: "mysql",
// });

//initialize the db link
const sequelize = new Sequelize(process.env.DB_URL)

//define the schema
const blog_table = sequelize.define(
  "blog_table",
  {
    title: Sequelize.STRING,
    desc: Sequelize.TEXT,
  },
  { tableName: "blog_table" }
);

//sync the schema
blog_table.sync();

// authenticate/connect with the db
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection made successfully");
  })
  .catch(() => {
    console.log("Connection failed");
  });

// make calls

app.get("/", async (req, res) => {
  const allData = await blog_table.findAll();
  res.json(allData);
});
app.get("/:id", async (req, res) => {
  const data = await blog_table.findOne({where:{id: req.params.id}});
  res.json(data);
});

app.post("/", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const saveBlog = blog_table.build({
    title,
    desc,
  });
  await saveBlog.save();
  // const allData = await blog_table.findAll();
  // res.json(allData)
  res.send("Data sent");
});

app.put("/:id", async(req, res) => {
  const data = req.body.data;
  await blog_table.update(
    {
      desc: data,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.redirect("/");
});

app.delete("/:id", async(req, res) => {
  await blog_table.destroy(
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.redirect("/");
});

app.listen(7000, () => {
  console.log("Server is running!");
});
