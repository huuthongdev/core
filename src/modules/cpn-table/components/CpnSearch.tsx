import React, { FC, useState } from 'react'
import { ClassNames } from '../..';

import { ISearch } from '../types';
import CpnSearchInput from './CpnSearchInput';

type Props = {
    isVisible?: boolean,
    search?: ISearch
}

const CpnSearch: FC<Props> = (props) => {
    const { isVisible, search } = props;
    const [indexSelect, setIndexSelect] = useState(null) as any;
    const [suggests, setSuggests] = useState([]) as any[];
    const [isLoadingSuggests, setIsLoadingSuggests] = useState(false);

    // Functions
    const handleSelect = (index: any) => {
        if (!search) return;

        setSuggests([]);
        search.onSelect(suggests[index]);
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ([38, 40, 13].includes(e.which)) {
            e.preventDefault();

            if (!isVisible || !search || suggests.length === 0) return;

            switch (e.which) {
                case 38:
                    // Up
                    if (indexSelect === null) return;
                    if (indexSelect === 0) return setIndexSelect(null);
                    setIndexSelect((state: any) => state - 1);
                    break;

                case 40:
                    // Down
                    if (indexSelect === null || indexSelect === suggests.length - 1) return setIndexSelect(0);
                    setIndexSelect((state: any) => state + 1);
                    break;

                case 13:
                    // Enter
                    if (typeof indexSelect !== 'number') return;
                    setSuggests([]);
                    search.onSelect(suggests[indexSelect]);

                    break;
                default:
                    break;
            }
        }
    }

    if (!isVisible || !search) return null

    return (
        <div className="CpnTable__CpnSearch">
            <CpnSearchInput
                id="CpnSearchInputEle"
                placeholder="Search..."
                onChange={async (text) => {
                    if (!text) return setSuggests([]);
                    setIsLoadingSuggests(true);

                    try {
                        const suggestsData = await search.loadOptions(text);
                        setSuggests(suggestsData || []);
                    } catch (error) {

                    }

                    setIsLoadingSuggests(false);

                }}
                onChangeDelay={500}
                onKeyDown={handleOnKeyDown}
            />

            {isLoadingSuggests ? <div className="loadingSuggests loadingEllipsis">
                {new Array(4).fill({}).map((_, key) => <div key={key} />)}
            </div> : null}

            {suggests.length > 0 ? <div className="listSuggests">
                {suggests.map((item: any, key: number) => {
                    return <div
                        key={key}
                        className={ClassNames({
                            item: true,
                            selected: indexSelect === key
                        })}
                        onClick={() => handleSelect(key)}
                        onMouseEnter={() => setIndexSelect(null)}
                    >
                        {item.label}
                    </div>
                })}
            </div> : null}
        </div>
    )
}

export default CpnSearch