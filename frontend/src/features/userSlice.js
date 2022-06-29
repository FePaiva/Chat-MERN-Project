import { createSlice } from '@reduxjs/toolkit';
import appApi from '../services/appApi';

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    // actions to change the user state
    reducers: {
      addNotifications: (state, { payload}) => {},
      resetNotifications: (state, { payload}) => {},
    },
// to help save the state
    extraReducers: (builder) => {
      // to save in storage after signup
      builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, {payload}) => payload);

      // to save user after login
      builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, {payload}) => payload);

      // to logout and destroy user session. No need a payload in this case, so return null.
      builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    },
});
// the actions come from the reducers. They change the state when called.
export const { addNotifications, resetNotifications } = userSlice.actions;

export default userSlice.reducer;