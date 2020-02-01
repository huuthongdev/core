import { ICpnInputSelectOption } from "../types";
import { ReactElement } from "react";
import { OptionsType, OptionTypeBase } from "react-select";

export interface IError {
    message: string,
    status: number,
}

export interface IButtonCreate {
    label?: string,
    onClick: () => void,
}

export interface IReponse {
    count?: number,
    data?: any[],
    error?: IError,
}

export interface IPagination {
    offset: number,
    limit: number,
}

export interface IState {
    pageNumber: number,
    params: object,
    itemsPerPage: number,
    pagination: IPagination,
}

export interface IFilter {
    type: 'text' | 'textarea' | 'select' | 'select-async' | 'date-time' | 'date-time-range' | 'currency',
    key?: string,
    defaultValue?: any,
    options?: ICpnInputSelectOption[],
    loadOptions?: (inputValue: string, callback: (options: OptionsType<OptionTypeBase>) => void) => void | Promise<any>,
    startKey?: string,
    endKey?: string,
    placeholder?: string,
}

export interface ISort {
    key?: string,
    increase: any,
    descrease: any,
}

export interface IStructure {
    label: string,
    key: string,
    render?: (keyValue: any) => ReactElement | string,
    renderFull?: (value: any) => ReactElement | string,
    filter?: IFilter,
    sort?: ISort[],
    toggleSwitch?: (currentValue: boolean) => Promise<boolean> | boolean
}

export interface ISearch {
    placeHolder?: string,
    loadOptions: (textSearch: string) => Promise<ICpnInputSelectOption[]> | ICpnInputSelectOption[],
    onSelect: (value: any) => void,
}

export interface ITranslate {
    emptyData?: string,
    loading?: string,
    view?: string,
    page?: string,
    results?: string,
    total?: string,
}

export type CpnTableProps = {
    structure: IStructure[],
    onChange: (state: IState) => Promise<IReponse>,
    defaultPageNumber?: number,
    itemsPerPageOptions?: number[],
    search?: ISearch,
    itemsPerPage?: number,
    translate?: any,
    enableReinitialize?: boolean,
}