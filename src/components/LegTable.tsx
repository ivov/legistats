import React, { Component } from "react";
import Spinner from "./Spinner";

type TableProps = {
  list: allLegislatorsBaseData;
  activeLegislator: string;
  handleSort: Function;
  onLegislatorClick: (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => void;
};

type TableState = {
  isLoading: boolean;
  activeLegislator: string | null;
  loadingText: string;
};

class LegTable extends Component<TableProps, TableState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeLegislator: null,
      loadingText: ""
    };
  }

  async onHeaderClick(sortKey) {
    this.setState({ isLoading: true });
    this.props.handleSort(sortKey);
    this.blinkAndSetLoadingToFalse();
  }

  // await a 250ms promise to force separation
  // of the two setState acting on isLoading
  async blinkAndSetLoadingToFalse() {
    await new Promise(resolve => setTimeout(resolve, 250));
    this.setState({ isLoading: false, loadingText: "" });
  }

  render() {
    const { list, activeLegislator, onLegislatorClick } = this.props;
    const { isLoading } = this.state;

    if (isLoading)
      return (
        <div className="table-area">
          <Spinner />
        </div>
      );

    return (
      <div className="table-area">
        <table className="legislators-table">
          <tbody>
            <tr className="header-row">
              <th
                className="leg"
                onClick={() => this.onHeaderClick("fullName")}
              >
                Legislador
              </th>
              <th
                className="num"
                onClick={() => this.onHeaderClick("affirmativeVotes")}
              >
                Afirmativos
              </th>
              <th
                className="num"
                onClick={() => this.onHeaderClick("negativeVotes")}
              >
                Negativos
              </th>
              <th
                className="num"
                onClick={() => this.onHeaderClick("abstentions")}
              >
                Abstenciones
              </th>
              <th
                className="num"
                onClick={() => this.onHeaderClick("absences")}
              >
                Ausencias
              </th>
            </tr>

            {list.map(leg => {
              const isActiveLegislator = leg.fullName === activeLegislator;
              return (
                <tr key={leg.id}>
                  <td
                    onClick={onLegislatorClick}
                    className={isActiveLegislator ? "leg selected" : "leg"}
                  >
                    {leg.fullName}
                  </td>
                  <td className="num green-circle">{leg.affirmativeVotes}</td>
                  <td className="num red-circle">{leg.negativeVotes}</td>
                  <td className="num yellow-circle">{leg.abstentions}</td>
                  <td className="num grey-circle">{leg.absences}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default LegTable;
