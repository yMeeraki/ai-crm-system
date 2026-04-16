import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInteractions, setFormData } from "../features/interactionSlice";
import { deleteInteraction } from "../features/interactionSlice";

const InteractionTable = () => {
  const dispatch = useDispatch();
  const interactions = useSelector((state) => state.interaction.interactions);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleEdit = (item) => {
    dispatch(setFormData(item));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteInteraction(id));
    }
  };

  return (
    <div>
      <h3>All Interactions</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>HCP</th>
            <th>Summary</th>
            <th>Products</th>
            <th>Sentiment</th>
            <th>Next Action</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {interactions.map((item) => (
            <tr key={item.id}>
              <td>{item.hcp_name}</td>
              <td>{item.summary}</td>
              <td>{item.products_discussed}</td>
              <td>{item.sentiment}</td>
              <td>{item.next_action}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractionTable;
