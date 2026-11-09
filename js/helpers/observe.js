
// Constructs an "observed" object using Proxy and Reflect.  This will give the object an on()
// method for registering handlers that fire when properties of the object change.

const getType = (value) => value === undefined ? 'undefined' : (value === null ? 'null' : value.constructor.name);
const is = (typeName, value) => getType(value) === typeName;

class EventManager {
  handlers = {};

  on(...args) {
    const [ path, handler ] = args.length === 1 ? ['*', args[0]] : args;
    const paths = path.split(',').map((p) => p.trim());

    const { handlers } = this;
    
    for (const p of paths) {
      if (!handlers[p]) {
        handlers[p] = [];
      }

      handlers[p].push(handler);
    }
  }

  trigger(path, event) {
    const { handlers } = this;

    const normal = path.join('.');
    const priority = `${normal}!`;
    const wildcard = path.toSpliced(-1, 1, '*').join('.');

    for (const p of [priority, normal, wildcard]) {
      if (p in handlers) {
        const pathedEvent = { ...event, path: p }

        for (const handler of handlers[p]) {
          handler(pathedEvent);
        }
      }
    }
  }
};

const observe = (object, path = [], eventManager = new EventManager()) => {
  if (!is('Object', object)) {
    throw new Error('The observed must be an Object');
  }

  return new Proxy(object, {
    get(...args) {
      const [ , property ] = args;

      if (property === 'on') {
        return eventManager.on.bind(eventManager);
      }

      const value = Reflect.get(...args);
     
      if (is('Object', value)) {
        return observe(value, path.concat(property), eventManager);
      }

      return value;
    },


    set(...args) {
      const [ target, property, newValue ] = args;
      const previousValue = Reflect.get(target, property);
      const succeeded = Reflect.set(...args);

      if (succeeded && newValue !== previousValue) {
        eventManager.trigger(path.concat(property), { target, property, newValue, previousValue });
      }

      return succeeded;
    },

    deleteProperty(...args) {
      const [ target, property ] = args;
      const previousValue = Reflect.get(target, property);
      const succeeded = Reflect.deleteProperty(...args);

      if (succeeded && previousValue !== undefined) {
        eventManager.trigger(path.concat(property), { target, property, newValue: undefined, previousValue });
      }

      return succeeded;
    }
  });
};

export default observe;
