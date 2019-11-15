
const db = require('./db');

const query = async (req, res) => {
    if (!req.query || !req.query.query) {
        res.sendStatus(500);
        return;
    }

    const query = req.query.query;
    const variables = JSON.parse(decodeURIComponent(req.query.variables));

    try {
        const result = await db.query(query, variables);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).send(JSON.stringify(err));
    }
}

const mutate = async (req, res) => {

    if (!req.body || !req.body.query) {
        res.sendStatus(500);
        return;
    }

    const query = req.body.query;
    const variables = req.body.variables;

    try {
        const result = await db.mutate(query, variables);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500).send(JSON.stringify(err));
    }
}

const graphql = async (req, res, next) => {

    switch (req.method) {
        case 'POST':
        case 'PUT':
            await mutate(req, res);
            break;

        case 'GET':
        default:
            await query(req, res);

    }

    next();
}

module.exports = graphql;