
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'james', password: 'james'},
        // {id: 2, username: 'chris', password: 'chris'},
        // {id: 3, username: 'micah', password: 'micah'},
      ]);
    });
};
