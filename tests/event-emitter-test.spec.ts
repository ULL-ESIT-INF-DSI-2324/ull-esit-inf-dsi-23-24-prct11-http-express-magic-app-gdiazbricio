import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitter} from '../src/MessageEventEmitter.js';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitter(socket);

    server.on('message', (message) => {
      expect(message).to.be.eql({'type': 'change', 'prev': 13, 'curr': 26});
      done();
    });

    socket.emit('data', '{"type": "change", "prev": 13');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
  });

  it('Should not emit a message event if the message is incomplete', (done) => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitter(socket);

    server.on('message', () => {
      done(new Error('Message event should not have been emitted'));
    });

    socket.emit('data', '{"type": "change", "prev": 13');
    
    setTimeout(() => {
      done();
    }, 50);
  });
});