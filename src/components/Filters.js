import React, { Component } from 'react';
import concerts from '../../data/concerts.json';

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

class Filter extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const menuID = [this.props.head.toLowerCase(), 'menu'].join('-');
    const isOpen = this.props.isOpen;
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
    this.props.update(this.props.isOpen ? null : this.props.concertKey);
  }
}

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null
    };

    this.updateDropdown = this.updateDropdown.bind(this);
  }

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
            <Filter
              className='align-left'
              head={'Artists'}
              concertKey={'artist'}
              data={artists}
              update={this.updateDropdown}
              isOpen={this.state.openMenu === 'artist'}
            />
            <Filter
              head={'Venues'}
              concertKey={'venue'}
              data={venues}
              update={this.updateDropdown}
              isOpen={this.state.openMenu === 'venue'}
            />
            <Filter
              head={'Locations'}
              concertKey={'location'}
              data={locations}
              update={this.updateDropdown}
              isOpen={this.state.openMenu === 'location'}
            />
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

  updateDropdown(type) {
    this.setState({
      openMenu: type
    });
  }
}


export default Filters;
