import React, { FC, useCallback, useRef, useState, BaseSyntheticEvent } from 'react'
import { ClassNames, ObjectUtils } from '../..';

type Props = {
    autoComplete?: string,
    onChange: (value: any) => void,
    onChangeDelay?: number,
    defaultValue?: string,
    value?: string,
    placeholder?: string,
    onBlur?: Function,
    id?: any,
    onKeyDown?: ((event: React.KeyboardEvent<HTMLInputElement>) => void) | undefined,
}

const CpnSearchInput: FC<Props> = ({ autoComplete, onChange, onChangeDelay, defaultValue, value, placeholder, onBlur, id, onKeyDown }) => {
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [isFocus, setIsFocus] = useState(false);
    const inputRef: any = useRef(null);
    let delayCheckTyping: any = null;

    // Functions
    const handleChange = (e: BaseSyntheticEvent) => {
        clearTimeout(delayCheckTyping);
        const temp = e.target.value;
        delayCheckTyping = setTimeout(() => {
            if (inputRef.current.value === temp) {
                onChange(temp);
                forceUpdate();
            }
        }, onChangeDelay);
    }

    const handleClear = () => {
        inputRef.current.value = '';
        onChange('');
        forceUpdate();
    }

    return <div className={ClassNames({
        "CpnSearchInput": true,
        isFocus,
        isShowIcon: true,
        isHasValue: !!ObjectUtils.getIn(inputRef, 'current.value'),
    })}>
        <div className="iconSearch">
            <svg viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="User" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <path d="M48.3877915,45.5420777 L36.2752093,33.1653969 C39.389567,29.5281396 41.0959419,24.9517256 41.0959419,20.1874803 C41.0959419,9.05627918 31.8779435,0 20.547971,0 C9.21799846,0 0,9.05627918 0,20.1874803 C0,31.3186813 9.21799846,40.3749605 20.547971,40.3749605 C24.801401,40.3749605 28.8547116,39.1145596 32.3201716,36.7219043 L44.5247729,49.1925008 C45.0348986,49.7129867 45.7210222,50 46.4562822,50 C47.152233,50 47.8124483,49.7393182 48.3136401,49.2653513 C49.378561,48.2586104 49.4125098,46.5891936 48.3877915,45.5420777 Z M20.547971,5.2662992 C28.9226092,5.2662992 35.7356017,11.9597655 35.7356017,20.1874803 C35.7356017,28.415195 28.9226092,35.1086613 20.547971,35.1086613 C12.1733327,35.1086613 5.36034025,28.415195 5.36034025,20.1874803 C5.36034025,11.9597655 12.1733327,5.2662992 20.547971,5.2662992 Z" id="Shape" fill="#3D5059" fillRule="nonzero" />
                </g>
            </svg>
        </div>

        <input
            autoComplete={autoComplete}
            id={id}
            type="text"
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            onChange={handleChange}
            ref={inputRef}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
                setIsFocus(false)
                if (onBlur) onBlur();
            }}
            onKeyDown={onKeyDown}
        />

        {inputRef && inputRef.current && inputRef.current.value ? <div className="btnClear" onClick={handleClear}>
            <svg viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="User" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <path d="M32.7182292,24.984375 L49.6625,8.03958333 C50.0692708,7.6328125 50.0692708,6.9734375 49.6625,6.56666667 L43.4026042,0.305208333 C43.2072917,0.109895833 42.9416667,0 42.6661458,0 C42.3901042,0 42.125,0.109895833 41.9296875,0.305208333 L24.984375,17.2505208 L8.0390625,0.305208333 C7.6484375,-0.0854166667 6.95677083,-0.0854166667 6.56614583,0.305208333 L0.305729167,6.56666667 C-0.101041667,6.9734375 -0.101041667,7.6328125 0.305729167,8.03958333 L17.2505208,24.984375 L0.305729167,41.9291667 C-0.101041667,42.3359375 -0.101041667,42.9953125 0.305729167,43.4020833 L6.56614583,49.6630208 C6.76145833,49.8583333 7.0265625,49.9682292 7.30260417,49.9682292 C7.57864583,49.9682292 7.84375,49.8583333 8.0390625,49.6630208 L24.984375,32.7177083 L41.9296875,49.6630208 C42.125,49.8583333 42.3901042,49.9682292 42.6661458,49.9682292 C42.9416667,49.9682292 43.2072917,49.8583333 43.4026042,49.6630208 L49.6630208,43.4020833 C50.0697917,42.9953125 50.0697917,42.3354167 49.6630208,41.9291667 L32.7182292,24.984375 Z" id="Path" fill="#3D5059" fillRule="nonzero" />
                </g>
            </svg>
        </div> : null}
    </div>
}

CpnSearchInput.defaultProps = {
    placeholder: 'Nhập...',
    onChangeDelay: 500,
    defaultValue: '',
    onChange: () => false,
    onBlur: () => false,
}

export default CpnSearchInput