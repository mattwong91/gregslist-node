import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class HousesService {
  async getHouses() {
    const houses = await dbContext.Houses.find()
    return houses
  }
  async createHouse(houseData) {
    const house = await dbContext.Houses.create(houseData)
    return house
  }

  async getHouseById(houseId) {
    const house = await dbContext.Houses.findById(houseId)
    if (!house) {
      throw new BadRequest(`${houseId} is not a valid ID`)
    }
    return house
  }

  async removeHouse(houseId, userId) {
    const houseToRemove = await this.getHouseById(houseId)
    if (houseToRemove.creatorId != userId) {
      throw new Forbidden('Cannot remove listings by other users.')
    }
    await houseToRemove.remove()
  }

  async updateHouse(houseId, userId, houseData) {
    const houseToUpdate = await this.getHouseById(houseId)

    if (houseToUpdate.creatorId != userId) {
      throw new Forbidden('Cannot update. This listing belongs to another user.')
    }

    houseToUpdate.bedrooms = houseData.bedrooms || houseToUpdate.bedrooms
    houseToUpdate.bathrooms = houseData.bathrooms || houseToUpdate.bathrooms
    houseToUpdate.price = houseData.price || houseToUpdate.price

    houseToUpdate.save()
    return houseToUpdate

  }

}

export const housesService = new HousesService()