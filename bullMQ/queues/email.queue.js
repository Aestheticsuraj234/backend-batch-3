const {Queue} = require('bullmq');
const connection = require("../config/redis");

 const EMAIL_QUEUE = 'emailQueue';

const emailQueue = new Queue(EMAIL_QUEUE, {
    connection
})

module.exports = {
    emailQueue,
    EMAIL_QUEUE
};