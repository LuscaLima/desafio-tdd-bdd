const { readFile } = require("fs/promises")

class BaseRepository {
  constructor({ file }) {
    this.file = file
  }

  async find(itemId) {
    const file = await readFile(this.file)
    const content = JSON.stringify(file)

    if (!itemId) {
      return content
    }

    return content.find(({ id }) => id === itemId)
  }
}

module.exports = BaseRepository
