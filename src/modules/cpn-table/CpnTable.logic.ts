import { ObjectUtils } from "..";
import { IState, ITranslate, CpnTableProps } from "./types";
import { useState, useEffect } from "react";

export const useCpnTable = (props: CpnTableProps) => {
    const { structure, onChange } = props;
    const { cleanObj, isHasValue, getIn } = ObjectUtils;

    // ============================ Translate ============================
    let translate: ITranslate = {
        emptyData: 'Empty data.',
        loading: 'Fetching data...',
        view: 'Show',
        page: 'Page',
        results: 'Results',
        total: 'Total',
    }

    for (const key in props.translate) {
        if (props.translate.hasOwnProperty(key)) {
            const item = props.translate[key];
            // @ts-ignore
            translate[key] = item;
        }
    }

    const defaultStateData = {
        pageNumber: props.defaultPageNumber,
        params: {},
        error: null,
        itemsPerPage: getIn(props.itemsPerPageOptions, '[0]', props.itemsPerPage),
        data: [],
        count: null,
    }

    // ============================ Status ============================
    const [isInited, setisInited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isShowFilter, setIsShowFilter] = useState(false);

    // ============================ Params ============================
    const [pageNumber, setPageNumber] = useState(props.defaultPageNumber);
    const [params, setParams] = useState(defaultStateData.params) as any;
    const [error, setError] = useState(defaultStateData.error) as any;

    const [itemsPerPage, setItemsPerPage] = useState(defaultStateData.itemsPerPage);
    const [data, setData] = useState(defaultStateData.data) as any[];
    const [count, setCount] = useState(defaultStateData.count) as any;

    const isHasFilterOptions = structure.find(v => v.filter);
    const totalFilters = structure.reduce((result, item) => {
        if (!item.filter) return result;

        const { type, endKey, startKey } = item.filter;
        const key = item.filter.key || item.key;

        if (
            type === 'date-time-range'
            && endKey
            && startKey
            && params[endKey]
            && params[startKey]
        ) return result + 1;

        if (params[key]) return result + 1;

        return result;
    }, 0)

    // ============================ Functions ============================
    const getState: any = (newState: any) => {
        const state: IState = {
            pageNumber,
            params,
            itemsPerPage,
            ...newState,
        }

        return Object.assign(state, {
            pagination: {
                limit: state.itemsPerPage,
                offset: (state.pageNumber - 1) * itemsPerPage
            }
        })
    }

    // eslint-disable-next-line
    const reset = () => {
        setPageNumber(props.defaultPageNumber);
        setParams(defaultStateData.params);
        setError(defaultStateData.error);
        setItemsPerPage(defaultStateData.itemsPerPage);
        setData(defaultStateData.data);
        setCount(defaultStateData.count);
    }

    const hanldeChange = async (state: any = {}) => {
        try {
            const pageNumberNew = state.pageNumber || pageNumber;
            const paramsNew = state.params || params;
            const itemsPerPageNew = state.itemsPerPage || itemsPerPage;

            setIsLoading(true);

            setPageNumber(pageNumberNew);
            setParams(paramsNew);
            setItemsPerPage(itemsPerPageNew);

            const response = await onChange(getState({
                pageNumber: pageNumberNew,
                params: cleanObj(Object.assign(paramsNew, itemsPerPageNew)),
                itemsPerPage: itemsPerPageNew
            }))

            setData(response.data || [])
            setCount(response.count)

        } catch (error) {
            setError(error)
        }

        setIsLoading(false);
    }

    const handleChangeParams = (fieldName: string, value: any, additionParams: any) => {
        setParams((state: any) => {
            const newParams = !additionParams ? { ...state, [fieldName]: value } : { ...state, ...additionParams }
            hanldeChange({ ...getState(), params: newParams, pageNumber: 1 });
            return newParams;
        });
    }

    const initData = () => {
        // Get Params filter default
        const initFilterParams = structure.reduce((output: any, structureItem) => {
            const { filter } = structureItem;
            if (!filter || !filter.defaultValue) return output;

            const { type, startKey, endKey, defaultValue } = filter;
            const key = filter.key || structureItem.key;

            if (
                type === 'date-time-range'
                && startKey
                && endKey
                && defaultValue[startKey]
                && defaultValue[endKey]
            ) {
                output[startKey] = defaultValue[startKey]
                output[endKey] = defaultValue[endKey]
                return output;

            } else if (type === 'select-async') {
                output[key] = defaultValue.value;
                return output;
            }

            output[key] = defaultValue;
            return output;
        }, {})

        if (isHasValue(initFilterParams)) setIsShowFilter(true);

        // // Init data when first render
        hanldeChange({ params: initFilterParams });
    }

    // ============================ Effects ============================
    useEffect(() => {
        if (isInited && !props.enableReinitialize) return;
        setisInited(true);

        reset();
        initData();
        // eslint-disable-next-line
    }, [props.structure])

    const totalCols = structure.length;

    return {
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
    }
}