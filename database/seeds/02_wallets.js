
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('wallets').del()
    .then(function () {
      // Inserts seed entries
      return knex('wallets').insert([
        {user_id: 1, btc_wallet: 10} //defaults 0 should take care of this
      ]);
    });
};
