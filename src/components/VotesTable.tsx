import React from "react";

const VotesTable = ({ votings, currentPage, totalVotes }) => {
  const itemsPerPage = 5;
  const endIndex = currentPage * itemsPerPage;

  let startIndex = 0;
  if (currentPage === 1) {
    startIndex = 0;
  } else {
    startIndex = (currentPage - 1) * itemsPerPage;
  }

  const votingsOnCurrentPage = votings.slice(startIndex, endIndex);

  return (
    <div className="table-area">
      <table className="votes-table">
        <tbody>
          <tr className="votes-table-header-row">
            <th className="votes-table-date-column">Fecha</th>
            <th className="votes-table-voting-title-column">Votación</th>
            <th className="votes-table-vote-column">Voto</th>
          </tr>

          {votingsOnCurrentPage &&
            votingsOnCurrentPage.map((voting, index) => {
              return (
                <tr key={index} className="votes-table-data-row">
                  <td className="votes-table-date-column">{voting.votedAt}</td>
                  <td className="votes-table-voting-title-column">
                    {voting.title}
                  </td>
                  <td className="votes-table-vote-column">{voting.voteType}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default VotesTable;
