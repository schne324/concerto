import React, { Component } from 'react';

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

export default Item;
