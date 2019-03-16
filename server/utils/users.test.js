const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'make',
            room: 'node'
        }, {
            id: 2,
            name: 'jean',
            room: 'react'
        }, {
            id: 3,
            name: 'july',
            room: 'node'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = { id: '123', name: 'luigi', room: 'first' };
        var response = users.addUser(user.id, user.name, user.room);
        expect(response).toMatchObject(user);
    });

    it('should return name for node', () => {
        var userList = users.getUserList('node');
        expect(userList).toEqual(['make', 'july']);
    });

    it('should return name for react', () => {
        var userList = users.getUserList('react');
        expect(userList).toEqual(['jean']);
    });

    it('should remove a user', () => {
        var userID = 1;
        var user = users.removeUser(userID);
        expect(users.users.length).toBe(2);
        expect(user.id).toBe(userID);
    });

    it('should not remove a user', () => {
        var user = users.removeUser(4);
        expect(users.users.length).toBe(3);
        expect(user).toBeUndefined();
    }); 
    
    it('should find user', ()=>{
        var user = users.getUser(1);
        expect(user.id).toBe(1);
    });
    
    it('should find user', () => {
        var user = users.getUser(4);
        expect(user).toBeUndefined();
    });
});