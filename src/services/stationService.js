import axios from "axios"
import {CONFIG} from "../config"

export const getAllStations = () => {
  return axios.get(CONFIG.API_BASE + '/station_information')
    .then((res) => res.data)
}

export const getStationStatus = () => {
  return axios.get(CONFIG.API_BASE + '/station_status')
    .then((res) => res.data)
}
