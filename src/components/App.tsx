import React, { Component } from "react";

import Searchbox from "./Searchbox";
import LegTable from "./LegTable";
import LegProfile from "./LegProfile";
import _allLegislatorsBaseData from "../data/legislators.json";

import "../css/general.css";

// casting adds type for fullName, non-existent in legislators.json file
let allLegislatorsBaseData = _allLegislatorsBaseData as allLegislatorsBaseData;
for (let leg of allLegislatorsBaseData) {
  leg.fullName = leg.lastName + ", " + leg.firstName;
}

type AppState = {
  allLegislatorsBaseData: allLegislatorsBaseData;
  searchTerm: string;
  activeLegislator: string;
};

class App extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      allLegislatorsBaseData,
      searchTerm: "",
      activeLegislator: ""
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputClear = this.onInputClear.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionSelect = this.onSuggestionSelect.bind(this);
    this.onLegislatorCellClick = this.onLegislatorCellClick.bind(this);
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.setState({ activeLegislator: suggestionValue });
    event.preventDefault();
  }

  onSuggestionSelect(suggestion) {
    this.setState({
      activeLegislator: suggestion.legislatorName,
      searchTerm: suggestion.legislatorName
    });
  }

  onLegislatorCellClick(event) {
    const clickedLegislator = event.target.innerHTML;
    this.setState({
      activeLegislator: clickedLegislator,
      searchTerm: clickedLegislator
    });
  }

  onInputChange(event, { newValue }) {
    if (newValue === "") {
      this.setState({ activeLegislator: "" });
    }
    this.setState({ searchTerm: newValue });
  }

  onInputClear() {
    this.setState({ activeLegislator: "", searchTerm: "" });
  }

  handleSort(sortKey) {
    const originalLegBaseData = Array.from(this.state.allLegislatorsBaseData);
    const { allLegislatorsBaseData: runningLegData } = this.state;

    const columnIsNumerical = sortKey !== "fullName";
    const columnIsAlphabetical = sortKey === "fullName";

    // first sorting
    if (columnIsNumerical) {
      runningLegData.sort(
        (a, b) => parseInt(b[sortKey]) - parseInt(a[sortKey])
      );
    } else if (columnIsAlphabetical) {
      runningLegData.sort((a, b) => {
        // sort in alphabetical order
        if (a[sortKey] < b[sortKey]) return -1;
        else if (a[sortKey] > b[sortKey]) return 1;
        else return 0;
      });
    }

    // if first sorting produced original order again, then reverse order
    const originalOrderAgain =
      originalLegBaseData[0].lastName === runningLegData[0].lastName;
    if (originalOrderAgain) {
      if (columnIsNumerical) {
        runningLegData.sort(
          (a, b) => parseInt(a[sortKey]) - parseInt(b[sortKey])
        );
      } else if (columnIsAlphabetical) {
        runningLegData.sort((a, b) => {
          // sort in reverse alphabetical order
          if (a[sortKey] > b[sortKey]) return -1;
          else if (a[sortKey] < b[sortKey]) return 1;
          else return 0;
        });
      }
    }

    this.setState({ allLegislatorsBaseData: runningLegData });
    return false;
  }

  render() {
    const { allLegislatorsBaseData, searchTerm, activeLegislator } = this.state;
    const anyActiveLegislator = activeLegislator !== "";

    let filteredList: allLegislatorsBaseData;

    // if suggestion picked (has comma), filter for exact equality
    if (searchTerm.includes(",")) {
      filteredList = allLegislatorsBaseData.filter(
        leg => leg.fullName === searchTerm
      );
    }
    // if no suggestion picked, filter at start with uppercase
    else {
      filteredList = allLegislatorsBaseData.filter(leg =>
        leg.fullName.startsWith(searchTerm.toUpperCase())
      );
    }

    return (
      <>
        <header />

        <div id="container-for-emblem-and-searchbox">
          <div>
            <img src="/emblem.png" alt="Legislatura" />
          </div>
          <form>
            <Searchbox
              legislatorsList={allLegislatorsBaseData}
              searchTerm={searchTerm}
              onInputChange={this.onInputChange}
              onSuggestionSelected={this.onSuggestionSelected}
              onInputClear={this.onInputClear}
              onSuggestionSelect={this.onSuggestionSelect}
            />
          </form>
        </div>

        <div id="container-for-splash-image">
          <img src="/legislators.png" alt="Legisladores" />
        </div>

        <LegTable
          list={filteredList}
          activeLegislator={activeLegislator}
          handleSort={this.handleSort}
          onLegislatorClick={this.onLegislatorCellClick}
        />

        {anyActiveLegislator && (
          <LegProfile
            activeLegislator={activeLegislator}
            allLegislatorsBaseData={allLegislatorsBaseData}
          />
        )}
      </>
    );
  }
}

export default App;
