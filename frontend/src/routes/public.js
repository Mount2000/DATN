
import Home from "../pages/home";
import { Marketplace } from "../pages/marketplace";
import RequestNewEvent from "../pages/admin/requestNewConcert";

import SignIn  from "../pages/auth/signin";
import SignUp from "../pages/auth/signup";
import ForgotPassword from "../pages/auth/fogotPassword";
import VerifyEmailRegister from "../pages/auth/verifyEmailRegister";
import ResetPassword from "../pages/auth/resetPassword";

import BoughtTickets from "../pages/user/boughtTickets";
import AccountDetail from "../pages/user/accountDetail";
import CreatedConcert from "../pages/user/createdConcert";

import SearchConcert from "../pages/concert/searchConcert";
import CreateEvent from "../pages/concert/createConcert";
import ConcertDetail from "../pages/concert/detail";

export const routes = [
    { path:"/", page: Home},

    { path:"/marketplace", page: Marketplace},

    { path:"/login", page: SignIn},
    { path:"/register", page: SignUp},
    { path:"/forgotPassword", page: ForgotPassword},
    { path:"/resetPassword/:token", page: ResetPassword},
    { path:"/VerifyEmailRegister/:token", page: VerifyEmailRegister},
    
    { path:"/AccountDetail", page: AccountDetail},
    { path: "/MyTickets", page: BoughtTickets},
    { path: "/MyConcerts", page: CreatedConcert},
    
    { path:"/RequestNewEvent", page: RequestNewEvent},
    { path:"/concert", page: SearchConcert},
    { path:"/createEvent", page: CreateEvent},
    { path:"/concert/:concertId", page: ConcertDetail},
]