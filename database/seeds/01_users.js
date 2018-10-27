
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'james.dempsey420@gmail.com'}
        // {id: 2, username: 'micahjweiss@gmail.com'}
      ]);
    });
};
