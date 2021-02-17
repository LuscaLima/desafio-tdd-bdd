const BaseRepository = require("../repository/base/baseRepository")
const Tax = require("../entities/tax")

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars })
    this.taxesBasedOnAge = Tax.taxesBasedOnAge
    this.currencyFormat = Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    })
  }

  getRandomPositionFromArray(list) {
    const listLength = list.length

    return Math.floor(Math.random() * listLength)
  }

  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds)

    return carCategory.carIds[randomCarIndex]
  }

  async getAvaliableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory)
    const car = await this.carRepository.find(carId)

    return car
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const MILLISECONDS_BY_YEAR = 1000 * 60 * 60 * 24 * 365

    const { birthDate } = customer
    const { price } = carCategory
    const millisecondsAge = new Date() - new Date(birthDate)

    const age = Math.floor(millisecondsAge / MILLISECONDS_BY_YEAR)

    const { then: tax } = Tax.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    )

    const finalPrice = price * tax * numberOfDays

    return this.currencyFormat.format(finalPrice)
  }
}

module.exports = CarService
