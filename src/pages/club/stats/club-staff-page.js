import React, { useState, useEffect } from 'react'
import NavBar from '../../../components/navigation/nav-bar'
import SideBar from '../../../components/navigation/club-admin-side-bar'
import Card from '../../../components/cards/card'
import ClubAttendanceTable from '../../../components/tables/club/club-attendances'
import ClubRegistrationTable from '../../../components/tables/club/club-registrations'
import ClubCancelledAttendancesTable from '../../../components/tables/club/club-cancelled-attendances'
import ClubCancelledRegistrationsTable from '../../../components/tables/club/club-cancelled-registrations'
import { serverRequest } from '../../../API/request'
import toast, { Toaster } from 'react-hot-toast'
import FloatingFormButton from '../../../components/buttons/floating-button'
import StatDatePicker from '../../../components/forms/stats-date-picker-form'



const ClubStaffPage = () => {

    const headers = { 'x-access-token': localStorage.getItem('access-token') }
    const pagePath = window.location.pathname
    const clubName = pagePath.split('/')[2]
    const clubId = pagePath.split('/')[3]
    const staffId = pagePath.split('/')[6]

    const [submit, setSubmit] = useState(true)
    const [statQuery, setStatQuery] = useState({})


    const [totalRegistrations, setTotalRegistrations] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [totalAttendances, setTotalAttendances] = useState(0)
    const [totalCancelledAttendances, setTotalCancelledAttendances] = useState(0)
    const [totalCancelledRegistrations, setTotalCancelledRegistrations] = useState(0)
    const [attendances, setAttendances] = useState([])
    const [registrations, setRegistrations] = useState([])
    const [cancelledAttendances, setCancelledAttendances] = useState([])
    const [cancelledRegistrations, setCancelledRegistrations] = useState([])


    const [showTable, setShowTable] = useState('REGISTRATIONS')



    useEffect(() => {

        serverRequest.get(`staffs/${staffId}/stats`, {
            params: statQuery,
            headers
        })
        .then(response => {

            setSubmit(false)

            const data = response.data

            setTotalRegistrations(data.totalRegistrations)
            setTotalEarnings(data.totalEarnings)
            setTotalAttendances(data.totalAttendances)
            setTotalCancelledAttendances(data.totalCancelledAttendances)
            setTotalCancelledRegistrations(data.totalCancelledRegistrations)
            setAttendances(data.attendances)
            setRegistrations(data.registrations)
            setCancelledAttendances(data.cancelledAttendances)
            setCancelledRegistrations(data.cancelledRegistrations)


            toast.success('staff data loaded successfully', { duration: 5000, position: 'top-right' })
        })
        .catch(errorResponse => {
            setSubmit(false)

            console.log(errorResponse)  

            toast.error(errorResponse.message, { duration: 5000, position: 'top-right' })
        })

    }, [submit])



    return (
        <div className="blue-grey lighten-5">
            <SideBar />
            <Toaster />
            <FloatingFormButton />
            <StatDatePicker setStatQuery={setStatQuery} setSubmit={setSubmit} />
            <div className="page">
                <div className="row">
                    <div className="col s12 m12 l12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <NavBar />
                        <div className="page-main">
                            <div className="row">
                                <div className="col s12 m4">
                                    <Card title={"Registrations"} number={totalRegistrations} color={'#00e676'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={"Earnings"} number={totalEarnings} color={'#aa00ff'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={"Attendances"} number={totalAttendances} color={'#fb8c00'}/>
                                </div>
                                <div className="col s12 m4">
                                    <Card title={"Cancelled Registrations"} number={totalCancelledRegistrations} color={'red'}/>
                                </div>
                                <div className="col s12 m4"></div>
                                <div className="col s12 m4">
                                    <Card title={"Cancelled Attendances"} number={totalCancelledAttendances} color={'#ffff00'}/>
                                </div>
                            </div>
                            <div className="row card white" style={{ marginLeft: '0', marginRight: '0', paddingBottom: '1rem' }}> 
                                <div className="col s12" style={{ marginBottom: '1rem' }}>
                                    <div className="center" style={{ marginBottom: '2rem' }}>
                                        <h4>Choose Table</h4>
                                    </div>
                                    <div className="col s1"></div>
                                    <div className="col s12 m3 center">
                                        <button className="btn blue" onClick={() => setShowTable('CANCELLED-REGISTRATIONS')}>Cancelled Registrations</button>
                                    </div>
                                    <div className="col s12 m2 center">
                                        <button className="btn blue" onClick={() => setShowTable('REGISTRATIONS')}>Registrations</button>
                                    </div>
                                    <div className="col s12 m2 center">
                                        <button className="btn blue" onClick={() => setShowTable('ATTENDANCES')}>Attendances</button>
                                    </div>
                                    <div className="col s12 m3 center">
                                        <button className="btn blue" onClick={() => setShowTable('CANCELLED-ATTENDANCES')}>Cancelled Attendances</button>
                                    </div>
                                    <div className="col s1"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12">
                                    { showTable === 'ATTENDANCES' ? <ClubAttendanceTable data={attendances} loading={submit} /> : null }
                                    { showTable === 'REGISTRATIONS' ? <ClubRegistrationTable data={registrations} loading={submit} /> : null }
                                    { showTable === 'CANCELLED-ATTENDANCES' ? <ClubCancelledAttendancesTable data={cancelledAttendances} loading={submit} /> : null }
                                    { showTable === 'CANCELLED-REGISTRATIONS' ? <ClubCancelledRegistrationsTable data={cancelledRegistrations} loading={submit} /> : null }
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubStaffPage