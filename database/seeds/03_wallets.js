exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('wallets').del()
    .then(function () {
      // Inserts seed entries
      return knex('wallets').insert([{
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 07:57:12',
          c1_amount: 8
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 08:57:12',
          c1_amount: 10
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 09:57:12',
          c1_amount: 13
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 10:57:12',
          c1_amount: 10
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 11:57:12',
          c1_amount: 11
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 12:57:12',
          c1_amount: 12
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 13:57:12',
          c1_amount: 10
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 14:57:12',
          c1_amount: 9
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 15:57:12',
          c1_amount: 10
        },
        {
          user_id: 'harry.tooter@hogwarts.com',
          timestamp: '2018-10-25 16:57:12',
          c1_amount: 10
        },
      ]);
    });
};


//hogwarts isnt an edu, sorry.