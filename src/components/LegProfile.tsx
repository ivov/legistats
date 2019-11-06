import React, { Component } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/es_ES";
import faker from "faker";

import legislators from "../data/legislators.json";
import parties from "../data/parties.json";
import regions from "../data/regions.json";
import _votings from "../data/votings.json";

import ProfilePhoto from "./ProfilePhoto";
import ProfileIntro from "./ProfileIntro";
import ProfileGenInfo from "./ProfileGenInfo";
import Spinner from "./Spinner";
import VotesTable from "./VotesTable";
import DoughnutChart from "./DoughnutChart";

// casting adds type for voteType, non-existent in votings.json file
let votings = _votings as votings;

type LegProfileProps = {
  activeLegislator: string;
  allLegislatorsBaseData: allLegislatorsBaseData;
};

type LegProfileState = {
  legislatorBaseData: legislatorBaseData;
  legislatorDerivedData: legislatorDerivedData;
  isLoadingForIntro: boolean;
  isLoadingForVotesTable: boolean;
  currentPage: number;
  votesTableTotalRecords: number;
};

class LegProfile extends Component<LegProfileProps, LegProfileState> {
  constructor(props) {
    super(props);
    this.state = {
      legislatorBaseData: {
        id: 0,
        firstName: "",
        lastName: "",
        fullName: "",
        type: "",
        partyId: 0,
        regionId: 0,
        affirmativeVotes: 0,
        negativeVotes: 0,
        abstentions: 0,
        absences: 0,
        urlId: 0
      },
      legislatorDerivedData: {
        photoUrl: "",
        party: "",
        region: "",
        translatedType: "",
        regionFlagPath: "",
        deputies: 0,
        population: 0,
        partyColleagues: [""],
        votes: [],
        votings: []
      },
      isLoadingForIntro: true,
      isLoadingForVotesTable: true,
      currentPage: 1,
      votesTableTotalRecords: 0
    };
    this.onPageChange = this.onPageChange.bind(this);
  }

  onPageChange(newPage) {
    this.setState({ ...this.state, currentPage: newPage });
  }

  async componentDidMount() {
    const legislatorBaseData = await this.getlegislatorBaseData();

    this.setState(
      prevState => ({
        ...prevState,
        legislatorBaseData: legislatorBaseData
      }),
      async () => {
        await this.retrievePhotograph();
        this.setTranslatedType();
        this.setPartyAndRegionRelatedData();
        await this.setPartyColleagues();
        await this.setVotings();
      }
    );
  }

  getlegislatorBaseData = async () => {
    const { allLegislatorsBaseData, activeLegislator } = this.props;

    for (let leg of allLegislatorsBaseData) {
      if (activeLegislator === leg.fullName) {
        return leg;
      }
    }

    throw Error("No legislator base data found");
  };

  async retrievePhotograph() {
    // simulate photo retrieval with random pics, except two for demo
    let photoUrl = faker.image.avatar();

    const { lastName } = this.state.legislatorBaseData;
    if (lastName === "ABASTO") {
      photoUrl = "abasto.jpg";
    } else if (lastName === "AMADEO") {
      photoUrl = "amadeo.jpg";
    }

    this.setState({
      legislatorDerivedData: {
        ...this.state.legislatorDerivedData,
        photoUrl
      }
    });
  }

  setTranslatedType() {
    const { type, firstName } = this.state.legislatorBaseData;

    let translatedType = "";
    if (type === "deputy") {
      translatedType = firstName.endsWith("a") ? "Diputada" : "Diputado";
    } else {
      translatedType = firstName.endsWith("a") ? "Senadora" : "Senador";
    }
    this.setState({
      legislatorDerivedData: {
        ...this.state.legislatorDerivedData,
        translatedType
      }
    });
  }

  setPartyAndRegionRelatedData = () => {
    const { partyId, regionId } = this.state.legislatorBaseData;

    let derivedParty = "";
    for (let party of parties) {
      if (party.id === partyId) {
        derivedParty = party.name;
      }
    }

    let derivedRegion = "";
    for (let region of regions) {
      if (region.id === regionId) {
        derivedRegion = region.name;
      }
    }

    let regionFlagPath = "";
    if (derivedRegion === "C.A.B.A.") {
      regionFlagPath = "/flags/caba.png";
    } else {
      const formattedProvince = derivedRegion.toLowerCase().replace(/ /g, "-");
      regionFlagPath = "/flags/" + formattedProvince + ".png";
    }

    let deputies: number = 0;
    let population: number = 0;
    for (let region of regions) {
      if (region.name === derivedRegion) {
        deputies = region.deputies;
        population = region.population;
      }
    }

    this.setState({
      legislatorDerivedData: {
        ...this.state.legislatorDerivedData,
        party: derivedParty,
        region: derivedRegion,
        regionFlagPath,
        deputies,
        population
      }
    });
  };

  async setPartyColleagues() {
    const { partyId, firstName, lastName } = this.state.legislatorBaseData;

    let partyColleagueIds: Array<number> = [];
    for (let leg of legislators) {
      if (leg.partyId === partyId) {
        partyColleagueIds.push(leg.id);
      }
    }

    let partyColleagueFullNames: Array<string> = [];
    for (let colleagueId of partyColleagueIds) {
      for (let leg of legislators) {
        if (leg.id === colleagueId) {
          let fullName = leg.lastName + ", " + leg.firstName;
          partyColleagueFullNames.push(fullName);
        }
      }
    }

    let activeLegislatorFullName = lastName + ", " + firstName;
    const filteredPartyColleagueFullNames = partyColleagueFullNames.filter(
      fullName => fullName !== activeLegislatorFullName
    );

    // simulate loading to show spinner
    await sleep(2000);

    this.setState({
      legislatorDerivedData: {
        ...this.state.legislatorDerivedData,
        partyColleagues: filteredPartyColleagueFullNames
      },
      isLoadingForIntro: false
    });
  }

  setVotings = async () => {
    // simulate DB query with random data
    let derivedVotes: votes = [];
    const voteTypes = ["affirmative", "negative", "abstention"];
    for (let i = 0; i < 15; i++) {
      derivedVotes.push({
        votingId: Math.floor(Math.random() * 2270) + 1,
        voteType: voteTypes[Math.floor(Math.random() * voteTypes.length)]
      });
    }
    this.translateDerivedVoteType(derivedVotes);

    let derivedVotings: votings = [];
    for (let vote of derivedVotes) {
      for (let voting of votings) {
        if (vote.votingId === voting.id) {
          voting.voteType = vote.voteType;
          derivedVotings.push(voting);
        }
      }
    }
    this.reformatDerivedVotingDate(derivedVotings);

    // simulate loading to show spinner
    await sleep(3500);

    this.setState({
      legislatorDerivedData: {
        ...this.state.legislatorDerivedData,
        votes: derivedVotes,
        votings: derivedVotings
      },
      isLoadingForVotesTable: false,
      votesTableTotalRecords: derivedVotes.length
    });
  };

  translateDerivedVoteType(derivedVotes: votes) {
    for (let vote of derivedVotes) {
      if (vote.voteType === "affirmative") {
        vote.voteType = "Afirmativo";
      } else if (vote.voteType === "negative") {
        vote.voteType = "Negativo";
      } else if (vote.voteType === "abstention") {
        vote.voteType = "Abstención";
      }
    }
  }

  reformatDerivedVotingDate(derivedVotings: votings) {
    for (let voting of derivedVotings) {
      let [date, time] = voting.votedAt.split(" ");
      let [year, month, day] = date.split("-");
      voting.votedAt = `${day}/${month}/${year} ${time}`;
    }
  }

  render() {
    const { activeLegislator } = this.props;

    const {
      affirmativeVotes,
      negativeVotes,
      abstentions,
      absences,
      firstName,
      lastName
    } = this.state.legislatorBaseData;
    const fullName = firstName + " " + lastName;

    const { currentPage, votesTableTotalRecords } = this.state;

    const {
      photoUrl,
      party,
      region,
      translatedType,
      regionFlagPath,
      deputies,
      population,
      partyColleagues,
      votings
    } = this.state.legislatorDerivedData;

    const activeLegislatorVoteStats = {
      affirmativeVotes,
      negativeVotes,
      abstentions,
      absences
    };

    const { isLoadingForIntro, isLoadingForVotesTable } = this.state;

    const constituency =
      region === "C.A.B.A."
        ? " Ciudad Autónoma de Buenos Aires"
        : " provincia de " + region;

    const constituents = population / deputies;
    const formattedConstituents = constituents
      .toLocaleString("de-DE")
      .replace(/,.*/, "");

    const votesForDoughnut: Array<number> = Object.keys(
      activeLegislatorVoteStats
    ).map(key => activeLegislatorVoteStats[key]);

    if (isLoadingForIntro)
      return (
        <div className="profile-area">
          <Spinner />
        </div>
      );

    return (
      <div className="profile-area">
        <div className="profile">
          <div className="first-profile-line">
            <ProfileIntro
              activeLegislator={activeLegislator}
              legislatorType={translatedType}
              party={party}
              constituency={constituency}
              regionFlagPath={regionFlagPath}
            />
          </div>

          <div className="second-profile-line">
            <ProfilePhoto photoUrl={photoUrl} />
            <ProfileGenInfo
              deputies={deputies}
              constituency={constituency}
              formattedConstituents={formattedConstituents}
              partyColleagues={partyColleagues}
            />
          </div>

          <div className="third-profile-line">
            <div className="info-for-pie-chart">
              <div className="title-for-chart">{fullName}</div>
              <div className="legend-for-chart">
                <div className="pillsnums-for-chart">
                  <div className="num green-circle num-for-chart">
                    {affirmativeVotes}
                  </div>
                  <div className="num red-circle num-for-chart">
                    {negativeVotes}
                  </div>
                  <div className="num yellow-circle num-for-chart">
                    {abstentions}
                  </div>
                  <div className="num grey-circle num-for-chart">
                    {absences}
                  </div>
                  <div className="circle-reference">Círculo externo</div>
                  <div className="circle-reference">Círculo interno</div>
                </div>
                <div className="pillnames-for-chart">
                  <div>Afirmativos</div>
                  <div>Negativos</div>
                  <div>Abstenciones</div>
                  <div>Ausencias</div>
                  <div>Legislador seleccionado</div>
                  <div>Legislador promedio</div>
                </div>
              </div>
            </div>
            <DoughnutChart votesForDoughnut={votesForDoughnut} />
          </div>

          {isLoadingForVotesTable ? (
            <div className="profile-area">
              <Spinner />
            </div>
          ) : (
            <div className="fourth-profile-line">
              <VotesTable
                votings={votings}
                currentPage={currentPage}
                totalVotes={votesTableTotalRecords}
              />

              <Pagination
                current={currentPage}
                total={votesTableTotalRecords}
                onChange={this.onPageChange}
                locale={localeInfo}
                pageSize={5}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const sleep = async (timeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, timeInMs));

export default LegProfile;
