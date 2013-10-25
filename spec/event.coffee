expect = chai.expect

describe "Delegate", ->

  describe "#on", ->

    spy = null
    delegate = null
    button = null

    beforeEach ->
      spy = sinon.spy()
      delegate = new Delegate(document.querySelector "#container")
      button = document.querySelector "button"

    afterEach ->
      delegate.off()

    it "delegate function 1", ->
      delegate.on "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2

    it "delegate function 2", ->
      delegate.on "click", ".class1", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2

  describe "#off", ->

    spy = null
    delegate = null
    button = null

    beforeEach ->
      spy = sinon.spy()
      delegate = new Delegate(document.querySelector "#container")
      button = document.querySelector "button"

    afterEach ->
      delegate.off()

    it "undelegate function 1", ->
      delegate.on "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2
      delegate.off "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2

    it "undelegate function 2", ->
      delegate.on "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2
      delegate.off "click", "button"
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2

    it "undelegate function 3", ->
      delegate.on "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2
      delegate.off "click"
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2

    it "undelegate function 4", ->
      delegate.on "click", "button", spy
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2
      delegate.off()
      button.click()
      button.click()
      expect(spy.callCount).to.equal 2
