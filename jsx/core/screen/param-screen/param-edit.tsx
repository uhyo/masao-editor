import * as React from 'react';
import * as masao from '../../../../scripts/masao';

import Select from '../../util/select';
import Color from '../../util/color';

import * as editActions from '../../../../actions/edit';
import * as paramsLogic from '../../../../logics/params';
import { EditState, ParamsState, ProjectState } from '../../../../stores';

import * as styles from '../../css/param-edit.css';
import { FormField, FormControls } from '../../../components/form-controls';
import { Toolbar, Toolbox } from '../../../components/toolbar';
import { ThemeConsumer } from '../../theme/context';

export interface IPropParamEdit {
  edit: EditState;
  params: ParamsState;
  project: ProjectState;
}

export default class ParamEdit extends React.Component<IPropParamEdit, {}> {
  private mainRef = React.createRef<HTMLDivElement>();
  componentDidUpdate(prevProps: IPropParamEdit) {
    if (prevProps.edit.param_type !== this.props.edit.param_type) {
      const main = this.mainRef.current;
      if (main != null) {
        main.scrollTop = 0;
      }
    }
  }
  render() {
    const data = masao.param.data;
    const {
      params,
      project,
      edit: { param_type },
    } = this.props;
    const keys = Object.keys(data);
    const paramTypesContents = [
      {
        key: '',
        label: '全て表示',
      },
    ].concat(
      Object.keys(masao.paramTypes).map(key => {
        return {
          key,
          label: masao.paramTypes[key].name,
        };
      }),
    );
    const onParamtypeChange = (param_type: string) => {
      editActions.changeParamType({ param_type });
    };
    const typeMenu = (
      <Toolbar>
        <Toolbox label="パラメータの種類">
          <Select
            contents={paramTypesContents}
            value={param_type}
            onChange={onParamtypeChange}
          />
        </Toolbox>
      </Toolbar>
    );

    return (
      <ThemeConsumer>
        {({ fitY }) => (
          <>
            {typeMenu}
            <div
              ref={this.mainRef}
              className={`${styles.main} ${
                fitY ? styles.mainFitting : styles.mainNonFitting
              }`}
            >
              <FormControls>
                {(param_type === ''
                  ? keys
                  : masao.paramTypes[param_type].params
                ).map(key => {
                  let description: string;
                  let field;
                  let obj: masao.param.Data;
                  if (/@@@/.test(key)) {
                    //色コントロールを設置
                    let key_red = key.replace('@@@', 'red'),
                      key_green = key.replace('@@@', 'green'),
                      key_blue = key.replace('@@@', 'blue');
                    obj = data[key_red];
                    const color = {
                      red: Number(params[key_red]),
                      green: Number(params[key_green]),
                      blue: Number(params[key_blue]),
                    };
                    const onChange = ({
                      red,
                      green,
                      blue,
                    }: {
                      red: number;
                      green: number;
                      blue: number;
                    }) => {
                      paramsLogic.changeParams({
                        [key_red]: String(red),
                        [key_green]: String(green),
                        [key_blue]: String(blue),
                      });
                    };
                    field = <Color value={color} onChange={onChange} />;
                    description = obj.description.replace(/（.+）$/, '');
                  } else {
                    obj = data[key];
                    description = obj.description;
                    //versionがあれか見る
                    let version = obj.version;
                    let pv: '2.8' | 'fx' | 'kani2' =
                      project.version === 'fx16' ? 'fx' : project.version;
                    if (version && version[pv] === false) {
                      //これは表示しない
                      return null;
                    }
                    //typeに応じて
                    if (obj.type === 'enum') {
                      let enumValues = obj.enumValues;
                      if (version != null && Array.isArray(version[pv])) {
                        //選択肢の制限
                        enumValues = enumValues.filter(obj => {
                          return (
                            (version![pv] as Array<string>).indexOf(
                              obj.value,
                            ) >= 0
                          );
                        });
                      }
                      const fieldChange = (
                        e: React.SyntheticEvent<HTMLSelectElement>,
                      ) => {
                        const value = e.currentTarget.value;
                        paramsLogic.changeParam(key, value);
                      };
                      field = (
                        <select value={params[key]} onChange={fieldChange}>
                          {enumValues.map(obj => {
                            return (
                              <option key={obj.value} value={obj.value}>
                                {obj.description}
                              </option>
                            );
                          })}
                        </select>
                      );
                    } else if (obj.type === 'boolean') {
                      const checkChange = (
                        e: React.SyntheticEvent<HTMLInputElement>,
                      ) => {
                        paramsLogic.changeParam(
                          key,
                          e.currentTarget.checked ? '1' : '2',
                        );
                      };
                      field = (
                        <input
                          type="checkbox"
                          checked={params[key] === '1'}
                          onChange={checkChange}
                        />
                      );
                    } else if (obj.type === 'boolean-reversed') {
                      const checkChange = (
                        e: React.SyntheticEvent<HTMLInputElement>,
                      ) => {
                        paramsLogic.changeParam(
                          key,
                          e.currentTarget.checked ? '2' : '1',
                        );
                      };
                      field = (
                        <input
                          type="checkbox"
                          checked={params[key] === '2'}
                          onChange={checkChange}
                        />
                      );
                    } else if (obj.type === 'integer') {
                      const numChange = (
                        e: React.SyntheticEvent<HTMLInputElement>,
                      ) => {
                        paramsLogic.changeParam(key, e.currentTarget.value);
                      };
                      field = (
                        <input
                          type="number"
                          step="1"
                          min={obj.min}
                          max={obj.max}
                          value={params[key]}
                          onChange={numChange}
                        />
                      );
                    } else if (obj.type === 'string') {
                      const valChange = (
                        e: React.SyntheticEvent<HTMLInputElement>,
                      ) => {
                        paramsLogic.changeParam(key, e.currentTarget.value);
                      };
                      field = (
                        <input
                          type="text"
                          value={params[key]}
                          onChange={valChange}
                        />
                      );
                    } else {
                      return null;
                    }
                  }
                  return (
                    <FormField key={key} name={description}>
                      {field}
                    </FormField>
                  );
                })}
              </FormControls>
            </div>
          </>
        )}
      </ThemeConsumer>
    );
  }
}
