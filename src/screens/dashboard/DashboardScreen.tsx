import React, { FC } from 'react'
import Faker from 'faker'
import * as Yup from 'yup'

import {
    CpnForm, CpnTable, DateTimeUtils, CpnBox, CpnInputText, CpnInputCurrency,
    CpnInputPhone, CpnInputDateTime, CpnInputSelect, CpnInputSelectAsync, CpnInputFile,
} from '../../refs'

type Props = {}

const { formatToShow, timeToSeconds } = DateTimeUtils;

export const DashboardScreen: FC<Props> = (props) => {
    return (
        <div className="DashboardScreen">
            <CpnBox
                name="Create new user"
            >
                <CpnForm
                    structure={[
                        {
                            name: 'name',
                            label: 'Name',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputText {...state} />,
                            col: 6
                        },
                        {
                            name: 'phone',
                            label: 'Số điện thoại',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputPhone {...state} />,
                            col: 6
                        },
                        {
                            name: 'price',
                            label: 'Phí duy trì',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputCurrency {...state} suffix="đ" />,
                            col: 6
                        },
                        {
                            name: 'birthday',
                            label: 'Ngày sinh',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputDateTime {...state} />,
                            col: 6
                        },
                        {
                            name: 'gender',
                            label: 'Giới tính',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputSelect
                                {...state}
                                options={[
                                    { label: 'Nam', value: 1 },
                                    { label: 'Nữ', value: 2 },
                                    { label: 'Khác', value: 3 },
                                ]}
                            />,
                            col: 6
                        },
                        {
                            label: 'Thành phố',
                            name: 'city',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            input: (state) => <CpnInputSelectAsync
                                {...state}
                                loadOptions={(_, callBack) => {
                                    setTimeout(() => {
                                        callBack(new Array(15).fill(0).map(() => {
                                            const data = {
                                                id: Faker.random.number(),
                                                name: Faker.name.firstName(1),
                                                email: Faker.internet.email(),
                                                phone: Faker.phone.phoneNumber(),
                                                createdAt: timeToSeconds(Faker.date.past()),
                                                isActive: Faker.random.boolean()
                                            }
                                            return {
                                                label: data.name,
                                                value: data,
                                            }
                                        }))
                                    }, 300);
                                }}
                            />,
                            col: 6
                        },
                        {
                            label: 'Ảnh đại diện',
                            name: 'avatar',
                            validate: Yup.string().required('Bạn cần bổ sung.'),
                            col: 3,
                            input: (state) => <CpnInputFile
                                {...state}
                            />
                        }
                    ]}
                    handleSubmit={() => new Promise((resolve) => {
                        // setTimeout(() => {
                        //     resolve(true);
                        // }, 1000);
                    })}
                />
            </CpnBox>

            <CpnBox name="Manage Staffs" style={{ marginTop: '50px' }}>
                <CpnTable
                    search={{
                        onSelect: (e) => console.log(e),
                        loadOptions: (_) => {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(new Array(15).fill(0).map(() => {
                                        const data = {
                                            id: Faker.random.number(),
                                            name: Faker.name.firstName(1),
                                            email: Faker.internet.email(),
                                            phone: Faker.phone.phoneNumber(),
                                            createdAt: timeToSeconds(Faker.date.past()),
                                            isActive: Faker.random.boolean()
                                        }
                                        return {
                                            label: data.name,
                                            value: data,
                                        }
                                    }))
                                }, 300);
                            })
                        }
                    }}
                    structure={[
                        {
                            key: 'id',
                            label: 'ID',
                            filter: {
                                type: 'text',
                            }
                        },
                        {
                            key: 'name',
                            label: 'Tên',
                            filter: {
                                type: 'select',
                                options: [
                                    {
                                        label: 'Jason',
                                        value: 1,
                                    },
                                    {
                                        label: 'Robert',
                                        value: 2,
                                    }
                                ]
                            }
                        },
                        {
                            key: 'email',
                            label: 'Email',
                            filter: {
                                type: 'select-async',
                                loadOptions: (_, callBack) => {
                                    setTimeout(() => {
                                        callBack(new Array(10).fill(0).map(() => {
                                            const email = Faker.internet.email();
                                            return {
                                                label: email,
                                                value: email
                                            }
                                        }))
                                    }, 500);
                                }
                            }
                        },
                        {
                            key: 'phone',
                            label: 'SĐT'
                        },
                        {
                            key: 'createdAt',
                            label: 'Created At',
                            render: (value) => formatToShow(value),
                            filter: {
                                type: 'date-time-range',
                                startKey: 'createdAtFrom',
                                endKey: 'createdAtTo',
                            }
                        },
                        {
                            key: 'isActive',
                            label: 'Active',
                            toggleSwitch: () => {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(true);
                                    }, 2000);
                                })
                            }
                        }
                    ]}
                    onChange={(state) => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve({
                                    count: 82,
                                    data: new Array(state.pagination.limit).fill(0).map(() => ({
                                        id: Faker.random.number(),
                                        name: Faker.name.firstName(1),
                                        email: Faker.internet.email(),
                                        phone: Faker.phone.phoneNumber(),
                                        createdAt: timeToSeconds(Faker.date.past()),
                                        isActive: Faker.random.boolean()
                                    })),
                                })
                            }, 300);
                        })
                    }}
                />
            </CpnBox>
        </div>
    )
}