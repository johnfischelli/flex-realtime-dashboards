import * as React from 'react';
import { css } from 'react-emotion';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const metricContainerGreen = css `
  background: ${green[500]};
  color: #fff;
  padding: 10px;
  text-align: center;
`

const metricContainerRed = css `
  background: ${red[500]};
  color: #fff;
  padding: 10px;
  text-align: center;
`

const primary = css `
  color: #fff;
  font-size: 2rem !important;
`

const secondary = css `
  color: #fff;
`

export default class Metric extends React.Component{
  render() {
    return (
      <div className={(parseInt(this.props.primary) >= this.props.min && parseInt(this.props.primary) <= this.props.max) ?  metricContainerGreen : metricContainerRed }>
        <h1>{this.props.title}</h1>
        <p className={primary}>{ this.props.primary }</p>
        <p className={secondary}>{ this.props.secondary }</p>
      </div>
    )
  }
}