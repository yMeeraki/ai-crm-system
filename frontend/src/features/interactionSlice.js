import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

// CALL BACKEND AI
export const sendChat = createAsyncThunk(
  "interaction/sendChat",
  async (message) => {
    const res = await axios.post(`${API}/chat-log`, { message });
    return res.data.ai_output;
  },
);

const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    formData: {
      hcp_name: "",
      summary: "",
      products_discussed: "",
      sentiment: "",
      next_action: "",
    },
    loading: false,
  },
  reducers: {
    updateField: (state, action) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        state.loading = false;

        // AUTO-FILL FORM FROM AI
        state.formData = {
          hcp_name: action.payload.hcp_name || "",
          summary: action.payload.summary || "",
          products_discussed: action.payload.products_discussed || "",
          sentiment: action.payload.sentiment || "",
          next_action: action.payload.next_action || "",
        };
      })
      .addCase(sendChat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateField } = interactionSlice.actions;
export default interactionSlice.reducer;
