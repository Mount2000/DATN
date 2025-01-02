import { configureStore } from '@reduxjs/toolkit'
import accountSlice from './accountSlice'

export default configureStore({
  reducer: {
    account: accountSlice,
  },
})