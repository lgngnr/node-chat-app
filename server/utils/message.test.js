const expect = require('expect');
const { generateMessage } = require('./message');

describe('generate message', () => {
    it('should generate the correct message object', () => {
        var req = { from: 'admin', text: 'hello' };
        var res = generateMessage('admin', 'hello');
        expect(res).toMatchObject(req);
        expect(typeof res.createAt).toBe('number');
    })
});