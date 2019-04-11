import * as React from 'react';

import { SideLink, Actions } from '@twilio/flex-ui';

export default class RTRSideNavButton extends React.Component{

    render() {
        return <SideLink
            {...this.props}
            icon='Bulb'
            iconActive='BulbBold'
            isActive={this.props.activeView === 'realtime'}
            onClick={() => Actions.invokeAction('NavigateToView', {viewName: 'realtime'})}>Realtime</SideLink>
            ;
    }
}