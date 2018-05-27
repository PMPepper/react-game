import React from 'react';
import PropTypes from 'prop-types';


//Containers
import Text from '../containers/Text';
import SystemRenderer from '../containers/SystemRenderer';
import ContextMenu from '../containers/ContextMenu';
import Panel from '../containers/Panel';

//Presentational


export default function Game({systemBodies, factionSystemBodies, element, setElement, contextMenu, setContextMenu}) {
  const width = element ? element.clientWidth :  500;
  const height = element ? element.clientHeight :  500;

  return <div
    className="app"
    ref={setElement}
  >
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
      positionWidth={0}
      positionHeight={0}
      doRequestClose={() => {
        setContextMenu(null, null);
      }}
    />}
    {/*<div style={{position: 'fixed', left: '20px', top: '20px'}}>
      <Panel title={'Hello world'}>
        This is a panel
      </Panel>
    </div>*/}
  </div>
}
