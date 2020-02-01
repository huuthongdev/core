import React, { FC } from 'react'
import { IStructure } from '../types'
import { CpnInputSelect, CpnInputSelectAsync, CpnInputDateTime, CpnInputDateTimeRange, CpnInputText } from '../..'

type Props = {
    structure: IStructure[],
    params: any,
    handleChangeParams: Function,
    isVisible?: boolean,
}

const CpnFilter: FC<Props> = ({ structure, handleChangeParams, params, isVisible }) => {
    if (!isVisible) return null
    return (
        <tr className="CpnTable__CpnFilter">
            {structure.map((colStructure, colStructureKey) => {
                const colFilterConfigs = colStructure.filter;
                if (!colFilterConfigs) return <td key={colStructureKey} />

                const { type, startKey, endKey, placeholder, options, loadOptions } = colFilterConfigs;
                const key = colFilterConfigs.key || colStructure.key;

                return <td key={colStructureKey}>
                    <div className="CpnInput">
                        <div className="Input">
                            {(() => {
                                if (type === 'select' && Array.isArray(options)) {
                                    return <CpnInputSelect
                                        options={options}
                                        defaultValue={params[key]}
                                        onChange={(value) => {
                                            handleChangeParams(key, value)
                                        }}
                                        label={placeholder || 'Chọn'}
                                    />
                                }

                                if (type === 'select-async' && loadOptions && typeof loadOptions === 'function') {
                                    return <CpnInputSelectAsync
                                        defaultValue={params[key] ? { label: params[key], value: params[key] } : null}
                                        loadOptions={loadOptions}
                                        onChange={(value) => {
                                            handleChangeParams(key, value)
                                        }}
                                    />
                                }

                                if (type === 'date-time') {
                                    return <CpnInputDateTime
                                        defaultValue={params[key]}
                                        onChange={(value) => {
                                            handleChangeParams(key, value)
                                        }}
                                    />
                                }

                                if (type === 'date-time-range' && startKey && endKey) {
                                    return <CpnInputDateTimeRange
                                        startTimeDefaultValue={params[startKey]}
                                        endTimeDefaultValue={params[endKey]}
                                        onChange={(value) => {
                                            let data: any = {};
                                            if (value) {
                                                data[startKey] = value.startTime;
                                                data[endKey] = value.endTime;
                                            } else {
                                                data[startKey] = '';
                                                data[endKey] = '';
                                            }
                                            handleChangeParams(null, null, data)
                                        }}
                                    />
                                }

                                if (type === 'text') {
                                    return <CpnInputText
                                        defaultValue={params[key]}
                                        onChange={(value) => {
                                            handleChangeParams(key, value)
                                        }}
                                        onChangeDelay={500}
                                        label={placeholder || 'Nhập'}
                                    />
                                }
                            })()}
                        </div>
                    </div>
                </td>
            })}
        </tr>
    )
}

export default CpnFilter