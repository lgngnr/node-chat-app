const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generate message', () => {
    it('should generate the correct message object', () => {
        var req = { from: 'admin', text: 'hello' };
        var res = generateMessage('admin', 'hello');
        expect(res).toMatchObject(req);
        expect(typeof res.createAt).toBe('number');
    })
});

describe('generate location message', () => {
    it('should generate the correct location onject', () => {
        var expectedRes = { from: 'Admin', url: "https://www.google.com/maps?q=1,1"}
        var res = generateLocationMessage('Admin', 1, 1);
        expect(res).toMatchObject(expectedRes);
    });
});