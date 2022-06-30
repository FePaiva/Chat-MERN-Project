import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  to define a service user a base URL

const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001'
  }),

  endpoints: (builder) => ({
// creating the hooks like functions to be used to access the endpoints.
    // to create the user
    signupUser: builder.mutation({
      query: (user) => ({
          url: "/users",
          method: "POST",
          body: user,
      }),
    }),

      // login the users
      loginUser: builder.mutation({
        query: (user) => ({
            url: "/users/login",
            method: "POST",
            body: user,
        }),
      }),

      //  logout the user
      logoutUser: builder.mutation({
        query: (payload) => ({
            url: "/logout",
            method: "DELETE",
            body: payload,
        }),
    }),
}),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation } = appApi;

export default appApi;