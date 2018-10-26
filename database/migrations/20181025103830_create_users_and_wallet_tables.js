
exports.up = function(knex, Promise) {
    return knex.schema
    //users table
    .createTable('users', function(table){
        table.increments();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
    })

    //the wallet info and amount of coins currently in the wallet
    .createTable('wallets', function(table) { 
        table.increments();
        table.integer('user_id').references('id').inTable('users');
        table.float('btc_wallet', 12, 4).defaultTo(0);
        table.float('c2_amount', 12, 4).defaultTo(0);
        table.float('c3_amount', 12, 4).defaultTo(0);
        table.float('c4_amount', 12, 4).defaultTo(0);
        table.float('c5_amount', 12, 4).defaultTo(0);
    })

    //history of coin values same for all users and wallets (if we want to run call from server)
    .createTable('coin_values', function (table) {
        table.string('timestamp').primary();
        table.float('btc_value', 12, 4).defaultTo(0);
        table.float('coin2_value', 12, 4).defaultTo(0);
        table.float('coin3_value', 12, 4).defaultTo(0);
        table.float('coin4_value', 12, 4).defaultTo(0);
        table.float('coin5_value', 12, 4).defaultTo(0);
    })

    //history of coin amounts in the wallet over time
    .createTable('coin_amounts', function (table) {
        table.integer('wallet_id').references('id').inTable('wallets');
        table.string('timestamp').references('timestamp').inTable('coin_values');
        table.float('btc_amount', 12, 4).defaultTo(0);
        table.float('coin2_amount', 12, 4).defaultTo(0);
        table.float('coin3_amount', 12, 4).defaultTo(0);
        table.float('coin4_amount', 12, 4).defaultTo(0);
        table.float('coin5_amount', 12, 4).defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
    console.log('TEAR IT DOWN')
  return knex.schema.dropTableIfExists('coin_amounts').dropTableIfExists('coin_values').dropTableIfExists('wallets').dropTableIfExists('users');
};
