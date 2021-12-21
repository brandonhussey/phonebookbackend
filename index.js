const { request, response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const id = Math.floor(Math.random() * (1000000000 - 0 + 1) + 0);
  return id;
};
app.get("/", (request, response) => {
  response.send("<h1>Enter localhost:3001/api/persons in the address bar</h1>");
});
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${persons.length} people.</p>
  ${Date()}`);
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Please fill in all fields",
    });
  } else if (
    persons.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
