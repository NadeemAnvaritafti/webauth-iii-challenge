const db = require('../data/db-config');

module.exports = {
    add,
    find,
    findBy,
    findById
}

function find() {
    return db('users');
}

function findBy(username) {
    return db('users')
        .where(username)
        .first();
}

function add(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
            const [id] = ids;
            return db('users')
                .select('id', 'username', 'department')
                .where({ id })
                .first();
        })
}

function findById(id) {
   return db('users')
       .select('id', 'username', 'department')
       .where({ id })
       .first();
}