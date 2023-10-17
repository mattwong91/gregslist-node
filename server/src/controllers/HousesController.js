import { Auth0Provider } from "@bcwdev/auth0provider";
import { housesService } from "../services/HousesService.js";
import BaseController from "../utils/BaseController.js";

export class HousesController extends BaseController {
  constructor() {
    super('api/houses')
    this.router
      .get('', this.getHouses)
      .get('/:houseId', this.getHouseById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createHouse)
      .delete('/:houseId', this.removeHouse)
      .put('/:houseId', this.updateHouse)
  }

  async getHouses(request, response, next) {
    try {
      const houses = await housesService.getHouses()
      return response.send(houses)
    }
    catch (error) {
      next(error)
    }
  }

  async getHouseById(request, response, next) {
    try {
      const houseId = request.params.houseId
      const house = await housesService.getHouseById(houseId)
      return response.send(house)
    }
    catch (error) {
      next(error)
    }
  }

  async createHouse(request, response, next) {
    try {
      const houseData = request.body
      const userInfo = request.userInfo
      houseData.creatorId = userInfo.id

      const house = await housesService.createHouse(houseData)
      return response.send(house)
    }
    catch (error) {
      next(error)
    }
  }

  async removeHouse(request, response, next) {
    try {
      const houseId = request.params.houseId
      const userId = request.userInfo.id
      await housesService.removeHouse(houseId, userId)
      response.send(`The house with id: ${houseId} has been deleted.`)
    }
    catch (error) {
      next(error)
    }
  }

  async updateHouse(request, response, next) {
    try {
      const houseId = request.params.houseId
      const userId = request.userInfo.id
      const houseData = request.body

      const updatedHouse = await housesService.updateHouse(houseId, userId, houseData)
      response.send(updatedHouse)
    }
    catch (error) {
      next(error)
    }
  }

}