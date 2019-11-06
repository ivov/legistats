import React, { Component, FormEvent } from "react";
import Autosuggest from "react-autosuggest";
import "../css/autosuggest.css";

type SearchboxProps = {
  legislatorsList: allLegislatorsBaseData;
  searchTerm: string;
  onInputChange: (event: FormEvent, { newValue: string }) => void;
  onInputClear: () => void;
  onSuggestionSelect: (event) => void;
  onSuggestionSelected: (event: FormEvent, { suggestionValue: string }) => void;
};

type SearchboxState = {
  value: string;
  suggestions: [];
};

class Searchbox extends Component<SearchboxProps, SearchboxState> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.searchTerm,
      suggestions: []
    };
  }

  // populate this.state.suggestions based on value entered
  onSuggestionsFetchRequested = ({ value }) => {
    const cleanValue = value.trim().toUpperCase();
    let suggestionsForInputTerm;

    if (cleanValue.length === 0) suggestionsForInputTerm = [];

    suggestionsForInputTerm = this.props.legislatorsList.filter(
      leg => leg.fullName.slice(0, cleanValue.length) === cleanValue
    );

    this.setState({
      suggestions: suggestionsForInputTerm
    });
  };

  shouldRenderSuggestions(value) {
    return value.trim().length > 1;
  }

  renderSuggestion = suggestion => {
    return <div>{suggestion.legislatorName}</div>;
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSuggestionSelect(suggestion);
  };

  render() {
    const { suggestions } = this.state;
    const { onInputClear } = this.props;
    const inputProps = {
      placeholder: "Ingresar apellido de legislador...",
      value: this.props.searchTerm,
      onChange: this.props.onInputChange
    };

    const inputIsEmpty = this.props.searchTerm === "";

    return (
      <>
        <Autosuggest
          inputProps={inputProps}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          getSuggestionValue={suggestion => suggestion.legislatorName}
          renderSuggestion={this.renderSuggestion}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        />
        {inputIsEmpty ? null : (
          <i className="fa fa-times-circle icon" onClick={onInputClear} />
        )}
      </>
    );
  }
}

export default Searchbox;
