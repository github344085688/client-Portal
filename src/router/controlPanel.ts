import DefaultMainLayout from '@components/layout/default-main-layout';
import EditControlPanel from '@modules/control-panel/edit-control-panel/editControlPanel';
import ControlPanel from '@modules/control-panel/control-panel/controlPanel';
import Relationship from '@modules/control-panel/relationship/list/relationship';
import RelationDetail from '@modules/control-panel/relationship/detail/relationDetail';

export const controlPanelRoutes = [{
    path: '/control-panel',
    name: 'ControlPanel',
    component: DefaultMainLayout,
    children: [
      {
        path: 'view',
        name: 'ControlPanel',
        component: ControlPanel,
        meta: {
          rootDirectory: true,
          permissions: 'controlPanel::controlPanel_read'
        }
      },
      {
        path: 'edit',
        name: 'EditControlPanel',
        component: EditControlPanel,
        meta: {
          permissions: 'controlPanel::controlPanel_read'
        }
      },
      {
        path: 'relationship',
        name: 'Relationship',
        component: Relationship,
        meta: {
          permissions: 'controlPanel::panelRelationship_read'
        }
      },
      {
        path: 'relationDetail/:panel',
        name: 'RelationDetail',
        component: RelationDetail,
        meta: {
          permissions: 'controlPanel::panelRelationship_read'
        }
      }
    ]
  }];