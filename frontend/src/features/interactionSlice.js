import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* ===================== CREATE ===================== */
export const saveInteraction = createAsyncThunk(
  "interaction/save",
  async (data, { dispatch }) => {
    await axios.post(`${API}/log-interaction`, data);

    // refresh list after save
    dispatch(fetchInteractions());
  }
);

/* ===================== READ ===================== */
export const fetchInteractions = createAsyncThunk(
  "interaction/fetch",
  async () => {
    const res = await axios.get(`${API}/interactions`);
    return res.data;
  }
);

/* ===================== SEARCH ===================== */
export const searchInteractions = createAsyncThunk(
  "interaction/search",
  async (query) => {
    const res = await axios.get(`${API}/search?query=${query}`);
    return res.data;
  }
);

/* ===================== UPDATE ===================== */
export const updateInteraction = createAsyncThunk(
  "interaction/update",
  async ({ id, data }, { dispatch }) => {
    await axios.put(`${API}/edit-interaction/${id}`, data);

    // always refresh (avoids bugs)
    dispatch(fetchInteractions());

    return id;
  }
);

/* ===================== DELETE ===================== */
export const deleteInteraction = createAsyncThunk(
  "interaction/delete",
  async (id, { dispatch }) => {
    await axios.delete(`${API}/delete-interaction/${id}`);

    // refresh after delete
    dispatch(fetchInteractions());

    return id;
  }
);

/* ===================== AI CHAT ===================== */
export const sendChat = createAsyncThunk(
  "interaction/sendChat",
  async (message) => {
    const res = await axios.post(`${API}/chat-log`, {
      message,
    });
    return res.data;
  }
);

/* ===================== SLICE ===================== */
const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    formData: {
      id: null,
      hcp_name: "",
      summary: "",
      products_discussed: "",
      sentiment: "",
      next_action: "",
    },
    interactions: [],
    loading: false,
  },

  reducers: {
    updateField: (state, action) => {
      state.formData[action.payload.field] = action.payload.value;
    },

    setFormData: (state, action) => {
      state.formData = action.payload;
    },

    resetForm: (state) => {
      state.formData = {
        id: null,
        hcp_name: "",
        summary: "",
        products_discussed: "",
        sentiment: "",
        next_action: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state) => {
        state.loading = false;
      })

      /* ===== SEARCH ===== */
      .addCase(searchInteractions.fulfilled, (state, action) => {
        state.interactions = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateInteraction.fulfilled, (state) => {
        state.formData.id = null;
      })

      /* ===== DELETE ===== */
      .addCase(deleteInteraction.fulfilled, (state) => {
        // already refetched, nothing needed
      })

      /* ===== SAVE ===== */
      .addCase(saveInteraction.fulfilled, (state) => {
        state.formData = {
          id: null,
          hcp_name: "",
          summary: "",
          products_discussed: "",
          sentiment: "",
          next_action: "",
        };
      })

      /* ===== CHAT ===== */
      .addCase(sendChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        state.loading = false;

        // autofill form from AI
        state.formData = {
          ...state.formData,
          ...action.payload.ai_output,
        };
      })
      .addCase(sendChat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateField, setFormData, resetForm } =
  interactionSlice.actions;

export default interactionSlice.reducer;