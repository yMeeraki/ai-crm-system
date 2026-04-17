import React from "react";
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
      form.hcp_name &&
      form.summary &&
      form.products_discussed &&
      form.sentiment 
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
      />

      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        placeholder="Summary"
      />

      <input
        name="products_discussed"
        value={form.products_discussed}
        onChange={handleChange}
        placeholder="Products"
      />

      <input
        name="sentiment"
        value={form.sentiment}
        onChange={handleChange}
        placeholder="Sentiment"
      />

      <textarea
        name="next_action"
        value={form.next_action}
        onChange={handleChange}
        placeholder="Next Action"
      />

      <button onClick={handleSave} className="btn-success">
        {form.id ? "Update" : "Save"}
      </button>
    </div>
  );
};

export default InteractionForm;
