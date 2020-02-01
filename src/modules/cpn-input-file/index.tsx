import React, { FC, useState, Fragment } from 'react'

import { ClassNames } from '..';

import './CpnInputFile.scss';
import CpnPopupFileManage from './components/CpnPopupFileManage';
import { CpnIcon } from '../cpn-icon';

type Props = {
    onChange: (data: string[]) => void,
    defaultValue?: string[],
    className?: string,
    maxLength?: number,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
    disabled?: boolean,
    accept?: (
        'image/jpeg' |
        'image/gif' |
        'image/png' |
        'image/svg+xml' |
        'application/msword' |
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' |
        'image/vnd.microsoft.icon' |
        'audio/mpeg' |
        'video/mpeg' |
        'application/pdf' |
        'application/vnd.ms-excel'
    )[],
}

export const CpnInputFile: FC<Props> = (props) => {
    const [files, setFiles] = useState(props.defaultValue || []);
    const [isShowPopup, setIsShowPopup] = useState(false);
    const maxLength = props.maxLength || 1;
    const isMutil = maxLength > 1;

    const removeImage = (index: number) => setFiles((state: any) => state.filter((_: any, ind: number) => index !== ind));

    return (
        <Fragment>
            <CpnPopupFileManage
                isVisible={isShowPopup}
                maxLength={maxLength - files.length}
                onSelect={data => {
                    if (isMutil) {
                        setFiles(state => state = [...state, ...data]);
                        props.onChange([...files, ...data]);
                    } else {
                        setFiles(data);
                        props.onChange(data);
                    }
                }}
                accept={props.accept || ['image/jpeg', 'image/png', 'image/svg+xml']}
                onClose={() => setIsShowPopup(false)}
            />

            <div className={ClassNames({
                CpnInputFile: true,
                empty: !files.length
            })}>
                {(() => {
                    if (maxLength === 1) return <div className="preview">
                        {(() => {
                            if (files.length === 1) return <img src={files[0]} alt="" />
                        })()}

                        <div className="filter" onClick={() => setIsShowPopup(true)}>
                            <CpnIcon.Upload />
                            Add new file
                        </div>
                    </div>

                    return <div className="listReviews">
                        {files.map((value, key) => {
                            return (
                                <div className="item" key={key}>
                                    <div className="btnRemove" onClick={() => removeImage(key)}>
                                        <CpnIcon.Remove />
                                    </div>

                                    <img src={value} alt="" />
                                </div>
                            );
                        })}

                        {files.length < maxLength ? <div className="item" onClick={() => setIsShowPopup(true)}>
                            <div className="btnAddNewImage">
                                <div className="message">
                                    <CpnIcon.Image />
                                    <p>Click to upload file.</p>
                                </div>
                            </div>
                        </div> : null}
                    </div>
                })()}
            </div>
        </Fragment>
    )
}