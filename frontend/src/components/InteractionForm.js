import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../features/interactionSlice";

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

  return (
    <div style={{ border: "1px solid #ddd", padding: 20 }}>
      <h3>Interaction Form</h3>

      <input
        name="hcp_name"
        placeholder="HCP Name"
        value={form.hcp_name}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="summary"
        placeholder="Summary"
        value={form.summary}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="products_discussed"
        placeholder="Products"
        value={form.products_discussed}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="sentiment"
        placeholder="Sentiment"
        value={form.sentiment}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="next_action"
        placeholder="Next Action"
        value={form.next_action}
        onChange={handleChange}
      />
    </div>
  );
};

export default InteractionForm;