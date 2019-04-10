import * as React from 'react';
import { css } from 'react-emotion';
import Grid from '@material-ui/core/Grid';
import SyncClient from 'twilio-sync';
import Metric from './components/dashboard/metric';
import RTRQueues from './components/RTRQueues';

const rtrContainer = css `
  padding: 20px;
  flex-grow: 1;
`

export default class RTRView extends React.Component{
    constructor(props) {
      super(props);
      this.calculateChannelCapacity = this.calculateChannelCapacity.bind(this);
      this.calculateChannelCapacityPercentage = this.calculateChannelCapacityPercentage.bind(this);
      this.syncClient = new SyncClient(this.props.token);
      this.state = {
        workspaceCapacity: {
          default: 0,
          voice: 0,
          chat: 0,
          sms: 0,
          video: 0,
          custom1: 0,
          custom2: 0,
          custom3: 0,
          custom4: 0,
          custom5: 0
        },
        workspaceActiveTaskCount: {
          default: 0,
          voice: 0,
          chat: 0,
          sms: 0,
          video: 0,
          custom1: 0,
          custom2: 0,
          custom3: 0,
          custom4: 0,
          custom5: 0
        },
        DailyDashboard: {
          AgentMessageCount: 0,
          AgentTotalResponseTime: 0,
          AverageAgentResponseTime: 0.0,
          SlaPercentage:0.0,
          CurrentWrapUps: 0,
          AverageWrapUpTime: 0
        }

      }
    }

    componentDidMount() {
      this.syncClient.document('workspaceCapacity').then((doc) => {
        if (Object.entries(doc.value).length === 0 && doc.value.constructor === Object) {
          return false;
        }
        this.setState({
          workspaceCapacity: doc.value
        });
        doc.on("updated", (data) => {
          this.setState({
            workspaceCapacity: data.value
          })
        })
      })

      this.syncClient.document('workspaceActiveTaskCount').then((doc) => {
        if (Object.entries(doc.value).length === 0 && doc.value.constructor === Object) {
          return false;
        }
        this.setState({
          workspaceActiveTaskCount: doc.value
        });
        doc.on("updated", (data) => {
          this.setState({
            workspaceActiveTaskCount: data.value
          })
        })
      })

      this.syncClient.document('DailyDashboard').then((doc) => {
        if (Object.entries(doc.value).length === 0 && doc.value.constructor === Object) {
          return false;
        }
        this.setState({
          DailyDashboard: doc.value
        });
        doc.on("updated", (data) => {
          this.setState({
            DailyDashboard: data.value
          })
        })
      })

    }

    calculateChannelCapacity(channelName) {
      return {
        percentage: this.calculateChannelCapacityPercentage(channelName),
        available: this.state.workspaceCapacity[channelName] - this.state.workspaceActiveTaskCount[channelName]
      }
    }

    calculateChannelCapacityPercentage(channelName) {
      let percentage = this.state.workspaceActiveTaskCount[channelName] === 0 ? 0 : Math.round((this.state.workspaceActiveTaskCount[channelName] / this.state.workspaceCapacity[channelName]) * 100);
      if (this.state.workspaceCapacity[channelName] === 0) {
        percentage = 100;
      }
      return percentage;
    }

    render() {
      return (
          <div className={rtrContainer}>
            <Grid container spacing={16}>
              <Grid item xs={4} md={4}>
                <Metric title="Voice Utilization" primary={ this.calculateChannelCapacity('voice').percentage + '%' } secondary={ this.calculateChannelCapacity('voice').available + ' Available' } max="80" min="0" />
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Chat Utilization" primary={ this.calculateChannelCapacity('chat').percentage + '%' } secondary={ this.calculateChannelCapacity('chat').available + ' Available' } max="80" min="0" />
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="SMS Utilization" primary={ this.calculateChannelCapacity('sms').percentage + '%' } secondary={ this.calculateChannelCapacity('sms').available + ' Available' } max="80" min="0"/>
              </Grid>
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={4} md={4}>
                <Metric title="Voice Service Level" primary={this.state.DailyDashboard.SlaVoicePercentage + '%' } secondary={' baseline 85%'}  max="100" min="85"/>
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Chat Service Level" primary={this.state.DailyDashboard.SlaChatPercentage + ' %' } secondary={' baseline 85%'}  max="100" min="85"/>
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Average Chat Agent Response Time" primary={Math.round(this.state.DailyDashboard.AverageAgentResponseTime, 2) } secondary={ 'seconds'}  max="30" min="0"/>
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Total Calls" primary={this.state.DailyDashboard.TotalVoiceMessages } secondary={'today'} max={this.state.DailyDashboard.TotalVoiceMessages } min="0" />
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Total Chats" primary={this.state.DailyDashboard.TotalChatMessages } secondary={'today'} max={this.state.DailyDashboard.TotalChatMessages } min="0" />
              </Grid>
              <Grid item xs={4} md={4}>
                <Metric title="Total Agents Online" primary={this.state.DailyDashboard.TotalAgentsAvailable } secondary={'today'} max={this.state.DailyDashboard.TotalAgentsAvailable } min="1" />
              </Grid>
            </Grid>
            <RTRQueues syncClient={ this.syncClient }/>

          </div>
      )
    }
}