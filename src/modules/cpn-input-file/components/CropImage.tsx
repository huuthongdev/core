import React, { useState, useCallback } from 'react';

import Cropper from 'react-easy-crop';

const createImage = (url: string) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

function getRadianAngle(degreeValue: any) {
    return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
async function getCroppedImg(imageSrc: string, pixelCrop: any, rotation = 0, type = 'image/jpeg') {
    const image: any = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx: any = canvas.getContext('2d')

    const safeArea = Math.max(image.width, image.height) * 2

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea
    canvas.height = safeArea

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate(getRadianAngle(rotation))
    ctx.translate(-safeArea / 2, -safeArea / 2)

    // draw rotated image and store data.
    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    )
    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    )

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise(async resolve => {
        canvas.toBlob(file => {
            resolve({
                url: URL.createObjectURL(file),
                file
            })
        }, type, 1)
    })
}

type Props = {
    onSubmit: (data: any) => void,
    onClose: () => void,
    imageUrl: string,
    accept: any,
    cropImage?: any,
    labelSelectDifferentImage: any,
    labelDone: any,
}


export default function CropImage(props: Props) {
    const { onSubmit, imageUrl, onClose } = props;
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const dogImg = imageUrl;

    // ============================ Functions ============================
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
        // eslint-disable-next-line
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                dogImg,
                croppedAreaPixels,
                rotation,
                props.accept,
            )
            onSubmit(croppedImage)
        } catch (e) {
            console.error(e)
        }
        // eslint-disable-next-line
    }, [croppedAreaPixels, rotation])

    return <div className="cpnCropImage">
        <div className="croprWraper">
            <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onRotationChange={setRotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                {...props.cropImage}
            // onImageLoaded={() => {}
            />
        </div>

        <div className="btnActions">
            <button className="closeCrop" type="button" onClick={onClose}>{props.labelSelectDifferentImage}</button>
            <button className="submitCrop" type="button" onClick={showCroppedImage}>{props.labelDone}</button>
        </div>
    </div>
}

CropImage.propTypes = {}

CropImage.defaultProps = {
    onSubmit: () => {},
    onClose: () => {},
}