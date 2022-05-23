module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('systemconfigurations').insertMany([
      {
        'config_name': 'BASE_COMMISSION',
        'config_value': '30',
        'description': 'Base Commission Value Set for referral',
        'module': 'referral'
      },
      {
        'config_name': 'BASE_COMMISSION_STEP',
        'config_value': '5',
        'description': 'Base Commission Step Value for referral',
        'module': 'referral'
      }
    ]);

    await db.collection('systemmessages').insertMany([
      {
        language: 'us_en',
        msg_code: 'SHARE_FACEBOOK_TEXT',
        message: 'GamePay is a online gaming platform',
        module: 'referral'
      },
      {
        language: 'us_en',
        msg_code: 'SHARE_TWITTER_TEXT',
        message: 'GamePay is an amazing online gaming platform',
        module: 'referral'
      }
    ]);

  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
