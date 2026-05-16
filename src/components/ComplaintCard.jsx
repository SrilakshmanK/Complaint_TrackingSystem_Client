import React from 'react';

const ComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
      <p className="font-semibold text-gray-900">{complaint.complaintType}</p>
      <p className="text-sm text-gray-500">{complaint.block} — Room {complaint.room}</p>
    </div>
  );
};

export default ComplaintCard;
