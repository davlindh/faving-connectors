import React from 'react';

const TeamOverview = ({ team }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Overview</h3>
    <p>{team?.description}</p>
    <div className="mt-4">
      <h4 className="font-semibold">Team Stats:</h4>
      <p>Total Members: {team?.members?.length || 0}</p>
      <p>Created At: {new Date(team?.created_at).toLocaleDateString()}</p>
    </div>
  </div>
);

export default TeamOverview;