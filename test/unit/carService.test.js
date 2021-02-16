const { describe, it, before, beforeEach, afterEach } = require("mocha")
const { expect } = require("chai")
const sinon = require("sinon")
const { join } = require("path")
const CarService = require("../../src/service/carService")

const baseDatabase = join(__dirname, "..", "..", "database", "cars.json")

const mocks = {
  carCategory: require("../mocks/valid-carCategory.json"),
  car: require("../mocks/valid-car.json"),
  customer: require("../mocks/valid-customer.json"),
}

describe("CarService tests swite", () => {
  let carService = {}
  let sandbox = {}

  before(() => {
    carService = new CarService({
      cars: baseDatabase,
    })
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it("should retrieve a random position from an array", () => {
    const data = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })

  it("should choose the first id from carIds in carCategory", () => {
    const carCategory = mocks.carCategory
    const carIdIndex = 0

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex)

    const result = carService.chooseRandomCar(carCategory)
    const expected = carCategory.carIds[carIdIndex]

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    expect(result).to.be.equal(expected)
  })

  it("given a carCategory it should return an avaliable car", async () => {
    const car = mocks.car
    const carCategory = Object.create(mocks.carCategory)
    carCategory.carIds = [car.id]

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car)
    sandbox.spy(carService, carService.chooseRandomCar.name)

    const result = await carService.getAvaliableCar(carCategory)
    const expected = car

    expect(carService.chooseRandomCar.calledOnce).to.be.ok
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
    expect(result).to.be.deep.equal(expected)
  })
})
