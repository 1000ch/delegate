expect = chai.expect

describe "Node.prototype", ->

  describe "Node#bind", ->

    it "is in Node.prototype", ->
      expect(!!Node.prototype.bind).to.equal true
    it "is not in Node", ->
      expect(!!Node.bind).to.equal false

  describe "Node#unbind", ->

    it "is in Node.prototype", ->
      expect(!!Node.prototype.unbind).to.equal true
    it "is not in Node", ->
      expect(!!Node.unbind).to.equal false

  describe "Node#delegate", ->

    it "is in Node.prototype", ->
      expect(!!Node.prototype.delegate).to.equal true
    it "is not in Node", ->
      expect(!!Node.delegate).to.equal false

  describe "Node#undelegate", ->

    it "is in Node.prototype", ->
      expect(!!Node.prototype.undelegate).to.equal true
    it "is not in Node", ->
      expect(!!Node.undelegate).to.equal false

describe "NodeList.prototype", ->

  describe "NodeList#bind", ->

    it "is in NodeList.prototype", ->
      expect(!!NodeList.prototype.bind).to.equal true
    it "is not in NodeList", ->
      expect(!!NodeList.bind).to.equal false

  describe "NodeList#unbind", ->

    it "is in NodeList.prototype", ->
      expect(!!NodeList.prototype.unbind).to.equal true
    it "is not in NodeList", ->
      expect(!!NodeList.unbind).to.equal false

  describe "NodeList#delegate", ->

    it "is in NodeList.prototype", ->
      expect(!!NodeList.prototype.delegate).to.equal true
    it "is not in NodeList", ->
      expect(!!NodeList.delegate).to.equal false

  describe "NodeList#undelegate", ->

    it "is in NodeList.prototype", ->
      expect(!!NodeList.prototype.undelegate).to.equal true
    it "is not in NodeList", ->
      expect(!!NodeList.undelegate).to.equal false