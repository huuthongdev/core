export interface ICpnInputSelectOption {
    value: any,
    label: string,
}

export interface IButtonProps {
    label: string,
    onClick: () => void,
    type?: 'button' | 'submit'
}