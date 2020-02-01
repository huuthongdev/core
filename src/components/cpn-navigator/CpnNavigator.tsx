import React, { FC } from 'react'

import './CpnNavigator.scss'
import { CpnIcon } from '../../refs'

export const CpnNavigator: FC = () => {
    return (
        <div className="CpnNavigator">
            <div className="userInformation">
                <img src="https://scontent.fsgn5-7.fna.fbcdn.net/v/t31.0-1/p320x320/14352604_1687393224922358_366903501032934807_o.jpg?_nc_cat=103&_nc_ohc=2lot006WiQkAX9N52MK&_nc_ht=scontent.fsgn5-7.fna&_nc_tp=1002&oh=c967708ab63743ba1004aca014ab80cb&oe=5E995708" alt="" className="avatar" />
                <div className="content">
                    <div className="name">Mr. Jason</div>
                    <div className="role">Super Admin</div>
                </div>
            </div>

            <div className="menu">
                <div className="item active">
                    <CpnIcon.Dashboard />
                    Overview
               </div>

                <div className="groupLabel">Social</div>

                <div className="item">
                    <CpnIcon.User />
                    Users
               </div>

                <div className="item">
                    <CpnIcon.Reaction />
                    Review
               </div>

                <div className="groupLabel">Operation</div>

                <div className="item">
                    <CpnIcon.Collection />
                    Collections
               </div>

                <div className="item">
                    <CpnIcon.Place />
                    Places
               </div>
            </div>

            <div className="btnLogout">
                <CpnIcon.Power />
                Logout
            </div>
        </div>
    )
}