import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import RTRSideNavButton from './RTRSideNavButton';
import RTRView from './RTRView';

const PLUGIN_NAME = 'RealtimeReportingPlugin';

export default class RealtimeReportingPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    flex.SideNav.Content.add(<RTRSideNavButton key='sidebarrealtimereportingbutton'/>);
    flex.ViewCollection.Content.add(<flex.View name='realtime' key='realtimeview'><RTRView token={ manager.user.token } /></flex.View>);
  }
}
