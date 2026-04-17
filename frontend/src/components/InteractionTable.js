import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInteractions,
  deleteInteraction,
  setFormData,
} from "../features/interactionSlice";

const InteractionTable = () => {
  const dispatch = useDispatch();
  const interactions = useSelector(
    (state) => state.interaction.interactions
  );

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleEdit = (item) => {
    dispatch(setFormData(item));
    window.scrollTo({ top: 0, behavior: "smooth" }); // UX improvement
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteInteraction(id));
    }
  };

  return (
    <div className="card">
      <h3>All Interactions</h3>

      <table>
        <thead>
          <tr>
            <th>HCP</th>
            <th>Summary</th>
            <th>Products</th>
            <th>Sentiment</th>
            <th>Next Action</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {interactions.length === 0 ? (
            <tr>
              <td colSpan="6">No data found</td>
            </tr>
          ) : (
            interactions.map((item) => (
              <tr key={item.id}>
                <td>{item.hcp_name}</td>
                <td>{item.summary}</td>
                <td>{item.products_discussed}</td>
                <td>{item.sentiment}</td>
                <td>{item.next_action}</td>

                <td>
                  <button
                    className="btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InteractionTable;