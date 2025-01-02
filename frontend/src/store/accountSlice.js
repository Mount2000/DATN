import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    userName: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      state.userName = action.payload.userName
      state.role = action.payload.role
    },
    logout: (state) => {
      state.userName = null
      state.role = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { login, logout } = accountSlice.actions

export default accountSlice.reducer