const expect = require('expect');
const { isRealString } = require('./validation');

describe('test isRealString', () => {
    it('should reject non string value', () => {
        expect(isRealString(123)).toBeFalsy(); 
    });
    it('should reject string with only space', () => {
        expect(isRealString(' ')).toBeFalsy();
    });
    it('should allow string with non-space character', () => {
        expect(isRealString('dfsfdsd')).toBeTruthy();
    });
});