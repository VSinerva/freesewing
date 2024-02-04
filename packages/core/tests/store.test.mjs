import { expect } from 'chai'
import { Design, Store } from '../src/index.mjs'

const store = new Store()

describe('Store', () => {
  it('Should set/get a top-level store value', () => {
    store.set('foo', 'bar')
    expect(store.get('foo')).to.equal('bar')
  })

  it('Should set/get a nested store value', () => {
    store.set('some.nested.key.foo', 'bar')
    expect(store.get('some.nested.key').foo).to.equal('bar')
  })

  it('Should set a store value only if unset', () => {
    store.setIfUnset('dew.few', 'baz')
    store.setIfUnset('dew.few', 'schmoo')
    expect(store.get('dew').few).to.equal('baz')
  })

  it('Should push to an array value in the store', () => {
    store.set('dew.few', ['baz', 'bar'])
    // store.push is variadic
    store.push('dew.few', 'boz', 'bor')
    expect(store.get('dew').few.length).to.equal(4)
  })

  it('Should emit a warning when retrieving a invalid key', () => {
    const store = new Store()
    store.get('nope')
    expect(store.get('logs.warn').length).to.equal(1)
    expect(store.get('logs.warn')[0]).to.equal('Store.get(key) on key `nope`, which is undefined')
  })

  it('Should add methods to the store from a plugin', () => {
    const plugin = {
      name: 'test',
      version: 1,
      store: [
        [
          'test.example.warn',
          function (store, msg) {
            store.set('test.message.warn', msg)
          },
        ],
        [
          'test.example.info',
          function (store, msg) {
            store.set('test.message.info', msg)
          },
        ],
      ],
    }
    const part = {
      name: 'example.part',
      plugins: [plugin],
      draft: ({ store, part }) => {
        store.test.example.warn('hello warn')
        store.test.example.info('hello info')

        return part
      },
    }
    const Test = new Design({ parts: [part] })
    const pattern = new Test()
    pattern.draft()
    expect(pattern.setStores[0].get('test.message.warn')).to.equal('hello warn')
    expect(pattern.setStores[0].get('test.message.info')).to.equal('hello info')
  })

  it('Should log a warning when trying to extend a protected method via the constructor', () => {
    const store = new Store([['get', () => false]])
    expect(store.logs.warn.length).to.equal(1)
    expect(store.logs.warn[0]).to.equal('You cannot overwrite `store.get()`')
  })

  it('Should log a warning when trying to extend a protected method via the extend', () => {
    const store = new Store()
    store.extend([['get', () => false]])
    expect(store.logs.warn.length).to.equal(1)
    expect(store.logs.warn[0]).to.equal('You cannot overwrite `store.get()`')
  })

  it('Should extend the store with a new method via the constructor', () => {
    const store = new Store([['test', () => true]])
    expect(store.test()).to.equal(true)
  })

  it('Should log a warning when pushing to a non-array key', () => {
    const store = new Store()
    store.push('test', 1)
    expect(store.logs.warn.length).to.equal(1)
    expect(store.logs.warn[0]).to.equal(
      'Store.push(value) on key `test`, but key does not hold an array'
    )
  })

  it('Should log a warning when setting an undefined value with set()', () => {
    const store = new Store()
    store.set('test')
    expect(store.logs.warn.length).to.equal(1)
    expect(store.logs.warn[0]).to.equal('Store.set(value) on key `test`, but value is undefined')
  })

  it('Should log a warning when setting an undefined value with setIfUnset()', () => {
    const store = new Store()
    store.setIfUnset('test')
    expect(store.logs.warn.length).to.equal(1)
    expect(store.logs.warn[0]).to.equal(
      'Store.setIfUnset(value) on key `test`, but value is undefined'
    )
  })

  it('Should unset a value', () => {
    const store = new Store()
    store.set('test', 1980)
    expect(store.get('test')).to.equal(1980)
    store.unset('test')
    expect(typeof store.get('test')).to.equal('undefined')
  })
})
