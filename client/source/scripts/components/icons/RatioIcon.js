import React from 'react';

import BaseIcon from './BaseIcon';

export default class RatioIcon extends BaseIcon {
  render() {
    return (
      <svg className={`icon icon--ratio ${this.props.className}`}
        xmlns={this.getXmlns()} viewBox={this.getViewBox()}>
        <path d="M60,4.85L55.14,0l-7,6.94a29.17,29.17,0,0,0-5.24-3.3l-3,6.16a22.39,22.39,0,0,1,3.37,2L12,43c-0.31-.43-0.62-0.86-0.9-1.31L5.27,45.35a29.07,29.07,0,0,0,1.81,2.55l-7,6.93L5,59.68l7-6.94a29.32,29.32,0,0,0,38.81-2.28A29.08,29.08,0,0,0,53,11.78ZM45.89,45.61a22.39,22.39,0,0,1-29,2.22L48.12,16.69A22.2,22.2,0,0,1,45.89,45.61ZM32.7,7.68L33.5,0.87a29.72,29.72,0,0,0-6.57,0l0.73,6.81A22.35,22.35,0,0,1,32.7,7.68Zm-12.26,2-3-6.19A29.23,29.23,0,0,0,11.9,7l4.27,5.37A22.31,22.31,0,0,1,20.44,9.69ZM8.23,34.78a22.48,22.48,0,0,1-.55-5l-6.88,0a29.31,29.31,0,0,0,.72,6.45Zm2.91-16.87L5.33,14.24a29,29,0,0,0-2.87,5.89l6.49,2.28A22.15,22.15,0,0,1,11.14,17.91Z"/>
      </svg>
    );
  }
}
