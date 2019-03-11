const moment = require('moment');

/* var date = moment();
//date.add(1, 'years').subtract(9, 'months');
console.log(date.format('MMM Do, Y'));
console.log(date.format('LT')); */

var createdAt = moment().valueOf();

var date = moment(createdAt);
console.log(date.format('h:mm a'));

/* setInterval(() => {
    console.log(moment().format('LTS'));
}, 1000); */