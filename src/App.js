import React, { Component } from 'react';
import Filtration from './filter.js';
import './App.css';
import '../node_modules/bulma/css/bulma.css';
import concerts from '../data/concerts.json';
import Item from './components/Item';
import Filters from './components/Filters';

const filtration = new Filtration(concerts);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concerts: concerts,
      filter: false,
      order: 'descending',
      changed: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
    this.onSortClick = this.onSortClick.bind(this);
  }

  render() {
    const concertList = this.state.concerts.sort((a, b) => {
      const dateA = new Date(a.dates[0]);
      const dateB = new Date(b.dates[0]);
      const less = this.state.order === 'descending' ? 1 : -1;
      const greater = less === 1 ? -1 : 1;
      if (dateA < dateB) {
        return less;
      } else if (dateA > dateB) {
        return greater;
      }
      return 0;
    }).map((concert, i) => {
      return ( <Item key={i} data={concert} /> );
    });

    return (
      <div className='App container' onClick={this.handleClick}>
        <div className='App-header'>
          <h1 className="title">Concerts</h1>
        </div>
        <Filters
          show={this.state.filter}
          onClearClick={this.onClearClick}
          changed={this.state.changed}
          order={this.state.order}
          onSortClick={this.onSortClick}
        />
        <div className='concert-list hero'>
          <div className='columns is-multiline card-cols'>{concertList}</div>
        </div>
      </div>
    );
  }

  targetHandler(target) {
    const type = target.getAttribute('data-filter-key');
    const filter = { name: type, value: target.innerText };
    return {
      type: type && 'filter',
      filter: filter
    };
  }

  handleClick(e) {
    const target = this.targetHandler(e.target);

    if (target.type === 'filter') {
      this.setState(() => ({
        concerts: filtration.filter(target.filter),
        filter: target.filter,
        changed: true
      }));
    }
  }

  onClearClick() {
    this.setState(() => ({
      concerts: concerts,
      filter: false
    }));
  }

  onSortClick(e) {
    if (e.currentTarget.getAttribute('aria-pressed') === 'true') { return; }
    const prevState = e.currentTarget.getAttribute('data-sort-type');
    this.setState(() => ({
      order: prevState
    }));
  }
}

export default App;
