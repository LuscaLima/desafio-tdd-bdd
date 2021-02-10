const faker = require("faker")
const { join } = require("path")
const { writeFile } = require("fs/promises")

const Car = require("../src/entities/car")
const CarCategory = require("../src/entities/carCategory")
const Customer = require("../src/entities/customer")

const seedBaseFolder = join(__dirname, "..", "database")
const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
})

const cars = []
const customers = []

for (let i = 0; i < ITEMS_AMOUNT; i++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    avaliable: true,
    gasAvaliable: true,
    releaseYear: faker.date.past().getFullYear(),
  })

  carCategory.carIds.push(car.id)
  cars.push(car)

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    birthDate: faker.date.between(new Date(1970, 1, 1), new Date(2004, 1, 1)),
  })

  customers.push(customer)
}

const write = (filename, data) =>
  writeFile(join(seedBaseFolder, filename), JSON.stringify(data))

;(async () => {
  await write("cars.json", cars)
  await write("customers.json", customers)
  await write("carCategories.json", [carCategory])
})()
