import * as React from 'react';
import { css } from 'react-emotion';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const table = css `
  margin-top:20px;
`

const tableHeaderCell = css `
  background: #333;
  color: #fff !important;
  text-transform: initial !important;
  letter-spacing: 0 !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
`

const tableCell = css `
  color: #333 !important;
`

export default class RTRView extends React.Component{
    constructor(props) {
      super(props);
      this.syncClient = this.props.syncClient;
      this.state = {
        stats: {}
      }
    }

    componentDidMount() {
      this.syncClient.map('taskQueueStats').then(map => {
        map.getItems().then(page => {
          page.items.forEach((mapItem) => {
            let newstate = {},
                stats = {};
            newstate[mapItem.key] = mapItem.value;
            stats = Object.assign(this.state.stats, newstate);
            this.setState({
              stats: stats
            });
          })
        })
        map.on('itemAdded', (mapItem) => {
          let newstate = {},
              stats = {};
          newstate[mapItem.item.key] = mapItem.item.value;
          stats = Object.assign(this.state.stats, newstate);
          console.log(mapItem);
          this.setState({
            stats: stats
          });
        })
        map.on('itemUpdated', (mapItem) => {
          let newstate = {},
              stats = {};
          newstate[mapItem.item.key] = mapItem.item.value;
          stats = Object.assign(this.state.stats, newstate);
          this.setState({
            stats: stats
          });
        })
      })
    }

    render() {
      if (this.state.stats.length === {}) {
        return (<p>No queue data yet...</p>);
      }

      return (
        <Table className={ table }>
          <TableHead>
            <TableRow>
              <TableCell className={tableHeaderCell}>Queue</TableCell>
              <TableCell className={tableHeaderCell}>Agents Staffed</TableCell>
              <TableCell className={tableHeaderCell}>Tasks Waiting</TableCell>
              <TableCell className={tableHeaderCell}>Longest Waiting Task Age (seconds)</TableCell>
              <TableCell className={tableHeaderCell}>Cumulative Task Volume</TableCell>
              <TableCell className={tableHeaderCell}>Abandoned Tasks</TableCell>
              <TableCell className={tableHeaderCell}>Average Aban Time</TableCell>
              <TableCell className={tableHeaderCell}>Average Speed to Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { Object.keys(this.state.stats).map(key => {
                let queue = this.state.stats[key];
                console.log(queue);
                return (
                  <TableRow key={key}>
                    <TableCell className={tableCell}>{key}</TableCell>
                    <TableCell className={tableCell}>{queue.realtime.total_available_workers}</TableCell>
                    <TableCell className={tableCell}>{queue.realtime.tasks_by_status.pending}</TableCell>
                    <TableCell className={tableCell}>{queue.realtime.longest_task_waiting_age}</TableCell>
                    <TableCell className={tableCell}>{queue.cumulative.tasks_entered}</TableCell>
                    <TableCell className={tableCell}>{queue.cumulative.tasks_canceled}</TableCell>
                    <TableCell className={tableCell}>{queue.cumulative.wait_duration_until_canceled.avg}</TableCell>
                    <TableCell className={tableCell}>{queue.cumulative.wait_duration_until_accepted.avg}</TableCell>
                  </TableRow>
                  )
              })
            }
          </TableBody>
        </Table>
      )
    }
}