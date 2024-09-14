import React from 'react';

const ResourcesTab = ({ resources }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Project Resources</h3>
    {resources && resources.length > 0 ? (
      <ul className="space-y-2">
        {resources.map((resource, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <span>{resource.name}</span>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Resource
            </a>
          </li>
        ))}
      </ul>
    ) : (
      <p>No resources have been added to this project yet.</p>
    )}
  </div>
);

export default ResourcesTab;