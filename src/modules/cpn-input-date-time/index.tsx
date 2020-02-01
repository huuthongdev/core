import React, { FC, useState, useEffect } from 'react'
// @ts-ignore
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';

import './CpnInputDateTime.scss';
import 'react-calendar/dist/Calendar.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { ClassNames, DateTimeUtils } from '..'

// ============================ Date Time ============================
type IDateTimeProps = {
    onChange: (time: number) => void,
    maxDetail?: string,
    isSecondTime?: boolean,
    locale?: string,
    value?: any,
    minDate?: number,
    maxDate?: number,
    className?: string,
    disabled?: boolean,
    onBlur?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    onFocus?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    defaultValue?: number,
}

export const CpnInputDateTime: FC<IDateTimeProps> = (props) => {
    const { onChange, minDate, maxDate, maxDetail, isSecondTime, locale, disabled, className } = props;
    const [value, setValue] = useState(null) as any;

    const handleChange = (date: any) => {
        let time: any;

        if (date) {
            time = new Date(date).getTime();
            if (isSecondTime) time = DateTimeUtils.timeToSeconds(date);
        }

        setValue(time);
        if (onChange) return onChange(time);
    }

    const convertTime = (time: any) => {
        if (!time) return;
        if (isSecondTime) return DateTimeUtils.secondsToTime(time);
        return new Date(time);
    }

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue, setValue])

    return <DateTimePicker
        className={`CpnInputDateTime ${className}`}
        calendarClassName="CpnInputDateTimeCalendar"
        clockClassName="CpnInputDateTimeClock"
        maxDetail={maxDetail}
        disableClock={true}
        onChange={handleChange}
        minDate={convertTime(minDate)}
        maxDate={convertTime(maxDate)}
        value={convertTime(value)}
        locale={locale}
        disabled={disabled}

        onCalendarClose={() => {
            if (props.onFocus) props.onFocus();
        }}
        
        onCalendarOpen={() => {
            if (props.onBlur) props.onBlur();
        }}

        onBlur={(e: any) => {
            if (props.onBlur) props.onBlur(e);
        }}

        onFocus={(e: any) => {
            if (props.onFocus) props.onFocus(e);
        }}
    />
}

CpnInputDateTime.defaultProps = {
    isSecondTime: true,
    locale: 'en-GB',
}


// ============================ Date Time Range ============================
interface ITimeRangeValue {
    startTime: number,
    endTime: number,
}

interface IDateTimeRangeProps {
    maxDetail?: string,
    isSecondTime?: boolean,
    locale?: string,
    value?: any,
    minDate?: number,
    maxDate?: number,
    className?: string,
    disabled?: boolean,

    startTimeDefaultValue?: number,
    endTimeDefaultValue?: number,
    onChange: (value: ITimeRangeValue | null) => any,
}

export const CpnInputDateTimeRange: FC<IDateTimeRangeProps> = (props) => {
    const { onChange, minDate, maxDate, isSecondTime, className } = props;
    const [startTime, setStartTime] = useState(props.startTimeDefaultValue);
    const [endTime, setEndTime] = useState(props.endTimeDefaultValue);

    // ============================ Functions ============================
    const handleChangeRange = (type: 'startTime' | 'endTime', date: any) => {
        if (type === 'startTime') {
            if (endTime && date) onChange({ startTime: date, endTime })
            if (!endTime && !date) onChange(null);
            setStartTime(date);
        }

        if (type === 'endTime') {
            if (startTime && date) onChange({ startTime, endTime: date })
            if (!endTime && !date) onChange(null);
            setEndTime(date)
        }
    }

    return <div className={ClassNames({
        CpnInputDateTimeRange: true,
        [className as string]: !!className,
        disabled: props.disabled,
    })}>
        <CpnInputDateTime
            value={startTime}
            isSecondTime={isSecondTime}
            minDate={isSecondTime && minDate ? minDate * 1000 : minDate}
            onChange={(date: any) => handleChangeRange('startTime', date)}
        />
        <CpnInputDateTime
            value={endTime}
            isSecondTime={isSecondTime}
            onChange={(date: any) => handleChangeRange('endTime', date)}
            minDate={startTime}
            maxDate={isSecondTime && maxDate ? maxDate * 1000 : maxDate}
        />
    </div>
}