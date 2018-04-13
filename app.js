const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (request, response) => {
    response.send('Hello World!');
});

app.get('/api/courses', (request, response) => {
    response.send(courses);
});

app.get('/api/courses/:id', (request, response) => {
    const course = courses.find((course) => {
        return course.id === parseInt(request.params.id);
    });

    if (!course) {
        return response.status(404).send('Course not found.')
    }

    response.send(course);
});

app.get('/api/posts/:year/:month', (request, response) => {
    response.send([request.params, request.query]);
});

app.post('/api/courses', (request, response) => {
    const {error} = validateCourse(request.body);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: request.body.name,
    };

    courses.push(course);
    response.send(course);
});

app.put('/api/courses/:id', (request, response) => {
    const course = courses.find((course) => {
        return course.id === parseInt(request.params.id);
    });

    if (!course) {
        return response.status(404).send('Course not found.');
    }

    const {error} = validateCourse(request.body);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    course.name = request.body.name;

    response.send(course);
});

app.delete('/api/courses/:id', (request, response) => {
    const course = courses.find((course) => {
        return course.id === parseInt(request.params.id);
    });

    if (!course) {
        return response.status(404).send('Course not found.');
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    response.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };

    return Joi.validate(course, schema);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
