import React, { Component } from 'react';
import Filtration from './filter.js';
import './App.css';
import '../node_modules/bulma/css/bulma.css';
import concerts from '../data/concerts.json';

const filtration = new Filtration(concerts);
const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

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

class Item extends Component {
  render() {
    const concert = this.props.data;
    return (
      <div className='concert-box column is-one-third-desktop is-half-tablet'>
        <div>
          <div className='title'>{concert.artist}</div>
          <div className='other-info'>
            <div>{concert.venue}</div>
            <div>{concert.location}</div>
          </div>
          <div className='dates'>{concert.dates.join(', ')}</div>
        </div>
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    const sortButtons = (
      <div role='group' aria-labelledby='sort-head' className='sort-wrap'>
        <h2 className='subtitle' id='sort-head'>Sort</h2>
        <button
          onClick={this.props.onSortClick}
          className='button'
          type='button'
          data-sort-type='ascending'
          aria-pressed={this.props.order === 'descending' ? 'false' : 'true'}>
            Date (asc)
        </button>
        <button
          onClick={this.props.onSortClick}
          className='button'
          type='button'
          data-sort-type='descending'
          aria-pressed={this.props.order === 'descending' ? 'true' : 'false'}>
            Date (desc)
        </button>
      </div>
    );
    if (!this.props.show) {
      const artists = concerts.map((c) => c.artist).filter(onlyUnique).sort();
      const venues = concerts.map((c) => c.venue).filter(onlyUnique).sort();
      const locations = concerts.map((c) => c.location).filter(onlyUnique).sort((a, b) => {
        const sliceA = a.slice(-2)[0];
        const sliceB = b.slice(-2)[0];
        return (sliceA < sliceB && -1) || (sliceA > sliceB && 1) || 0;
      });

      return (
        <div className='filters' tabIndex='-1' ref={(div) => {
          if (div && this.props.changed) {
            div.focus();
          }
        }}>
          <div role='group' className='filter-wrap' aria-labelledby='view-head'>
            <h2 className='subtitle' id='view-head'>View</h2>
            <Filter className='align-left' head={'Artists'} concertKey={'artist'} data={artists} />
            <Filter head={'Venues'} concertKey={'venue'} data={venues} />
            <Filter head={'Locations'} concertKey={'location'} data={locations} />
          </div>
          {sortButtons}
        </div>
      );
    } else {
      return (
        <div className='filters' tabIndex='-1' ref={(div) => {
          if (div) { div.focus(); }
        }}>
          <div role='group' className='filter-wrap'>
            <div className='viewing subtitle'>Viewing:</div>
            <div className='filter-val'>{this.props.show.value}</div>
            <div className='filter-type'>({this.props.show.name})</div>
            <button type='button' className='button' onClick={this.props.onClearClick}>Clear filter</button>
          </div>
          {sortButtons}
        </div>
      );
    }
  }
}

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const menuID = [this.props.head.toLowerCase(), 'menu'].join('-');
    const isOpen = this.state.isOpen;
    const fClass = ['filter-opts', (isOpen) ? ' open' : ''].join('');
    const bClass = ['button filter-head', (isOpen) ? ' is-info' : ''].join('');
    const opts = this.props.data.map((d, i) => {
      return (
        <div key={i} data-filter-key={this.props.concertKey} className='filter-opt'>{d}</div>
      );
    });

    return (
      <div className='filter'>
        <button aria-controls={menuID} className={bClass} onClick={this.handleClick}>
          {this.props.head}
          <span className='tally'>({this.props.data.length})</span>
        </button>
        <div id={menuID} className={fClass}>{opts}</div>
      </div>
    );
  }

  handleClick() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }
}

export default App;
