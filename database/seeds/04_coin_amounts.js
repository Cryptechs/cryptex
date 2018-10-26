
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('coin_amounts').del()
    .then(function () {
      // Inserts seed entries
      return knex('coin_amounts').insert([
        {wallet_id: 1, timestamp: '2018-10-25 16:57:12', btc_amount: 10},
        {wallet_id: 1, timestamp: '2018-10-25 15:57:12', btc_amount: 10},
        {wallet_id: 1, timestamp: '2018-10-25 14:57:12', btc_amount: 9},
        {wallet_id: 1, timestamp: '2018-10-25 13:57:12', btc_amount: 10},
        {wallet_id: 1, timestamp: '2018-10-25 12:57:12', btc_amount: 12},
        {wallet_id: 1, timestamp: '2018-10-25 11:57:12', btc_amount: 11},
        {wallet_id: 1, timestamp: '2018-10-25 10:57:12', btc_amount: 10},
        {wallet_id: 1, timestamp: '2018-10-25 09:57:12', btc_amount: 13},
        {wallet_id: 1, timestamp: '2018-10-25 08:57:12', btc_amount: 10},
        {wallet_id: 1, timestamp: '2018-10-25 07:57:12', btc_amount: 8},
    ]);
  });
};