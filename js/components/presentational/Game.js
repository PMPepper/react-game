import React from 'react';
import PropTypes from 'prop-types';


//Containers
import Text from '../containers/Text';
import SystemRenderer from '../containers/SystemRenderer';
import ContextMenu from '../containers/ContextMenu';
import Window from '../containers/Window';
import WindowingManager from '../containers/WindowingManager';

import ReduxWindowingManager from '../containers/ReduxWindowingManager';

import GameToolbar from '../containers/GameToolbar';

//Presentational


export default function Game({systemBodies, factionSystemBodies, element, setElement, contextMenu, setContextMenu}) {
  const width = element ? element.clientWidth :  500;
  const height = element ? element.clientHeight :  500;

  return <div
    className="app"
    ref={setElement}
  >
    <GameToolbar />
    <SystemRenderer
      systemId="1"
      systemBodies={systemBodies}
      factionSystemBodies={factionSystemBodies}
      zoom={1/1000000000}
      x={0}
      y={0}
      width={width}
      height={height-50}
      elementProps={{
        onContextMenu: (e) => {e.preventDefault()}
      }}
      onSystemBodiesClicked={setContextMenu}
    />
    {contextMenu && <ContextMenu
      items={contextMenu.items}
      boundsX={0}
      boundsY={0}
      boundsWidth={width}
      boundsHeight={height}
      positionX={contextMenu.x}
      positionY={contextMenu.y}
      //positionWidth={0}
      //positionHeight={0}
      doRequestClose={() => {
        setContextMenu(null, null);
      }}
    />}

    <ReduxWindowingManager
      reducerName="ui.gameWM"
      boundsX={0}
      boundsY={0}
      boundsWidth={width}
      boundsHeight={height}
    >
      <div key="ui.colonyManagement.window" windowProps={{title: '[colony management]'}} style={{background: '#FF99FF'}}>Hello world colony management</div>
      <div key="ui.systemOverview.window" windowProps={{title: '[systemOverview]'}} style={{background: '#FFFF99'}}>Hello world system overview</div>
    </ReduxWindowingManager>
    {/*<WindowingManager
      boundsX={0}
      boundsY={0}
      boundsWidth={width}
      boundsHeight={height}
    >
      <Window title={'Hello world'} positionX={100} positionY={10}>
        This is a panel
      </Window>
      <Window title={'Hello again world'} positionX={200} positionY={70}>
        This is another panel
      </Window>
      <Window title={'Hello again world panel'} positionX={300} positionY={300}>
        This is just a panel
      </Window>
    </WindowingManager>*/}
    {/*>*/}
  </div>
}
