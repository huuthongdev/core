import React, { FC, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './style.scss'
import { CpnIcon } from '../../refs'

interface IAlertItem {
    id?: any,
    type: 'success' | 'warning' | 'danger',
    title?: string,
    message: string,
    secondTimeout?: number,
    isHover?: boolean,
}

interface IAlertPayload {
    type: 'success' | 'warning' | 'danger',
    title?: string,
    message: string,
}

let setAlertState: any

export function CreateAlert(payload: IAlertPayload, secondTimeout: number = 4) {
    try {
        const id = Date.now();
        // ============================ Add alert ============================

        setAlertState((state: IAlertItem[]) => ([...state, { ...payload, id, secondTimeout }]))
        // ============================ Auto remove ============================
        if (secondTimeout) setTimeout(() => {
            setAlertState((state: IAlertItem[]) => {
                const item: any = state.find(v => v.id === id);
                if (item && item.isHover) return state;
                return state.filter(v => v.id !== id);
            })
        }, secondTimeout * 1000);

    } catch (error) {
        console.error(error);
    }
}

export const CpnAlert: FC = () => {
    const [data, setData] = useState<IAlertItem[]>([]);

    setAlertState = setData;

    return (
        <div className="CpnAlert">
            <TransitionGroup className="todo-list">
                {data.map((item, key: number) => {
                    return (
                        <CSSTransition
                            key={item.id}
                            timeout={500}
                            classNames="CpnAlert__Item"
                        >
                            <div
                                className={`CpnAlert__Item ${item.type}`}
                                key={key}
                                onMouseEnter={() => {
                                    if (!item.isHover) setData(state => state.map(v => v.id === item.id ? { ...v, isHover: true } : v));
                                }}
                            >
                                <div className="icon">
                                    {(() => {
                                        if (item.type === 'success') return <CpnIcon.Checked />
                                        if (item.type === 'danger') return <CpnIcon.Danger />
                                        if (item.type === 'warning') return <CpnIcon.Warning />
                                    })()}
                                </div>
                                <div className="content">
                                    <div className="title">
                                        {item.title || item.type}
                                    </div>
                                    <div className="message">
                                        {item.message}
                                    </div>
                                </div>

                                <div className="btnRemove" onClick={() => setData(state => state.filter(v => v.id !== item.id))}>
                                    <CpnIcon.Close />
                                </div>
                            </div>
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        </div>
    )
}