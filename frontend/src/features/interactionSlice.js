import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

export const suggestNextAction = createAsyncThunk(
  "interaction/suggestNextAction",
  async (summary) => {
    const res = await axios.post(`${API}/suggest-next-action`, {
      summary,
    });
    return res.data;
  },
);

/* ===== CREATE ===== */
export const saveInteraction = createAsyncThunk(
  "interaction/save",
  async (data, { dispatch }) => {
    await axios.post(`${API}/log-interaction`, data);
    toast.success("Saved successfully");
    dispatch(fetchInteractions());
  },
);

/* ===== FETCH ===== */
export const fetchInteractions = createAsyncThunk(
  "interaction/fetch",
  async () => {
    const res = await axios.get(`${API}/interactions`);
    return res.data;
  },
);

/* ===== UPDATE ===== */
export const updateInteraction = createAsyncThunk(
  "interaction/update",
  async ({ id, data }, { dispatch }) => {
    await axios.put(`${API}/edit-interaction/${id}`, data);
    toast.success("Updated successfully");
    dispatch(fetchInteractions());
    return id;
  },
);

/* ===== DELETE ===== */
export const deleteInteraction = createAsyncThunk(
  "interaction/delete",
  async (id, { dispatch }) => {
    await axios.delete(`${API}/delete-interaction/${id}`);
    toast.success("Deleted successfully");
    dispatch(fetchInteractions());
    return id;
  },
);

/* ===== SEARCH ===== */
export const searchInteractions = createAsyncThunk(
  "interaction/search",
  async (query) => {
    const res = await axios.get(`${API}/search?query=${query}`);
    return res.data;
  },
);

/* ===== CHAT ===== */
export const sendChat = createAsyncThunk(
  "interaction/sendChat",
  async (message) => {
    const res = await axios.post(`${API}/chat-log`, { message });
    return res.data;
  },
);

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

      /* FETCH */
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.interactions = action.payload;
      })

      /* SEARCH */
      .addCase(searchInteractions.fulfilled, (state, action) => {
        state.interactions = action.payload;
      })

      /* SAVE */
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

      /* UPDATE */
      .addCase(updateInteraction.fulfilled, (state) => {
        state.formData.id = null;
      })

      /* DELETE */
      .addCase(deleteInteraction.fulfilled, (state) => {})

      /* CHAT */
      .addCase(sendChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.ai_output || {};

        state.formData = {
          id: null,
          hcp_name: data.hcp_name || "",
          summary: data.summary || "",
          products_discussed: data.products_discussed || "",
          sentiment: data.sentiment || "",
          next_action: data.next_action || "",
        };
      })
      .addCase(sendChat.rejected, (state) => {
        state.loading = false;
      })

      .addCase(suggestNextAction.fulfilled, (state, action) => {
        state.formData.next_action = action.payload.next_action || "";
      });
  },
});

export const { updateField, setFormData, resetForm } = interactionSlice.actions;

export default interactionSlice.reducer;
