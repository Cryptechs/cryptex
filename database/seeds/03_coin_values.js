
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('coin_values').del()
    .then(function () {
      // Inserts seed entries
      return knex('coin_values').insert([
        {timestamp: '2018-10-25 16:57:12', btc_value: 20},
        {timestamp: '2018-10-25 15:57:12', btc_value: 20},
        {timestamp: '2018-10-25 14:57:12', btc_value: 20},
        {timestamp: '2018-10-25 13:57:12', btc_value: 18},
        {timestamp: '2018-10-25 12:57:12', btc_value: 16},
        {timestamp: '2018-10-25 11:57:12', btc_value: 14},
        {timestamp: '2018-10-25 10:57:12', btc_value: 12},
        {timestamp: '2018-10-25 09:57:12', btc_value: 10},
        {timestamp: '2018-10-25 08:57:12', btc_value: 10},
        {timestamp: '2018-10-25 07:57:12', btc_value: 10}
      ]);
    });
};
