import React from 'react'
import {getAllStations, getStationStatus} from "../services/stationService"
import {Checkbox} from "@blueprintjs/core"

//components may be broken down in separate files
const StationRow = ({item}) => {
    return (
      <tr key={item.station_id}>
        <td>{item.name}</td>
        <td>{item.capacity}</td>
        <td>{item.num_bikes_available}</td>
      </tr>
   )
}

const StationTableHead = () => {
    return (
      <thead>
      <tr>
        <th>Name</th>
        <th>Capacity</th>
        <th>Available</th>
      </tr>
      </thead>
    )
}


class ShowStationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      nameSort: false,
      availabilitySort: false
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

  handleNameSort = () => {
    this.setState({nameSort: !this.state.nameSort})
  }

  handleAvailabilitySort = () => {
    this.setState({availabilitySort: !this.state.availabilitySort})
  }

  sortByName = (stations) => {
    let sortedStations = stations.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return sortedStations;
  }

  sortByAvailability = (stations) => {
    return stations.sort((a, b) => a.num_bikes_available - b.num_bikes_available);
  }

  render() {
    const { stations, nameSort, availabilitySort } = this.state;
    let sortedStations = [...stations];
    //memoization can be considered if perf issues are encountered
    if(nameSort) {
      sortedStations = this.sortByName(sortedStations);
    }
    if(availabilitySort) {
      sortedStations = this.sortByAvailability(sortedStations);
    }

    return (
      <div className={'page-container'}>
        <div className={'table-title'}>
          <h2>Bike Stations (Toronto)</h2>
          <Checkbox checked={nameSort} label="Name (Ascending only)" onChange={this.handleNameSort} />
          <Checkbox checked={availabilitySort} label="Availability (Ascending only)" onChange={this.handleAvailabilitySort} />
        </div>

        <table className="bp3-html-table">
          <StationTableHead/>
          <tbody>
          {
            sortedStations && sortedStations.map(item => (
              <StationRow item={item} key={item.station_id}/>
            ))
          }
          </tbody>
        </table>

      </div>
    )
  }
}

export default ShowStationsPage