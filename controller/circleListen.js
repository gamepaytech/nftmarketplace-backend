const r = require('request')
const MessageValidator = require('sns-validator')

const circleArn =
  /^arn:aws:sns:.*:908968368384:(sandbox|prod)_platform-notifications-topic$/

const validator = new MessageValidator()