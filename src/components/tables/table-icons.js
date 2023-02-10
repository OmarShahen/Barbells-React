import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import SendIcon from '@mui/icons-material/Send'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined'
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined'
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import ContentPasteOffOutlinedIcon from '@mui/icons-material/ContentPasteOffOutlined'
import AcUnitIcon from '@mui/icons-material/AcUnit'



const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Refresh: forwardRef((props, ref) => <RefreshIcon {...props} ref={ref} />),
    Confirm: forwardRef((props, ref) => <CheckCircleIcon {...props} ref={ref} style={{ color: "dodgerblue" }}/>),
    Cancel: forwardRef((props, ref) => <DeleteForeverIcon {...props} ref={ref} />),
    Upgrade: forwardRef((props, ref) => <ManageAccountsOutlinedIcon {...props} ref={ref} />),
    Downgrade: forwardRef((props, ref) => <BadgeOutlinedIcon {...props} ref={ref} />),
    Message: forwardRef((props, ref) => <SendIcon {...props} ref={ref} />),
    Earn: forwardRef((props, ref) => <LoginIcon {...props} ref={ref} />),
    Deduct: forwardRef((props, ref) => <LogoutIcon {...props} ref={ref} />),
    InAndOut: forwardRef((props, ref) => <CompareArrowsIcon {...props} ref={ref} />),
    Stats: forwardRef((props, ref) => <QueryStatsIcon {...props} ref={ref} />),
    Unpaid: forwardRef((props, ref) => <CreditCardOffOutlinedIcon {...props} ref={ref} />),
    Paid: forwardRef((props, ref) => <CreditScoreOutlinedIcon {...props} ref={ref} />),
    ActiveRegistrations: forwardRef((props, ref) => <ContentPasteOutlinedIcon {...props} ref={ref} />),
    ExpiredRegistrations: forwardRef((props, ref) => <ContentPasteOffOutlinedIcon {...props} ref={ref} />),
    FreezedRegitrations: forwardRef((props, ref) => <AcUnitIcon {...props} ref={ref} />),

  }

export default tableIcons