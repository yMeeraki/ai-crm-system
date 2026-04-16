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
      })
    );
  };

  const handleSave = () => {
    if (form.id) {
      dispatch(updateInteraction({ id: form.id, data: form }));
    } else {
      dispatch(saveInteraction(form));
    }
    dispatch(resetForm());
  };

  return (
    <div>
      <h3>Interaction Form</h3>

      <input name="hcp_name" value={form.hcp_name} onChange={handleChange} placeholder="HCP Name" />
      <br /><br />

      <textarea name="summary" value={form.summary} onChange={handleChange} placeholder="Summary" />
      <br /><br />

      <input name="products_discussed" value={form.products_discussed} onChange={handleChange} placeholder="Products" />
      <br /><br />

      <input name="sentiment" value={form.sentiment} onChange={handleChange} placeholder="Sentiment" />
      <br /><br />

      <textarea name="next_action" value={form.next_action} onChange={handleChange} placeholder="Next Action" />
      <br /><br />

      <button onClick={handleSave}>
        {form.id ? "Update" : "Save"}
      </button>
    </div>
  );
};

export default InteractionForm;