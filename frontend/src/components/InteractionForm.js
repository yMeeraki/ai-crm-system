import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateField,
  saveInteraction,
  updateInteraction,
  resetForm,
} from "../features/interactionSlice";

const InteractionForm = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.interaction.formData);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    dispatch(
      updateField({
        field: e.target.name,
        value: e.target.value,
      }),
    );
  };

  const isFormValid = () => {
    return (
      form.hcp_name.trim() &&
      form.summary.trim() &&
      form.products_discussed.trim() &&
      form.sentiment.trim() &&
      form.next_action.trim()
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      alert("Please fill all fields");
      return;
    }

    if (form.id) {
      dispatch(updateInteraction({ id: form.id, data: form }));
    } else {
      dispatch(saveInteraction(form));
    }

    dispatch(resetForm());
  };

  return (
    <div className="card">
      <h3>Interaction Form</h3>

      <input
        name="hcp_name"
        value={form.hcp_name}
        onChange={handleChange}
        placeholder="HCP Name"
        style={{
          border: !form.hcp_name ? "1px solid red" : "1px solid #ccc",
        }}
      />
      <br />
      <br />

      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        placeholder="Summary"
        style={{
          border: !form.summary ? "1px solid red" : "1px solid #ccc",
        }}
      />
      <br />
      <br />

      <input
        name="products_discussed"
        value={form.products_discussed}
        onChange={handleChange}
        placeholder="Products"
        style={{
          border: !form.products_discussed ? "1px solid red" : "1px solid #ccc",
        }}
      />
      <br />
      <br />

      <input
        name="sentiment"
        value={form.sentiment}
        onChange={handleChange}
        placeholder="Sentiment"
        style={{
          border: !form.sentiment ? "1px solid red" : "1px solid #ccc",
        }}
      />
      <br />
      <br />

      <textarea
        name="next_action"
        value={form.next_action}
        onChange={handleChange}
        placeholder="Next Action"
        style={{
          border: !form.next_action ? "1px solid red" : "1px solid #ccc",
        }}
      />
      <br />
      <br />

      <button
        onClick={handleSave}
        disabled={!isFormValid()}
        className="btn-success"
        style={{ opacity: isFormValid() ? 1 : 0.5 }}
      >
        {form.id ? "Update" : "Save"}
      </button>
    </div>
  );
};

export default InteractionForm;
