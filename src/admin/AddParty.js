import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const PartyTable = () => {
  const [parties, setParties] = useState([]);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyDescription, setNewPartyDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPartyId, setEditPartyId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deletePartyId, setDeletePartyId] = useState(null);

  // Fetch parties from the API
  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = () => {
    fetch('http://localhost:4000/api/parties')
      .then(response => response.json())
      .then(data => setParties(data))
      .catch(error => console.error('Error fetching parties:', error));
  };

  const handleAddParty = () => {
    fetch('http://localhost:4000/api/parties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPartyName,
        description: newPartyDescription,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setParties([...parties, data]);
        setNewPartyName('');
        setNewPartyDescription('');
        toast.success('Party created successfully!');
      })
      .catch(error => {
        console.error('Error adding party:', error);
        toast.error('Failed to create party');
      });
  };

  const handleEdit = (id) => {
    setEditMode(true);
    setEditPartyId(id);

    const partyToEdit = parties.find(party => party._id === id);
    setNewPartyName(partyToEdit.name);
    setNewPartyDescription(partyToEdit.description);
  };

  const handleUpdateParty = () => {
    fetch(`http://localhost:4000/api/parties/${editPartyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPartyName,
        description: newPartyDescription,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const updatedParties = parties.map(party => {
          if (party._id === editPartyId) {
            return data;
          }
          return party;
        });
        setParties(updatedParties);
        setNewPartyName('');
        setNewPartyDescription('');
        setEditMode(false);
        setEditPartyId(null);
        toast.success('Party updated successfully!');
      })
      .catch(error => {
        console.error('Error updating party:', error);
        toast.error('Failed to update party');
      });
  };

  const handleDelete = (id) => {
    setDeletePartyId(id);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:4000/api/parties/${deletePartyId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete party');
        }
        return response.json();
      })
      .then(() => {
        const updatedParties = parties.filter(party => party._id !== deletePartyId);
        setParties(updatedParties);
        toast.success('Party deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting party:', error);
        toast.error('Failed to delete party');
      })
      .finally(() => {
        setDeleteConfirmationOpen(false);
        setDeletePartyId(null);
      });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setDeletePartyId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Party List</h1>

      {/* Add Party Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Party Name"
          value={newPartyName}
          onChange={(e) => setNewPartyName(e.target.value)}
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Party Description"
          value={newPartyDescription}
          onChange={(e) => setNewPartyDescription(e.target.value)}
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {editMode ? (
          <button onClick={handleUpdateParty} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
            Update Party
          </button>
        ) : (
          <button onClick={handleAddParty} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
            Add Party
          </button>
        )}
      </div>

      {/* Party Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parties.map(party => (
            <tr key={party._id}>
              <td className="px-6 py-4 whitespace-nowrap">{party.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{party.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEdit(party._id)} className="mr-2 text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => handleDelete(party._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmationOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PartyTable;
