const { describe, it, before, beforeEach, afterEach } = require("mocha")
const { expect } = require("chai")
const sinon = require("sinon")
const { join } = require("path")
const CarService = require("../../src/service/carService")
const Transaction = require("../../src/entities/transaction")

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

  it("given a carCategory, customer and numberOfDays it should calculate the final amount in BRL", async () => {
    const customer = Object.create(mocks.customer)
    customer.birthDate = new Date("02-26-1966")

    const carCategory = Object.create(mocks.carCategory)
    carCategory.price = 37.6

    const numberOfDays = 5

    // not rely on external data
    sandbox.stub(carService, "taxesBasedOnAge").get(() => [
      {
        from: 31,
        to: 85,
        then: 1.3,
      },
    ])

    const expected = carService.currencyFormat.format(244.4)
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    )

    expect(result).to.be.deep.equal(expected)
  })

  it("giver a customer and a carCategory it should return a transaction receipt", async () => {
    const car = mocks.car
    const carCategory = {
      ...mocks.carCategory,
      price: 37.6,
      carIds: [car.id],
    }
    const customer = Object.create(mocks.customer)
    customer.birthDate = new Date(1999, 0, 27)

    const numberOfDays = 5
    const dueDate = "10 de novembro de 2021"

    const now = new Date(2021, 10, 5)
    sandbox.useFakeTimers(now.getTime())
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car)

    // age 20: 37.6 * 1.1 * 5 = 206.8
    const expectedAmount = carService.currencyFormat.format(206.8)
    const result = await carService.rent(customer, carCategory, numberOfDays)

    const expected = new Transaction({
      customer,
      car,
      amout: expectedAmount,
      dueDate,
    })

    expect(result).to.be.deep.equal(expected)
  })
})
