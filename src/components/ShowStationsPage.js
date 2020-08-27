import React from 'react'
import {getAllStations, getStationStatus} from "../services/stationService"

class ShowStationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: []
    }
  }
  componentDidMount() {
    this.getStationData();
  }

  mergeStationData = (stations, status) => {
    let merged = [];
    stations.forEach(item => {
      let currentStatus = status.filter(statusItem => statusItem.station_id === item.station_id)[0];
      const currentMerged = {...item, ...currentStatus};
      merged.push(currentMerged);
    })
    this.setState({ stations: merged })
  }

  getStationData = async () => {
    let stations = await getAllStations();
    let status = await getStationStatus();
    stations = stations?.data?.stations;
    status = status?.data?.stations;
    this.mergeStationData(stations, status);

  }

  render() {
    const stations = this.state?.stations;
    return (
      <div>
        Stations

        <table className="bp3-html-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Available</th>
          </tr>
          </thead>
          <tbody>
          {
            stations && stations.map(item => (
              <tr key={item.station_id}>
                <td>{item.name}</td>
                <td>{item.capacity}</td>
                <td>{item.num_bikes_available}</td>
              </tr>
            ))
          }
          </tbody>
        </table>

      </div>
    )
  }
}

export default ShowStationsPage