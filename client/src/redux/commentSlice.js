import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentComment: null,
  loading: false,
  error: false,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    commentfetch: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentComment = action.payload;
    },
    commentfailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    addComment: (state, action) => {
      state.currentComment = [...state.currentComment, action.payload];
    },
    deleteComment: (state, action) => {
      state.currentComment.splice(
        state.currentComment.findIndex(
          (commentid) => commentid === action.payload
        ),
        1
      );
    }
  },
});

export const { commentfetch, fetchSuccess, commentfailure, addComment, deleteComment } = commentSlice.actions;

export default commentSlice.reducer;