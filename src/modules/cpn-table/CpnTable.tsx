import React, { FC } from 'react'

import './CpnTable.scss';
import { CpnToggleSwitch, ClassNames, ObjectUtils } from '..';

import CpnPagination from './components/CpnPagination';
import CpnFilter from './components/CpnFilter';
import CpnSearch from './components/CpnSearch';
import CpnMessage from './components/CpnMessage';
import { CpnIcon } from '../cpn-icon';

import { CpnTableProps } from './types';
import { useCpnTable } from './CpnTable.logic';

export const CpnTable: FC<CpnTableProps> = (props) => {
    const {
        data,
        count,
        translate,
        isShowFilter,
        hanldeChange,
        isHasFilterOptions,
        setIsShowFilter,
        totalFilters,
        totalCols,
        isLoading,
        params,
        handleChangeParams,
        error,
        pageNumber,
        itemsPerPage,
        structure,
    } = useCpnTable(props);

    const RowMeta = (props: any) => {
        const { children, isVisible, isEmptyRow } = props;
        if (isVisible === false) return null;
        return <tr className={ClassNames({
            "CpnTable__RowMeta": true,
            "CpnTable__EmptyRow": isEmptyRow,
        })}>
            <td colSpan={totalCols}>
                {children}
            </td>
        </tr>
    }

    return (
        <div className="CpnTable">
            <div className="CpnTable__Head">
                <div className="totalResults">
                    {data.length || '--'}/{count || '--'} {translate.results}
                </div>

                <div className="CpnTable__Toolbar">
                    <CpnSearch search={props.search} isVisible />

                    <div className="buttons">
                        {isHasFilterOptions ? <div
                            className={ClassNames({
                                item: true,
                                filter: true,
                                active: isShowFilter,
                            })}
                            onClick={() => setIsShowFilter((state: boolean) => !state)}
                        >
                            {totalFilters ? <div className="qty">{totalFilters}</div> : null}
                            <svg viewBox="0 0 51 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="User" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <path d="M48.0934143,0 L2.00195312,0 C0.923156738,0 0.048828125,0.874328613 0.048828125,1.953125 C0.048828125,7.39212031 2.38037109,12.5846863 6.44569395,16.198349 L14.9993896,23.8010406 C16.4825439,25.1194 17.3332215,27.0137787 17.3332215,28.9985656 L17.3332215,48.0445861 C17.3332215,49.6009826 19.0727234,50.5340576 20.369339,49.6692657 L31.892395,41.9876099 C32.4356079,41.6252137 32.762146,41.015625 32.762146,40.3625488 L32.762146,28.9985656 C32.762146,27.0137787 33.6128234,25.1194 35.0959777,23.8010406 L43.649292,16.198349 C47.7146148,12.5846863 50.0461578,7.39212031 50.0461578,1.953125 C50.0461578,0.874328613 49.1718292,0 48.0934143,0 Z M41.0541534,13.2785797 L32.5008393,20.8816528 C30.1845551,22.9408264 28.855896,25.8991241 28.855896,28.9981842 L28.855896,39.3173218 L21.2390899,44.3950653 L21.2390899,28.9985656 C21.2390899,25.8991241 19.9104309,22.9408264 17.5941467,20.8816528 L9.04083252,13.2789611 C6.29959102,10.8417511 4.54978945,7.50236514 4.08134463,3.90586855 L46.0136414,3.90586855 C45.5451965,7.50236514 43.7957764,10.8417511 41.0541534,13.2785797 Z" id="Shape" fill="#3D5059" fillRule="nonzero" />
                                </g>
                            </svg>
                        </div> : null}
                    </div>
                </div>
            </div>



            <div className="CpnTable__Content">
                {isLoading ? <div className="CpnTableLoadingData">
                    <CpnIcon.Loading />
                    <p>{translate.loading}</p>
                </div> : null}

                <table>
                    <thead>
                        <tr>
                            {structure.map((item, key) => <th key={key}>
                                {item.label}
                            </th>)}
                        </tr>

                        <CpnFilter
                            isVisible={isShowFilter}
                            structure={structure}
                            params={params}
                            handleChangeParams={handleChangeParams}
                        />
                    </thead>

                    <tbody>
                        <RowMeta isVisible={!!error}>
                            <CpnMessage message={ObjectUtils.getIn(error, 'message')} />
                        </RowMeta>

                        <RowMeta isVisible={!isLoading && data && data.length === 0 && !!!error}>
                            <CpnMessage message={translate.emptyData} />
                        </RowMeta>

                        {data.map((dataItem: any, dataItemKey: number) => {
                            return (
                                <tr key={dataItemKey}>
                                    {structure.map(({ key, render, renderFull, toggleSwitch }, i) => {
                                        return <td key={i}>
                                            {(() => {
                                                if (render) return render(ObjectUtils.getIn(dataItem, key));
                                                if (renderFull) return renderFull(dataItem);
                                                if (toggleSwitch) return <CpnToggleSwitch
                                                    value={!!ObjectUtils.getIn(dataItem, key)}
                                                    onChange={() => toggleSwitch(dataItem)}
                                                />
                                                return ObjectUtils.getIn(dataItem, key)
                                            })()}
                                        </td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <CpnPagination
                translate={translate}
                totalItemCurrentPage={data.length}
                pageNumber={pageNumber}
                count={count}

                itemsPerPage={itemsPerPage}
                itemsPerPageOptions={props.itemsPerPageOptions}
                handleChangeItemsPerPage={(newItemsPerPage: number) => hanldeChange({ itemsPerPage: newItemsPerPage, pageNumber: 1 })}

                onChange={(state: any) => hanldeChange(state)}
            />
        </div>
    )
}

CpnTable.defaultProps = {
    defaultPageNumber: 1,
    itemsPerPageOptions: [10, 20, 30, 40, 50],
    itemsPerPage: 10,
    translate: {}
}