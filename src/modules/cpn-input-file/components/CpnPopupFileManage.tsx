import React, { FC, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone';

import { ModuleConfigs, ClassNames } from '../..';
import { CpnIcon } from '../../cpn-icon';

import './CpnPopupFileManage.scss';

interface ICollectionItem {
    tab: string,
    data: string[],
}

type Props = {
    onSelect: (fileURLs: string[]) => void,
    onClose: () => void,
    maxLength: number,

    collection?: ICollectionItem[];
    maxLengthRecentUpload?: number,
    recentUploadStoreKey?: string,
    maxFileSizeUpload?: number,
    accept?: string[],
    isVisible?: boolean,

    isCropImage?: boolean,
}

interface IImage {
    file: File,
    src: string,
}

const CpnPopupFileManage: FC<Props> = (props) => {
    const onError = (message: string) => ModuleConfigs.onError ? ModuleConfigs.onError(message, 'CpnPopupFileManage') : null;
    const maxFileSizeUpload = props.maxFileSizeUpload || 10;
    const isMultiple = props.maxLength > 1;

    // ============================ State ============================
    const [tabActive, setTabActive] = useState('upload');
    const [images, setImages] = useState([] as IImage[]);

    const [isShowCropImage, setIsShowCropImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ============================ Recent Upload Store ============================
    const recentUploadStoreKey = props.recentUploadStoreKey || 'recent_uploaded';
    const maxLengthRecentUpload = props.maxLengthRecentUpload || 10;
    const getRecentUploadStore = (): string[] => {
        try {
            let store = localStorage.getItem(recentUploadStoreKey) || '[]';
            store = JSON.parse(store);
            return store as any;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const recentUploadStore = getRecentUploadStore();

    const saveRecentUploadStore = (imageURL: string) => {
        let store: any = getRecentUploadStore();

        if (store.length >= maxLengthRecentUpload) {
            store[0] = imageURL;
        } else {
            store = [imageURL, ...store];
        }

        localStorage.setItem(recentUploadStoreKey, JSON.stringify(store));
    }

    // ============================ Functions ============================
    const removeImage = (index: number) => setImages((state: any) => state.filter((_: any, ind: number) => index !== ind));

    const hanldeUploadImage = async () => {
        if (!ModuleConfigs.onUploadFile || images.length === 0) return;

        const files = images.map(v => v.file);

        setIsLoading(true);
        let output: any[] = [];

        try {
            output = await Promise.all(files.map(file => ModuleConfigs.onUploadFile(file)))
        } catch (error) {
            onError(error.message);
        }

        output.map(v => {
            saveRecentUploadStore(v);
            return v;
        })

        setImages([]);
        setIsLoading(false);
        props.onSelect(output);
        props.onClose();
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        let currentImagesLength = 0;
        setImages(state => {
            currentImagesLength = state.length;
            return state;
        })

        if (acceptedFiles.length === 0) return onError('Invalid file.');
        if (acceptedFiles.length > (props.maxLength - currentImagesLength) && props.maxLength > 1) return onError(`Limit images length: ${props.maxLength}`);
        if (acceptedFiles.find(file => file.size > maxFileSizeUpload * 1024 * 1024)) return onError(`Big size ${maxFileSizeUpload}MB`);

        if (!isMultiple) setImages([]);

        setImages((state: any) => [...state, ...acceptedFiles.map((v: any) => v = {
            file: v,
            src: URL.createObjectURL(v)
        })])

        if (!isMultiple && props.isCropImage) setIsShowCropImage(true);
        // eslint-disable-next-line
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        // rootRef, // Ref to the `<div>`
        // inputRef // Ref to the `<input>`
    } = useDropzone({
        multiple: props.maxLength > 1,
        onDrop,
        accept: props.accept,
    });

    const isHasImage = images.length > 0;

    if (!props.isVisible) return null

    return (
        <div className="CpnPopupFileManage">
            <div className="CpnPopupFileManage__Box">
                <div className="CpnPopupFileManage__Tab">
                    <div
                        className={ClassNames({
                            item: true,
                            active: tabActive === 'upload'
                        })}
                        onClick={() => setTabActive('upload')}
                    >
                        <CpnIcon.Upload />
                        Upload
                    </div>
                    {recentUploadStore.length > 0 ? <div
                        className={ClassNames({
                            item: true,
                            active: tabActive === 'recent_uploaded'
                        })}
                        onClick={() => setTabActive('recent_uploaded')}
                    >
                        Recent Uploaded
                    </div> : null}

                    <div className="btnClose" onClick={() => props.onClose()}>
                        <CpnIcon.Remove />
                    </div>
                </div>
                <div className="CpnPopupFileManage__Content">
                    {(() => {
                        if (tabActive === 'upload') {
                            if (isShowCropImage || isLoading) return null;
                            let messsage;
                            if (!isHasImage) messsage = 'Click to upload new file';
                            else messsage = 'Click to select another file.';

                            if (isMultiple) {
                                return <div className="listImages">
                                    {images.map((value, key) => {
                                        return (
                                            <div className="item" key={key}>
                                                <div className="btnRemove" onClick={() => removeImage(key)}>
                                                    <CpnIcon.Remove />
                                                </div>

                                                <img src={value.src} alt="" />
                                            </div>
                                        );
                                    })}

                                    {images.length < props.maxLength ? <div className="item">
                                        <div {...getRootProps()}
                                            className={ClassNames({
                                                cpnDropZone: true,
                                                hasImage: !!isHasImage,
                                                isDragActive
                                            })}
                                        >
                                            <div className="dropzonePreviewMessage">
                                                <CpnIcon.Image />
                                                <p>{messsage} ({props.maxLength - images.length})</p>
                                            </div>
                                            <input {...getInputProps()} />
                                        </div>
                                    </div> : null}
                                </div>
                            }

                            return <div
                                {...getRootProps()}
                                className={ClassNames({
                                    cpnDropZone: true,
                                    hasImage: !!isHasImage,
                                    isDragActive
                                })}
                            >
                                <input {...getInputProps()} />
                                <div className="dropzonePreviewMessage">
                                    <CpnIcon.Image />
                                    <p>{messsage}</p>
                                </div>
                                {isHasImage ? <img src={images[0].src} alt="" /> : null}
                                <input {...getInputProps()} />
                            </div>
                        }

                        if (tabActive === 'recent_uploaded') {
                            return <div className="listImages">
                                {recentUploadStore.map((value, key) => {
                                    return (
                                        <div className="item recentUploaded" key={key} onClick={() => {
                                            props.onSelect([value]);
                                            props.onClose();
                                        }}>
                                            <img src={value} alt="" />
                                        </div>
                                    );
                                })}
                            </div>
                        }
                    })()}

                    <div className="btnActions">
                        {(() => {
                            if (isLoading) return <div className="loading">
                                <CpnIcon.Loading />
                                <p>Processing...</p>
                            </div>

                            if (tabActive === 'recent_uploaded') return null;

                            return <button onClick={hanldeUploadImage} type="button" className="submit">
                                Submit
                            </button>
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CpnPopupFileManage