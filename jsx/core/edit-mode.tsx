import * as React from 'react';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';
import { ParamsState } from '../../stores/params';
import { HistoryState } from '../../stores/history';

import * as historyLogics from '../../logics/history';

import Button from './util/button';
import Select from './util/select';
import Switch from './util/switch';

import * as indexStyle from './css/index.css';
import * as style from './css/edit-mode.css';

export interface IPropEditMode {
  edit: EditState;
  params: ParamsState;
  history: HistoryState;
}
/**
 * Tools for editing.
 */
export default class EditMode extends React.Component<IPropEditMode, {}> {
  render() {
    const { edit, params, history } = this.props;
    const contents = [
      {
        key: 'pen',
        label: 'ペンモード',
      },
      {
        key: 'eraser',
        label: 'イレイサーモード',
      },
      {
        key: 'hand',
        label: 'ハンドモード',
      },
      {
        key: 'spuit',
        label: 'スポイト',
      },
      {
        key: 'rect',
        label: '矩形',
      },
      {
        key: 'fill',
        label: '塗りつぶし',
      },
    ];
    const contents2 = [];
    const stage_number = Number(params['stage_max']);
    for (let i = 1; i <= stage_number; i++) {
      contents2.push({
        key: String(i),
        label: `ステージ${i}`,
      });
    }
    const mode_change = (key: editActions.Mode) => {
      editActions.changeMode({
        mode: key,
      });
    };
    const stage_change = (key: string) => {
      editActions.changeStage({
        stage: Number(key),
      });
    };

    let renderSwitch;
    if (this.props.edit.screen === 'layer') {
      const onChange = (key: boolean) => {
        editActions.changeRenderMode({
          render_map: key,
        });
      };
      renderSwitch = (
        <Switch
          label="マップも表示"
          value={edit.render_map}
          onChange={onChange}
        />
      );
    } else {
      const onChange = (key: boolean) => {
        editActions.changeRenderMode({
          render_layer: key,
        });
      };
      renderSwitch = (
        <Switch
          label="背景レイヤーも表示"
          value={edit.render_layer}
          onChange={onChange}
        />
      );
    }
    const grid_change = (grid: boolean) => {
      editActions.changeGrid({
        grid,
      });
    };

    // history関連のボタン
    const stage = edit.stage - 1;
    const back_disabled = history.data[stage].prev.length === 0;
    const forward_disabled = history.data[stage].future.length === 0;

    const back = () => {
      historyLogics.back(edit.stage);
    };
    const forward = () => {
      historyLogics.forward(edit.stage);
    };

    return (
      <div className={style.wrapper}>
        <Toolbox label="編集モード">
          <Select
            contents={contents}
            value={edit.mode}
            onChange={mode_change}
          />
        </Toolbox>
        <Toolbox label="表示オプション">
          <div>
            <Switch
              label="グリッドを表示"
              value={edit.grid}
              onChange={grid_change}
            />
          </div>
          <div>{renderSwitch}</div>
        </Toolbox>
        <Toolbox label="ステージ選択">
          <Select
            contents={contents2}
            value={String(edit.stage)}
            onChange={stage_change}
          />
        </Toolbox>
        <Toolbox label="編集履歴">
          <Button label="戻る" disabled={back_disabled} onClick={back} />
          <Button label="進む" disabled={forward_disabled} onClick={forward} />
        </Toolbox>
      </div>
    );
  }
}

interface IPropToolbox {
  label: string;
  children: React.ReactNode;
}
/**
 * One tool box.
 */
function Toolbox({ label, children }: IPropToolbox) {
  return (
    <div>
      <div className={indexStyle.toolboxLabel}>{label}</div>
      <div className={style.row}>{children}</div>
    </div>
  );
}
