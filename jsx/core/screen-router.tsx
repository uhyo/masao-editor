import { Images } from '../../defs/images';
import {
  EditState,
  CustomPartsState,
  ParamsState,
  MapState,
  ProjectState,
  HistoryState,
} from '../../stores';
import * as React from 'react';
import { MapScreen } from './screen/map-screen';
import { ParamScreen } from './screen/param-screen';
import { ProjectScreen } from './screen/project-screen';
import { JsScreen } from './screen/js-screen';

export interface IPropScreenRouter {
  /**
   * Images used in the screens.
   */
  images: Images;

  edit: EditState;
  customParts: CustomPartsState;
  params: ParamsState;
  map: MapState;
  project: ProjectState;
  history: HistoryState;

  /**
   * Whether the editor should fit the y-axis of container.
   */
  'fit-y': boolean;
  /**
   * Whether keyboard is disabled.
   */
  keyDisabled: boolean;
  /**
   * Whether show a warning when editing a JS.
   */
  jsWarning: boolean;
}

export function ScreenRouter({
  images,
  edit,
  customParts,
  params,
  map,
  project,
  history,
  'fit-y': fity,
  keyDisabled,
  jsWarning,
}: IPropScreenRouter) {
  if (edit.screen === 'map' || edit.screen === 'layer') {
    return (
      <MapScreen
        images={images}
        map={map}
        params={params}
        edit={edit}
        customParts={customParts}
        project={project}
        history={history}
        fit-y={fity}
        keyDisabled={keyDisabled}
      />
    );
  } else if (edit.screen === 'params') {
    return <ParamScreen params={params} edit={edit} project={project} />;
  } else if (edit.screen === 'project') {
    return <ProjectScreen project={project} map={map} edit={edit} />;
  } else if (edit.screen === 'js') {
    return <JsScreen jsWarning={jsWarning} edit={edit} project={project} />;
  } else {
    return null;
  }
}
