import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            term: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    componentDidMount() {
        const term = localStorage.getItem('term');
        this.setState({ term });
    }

    search() {
        this.props.onSearch(this.state.term);
    }
    
    handleTermChange(event) {
        localStorage.setItem('term', event.target.value);
        this.setState( { term: event.target.value } );
        
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} value={this.state.term} />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}

export default SearchBar;