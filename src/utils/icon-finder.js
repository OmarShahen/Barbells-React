import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import GroupIcon from '@mui/icons-material/Group'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import LogoutIcon from '@mui/icons-material/Logout'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import BlockIcon from '@mui/icons-material/Block'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom'
import translations from '../i18n'

const icons = [
    { name: 'clubs', icon: <StorefrontOutlinedIcon /> },
    { name: 'registrations', icon: <ContentPasteOutlinedIcon /> },
    { name: 'attendances', icon: <DoneAllIcon /> },
    { name: 'payments', icon: <PaymentIcon /> },
    { name: 'earnings', icon: <PaymentIcon /> },
    { name: 'staffs', icon: <BadgeOutlinedIcon /> },
    { name: 'members', icon: <GroupOutlinedIcon /> },
    { name: 'packages', icon: <AppsOutlinedIcon /> },
    { name: 'cancelled registrations', icon: <DoneAllIcon /> },
    { name: 'cancelled attendances', icon: <DoneAllIcon /> },
    { name: 'freezed registrations', icon: <DoneAllIcon /> },
    { name: 'blocked', icon: <BlockIcon /> },
    { name: 'active', icon: <ToggleOnIcon /> },
    { name: 'freezed', icon: <AcUnitIcon /> },
    { name: 'cancelled', icon: <DeleteForeverIcon /> },
    { name: 'expired', icon: <EventAvailableIcon /> },
    { name: 'opened', icon: <MeetingRoomIcon /> },
    { name: 'closed', icon: <NoMeetingRoomIcon /> }

]

export const iconPicker = (iconName) => {

    for(let i=0;i<icons.length;i++) {

        if(iconName.toLowerCase() === icons[i].name) {
            return icons[i].icon
        }
    }

}