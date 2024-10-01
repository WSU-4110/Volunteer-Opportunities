"use client";
import Link from "next/link"
import { useState } from "react";

// Sample profiles data
const profiles = [
  {
    id: 1,
    name: "Volunteer Name",
    type: "volunteer",
    bio: "Bio of volunnteer goes here.",
    skills: ["Skill 1", "Skill 2", "Skill 3"],
    interests: ["Education", "Community Service"],
    experience: "3 years of volunteering in educational programs.",
  },
  {
    id: 2,
    name: "Organization Name",
    type: "organization",
    bio: "Bio of organization goes here",
    description: "Description of organization goes here.",
    opportunities: [
      {
        title: "Oppotunity 1 title",
        description: "description of oppotunity 1",
      },
      {
        title: "Oppotunity 2 title",
        description: "Description of oppotunity 2.",
      },
    ],
  },
];

const ViewerPage = () => {
  const [profileIndex, setProfileIndex] = useState(1); // 1 for organization, default

  const profile = profiles[profileIndex]; // Dynamically select profile

  return (
    <div className="container mx-auto p-4">
      {/* Switch between profiles */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setProfileIndex(0)}
          className={`mr-4 px-4 py-2 rounded ${
            profileIndex === 0 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Volunteer
        </button>
        <button
          onClick={() => setProfileIndex(1)}
          className={`px-4 py-2 rounded ${
            profileIndex === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Organization
        </button>
      </div>

      {/* Profile Overview */}
      <section className="profile-overview">
        <div className="mb-4">
          <img
            src="https://via.placeholder.com/300" // Replace with actual profile image
            alt={profile.name}
            className="profile-picture"
          />
        </div>
        <div className="profile-details">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="italic">{profile.bio}</p>
        </div>
      </section>

      {/* Dynamic Main Section */}
      <section className="mt-10">
        {profile.type === "volunteer" ? (
          <>
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="list-disc ml-8">
              {profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mt-4">Interests</h2>
            <ul className="list-disc ml-8">
              {profile.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mt-4">Experience</h2>
            <p>{profile.experience}</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Organization Description</h2>
            <p>{profile.description}</p>

            <h2 className="text-xl font-semibold mt-4">Opportunities</h2>
            {profile.opportunities.map((opportunity, index) => (
              <div key={index} className="mt-2">
                <h3 className="font-bold">{opportunity.title}</h3>
                <p>{opportunity.description}</p>
              </div>
            ))}
          </>
        )}
      </section>

      {/* Action Button */}
      <section className="mt-10 text-center">
        <button className="action-button">
          Message {profile.name}
        </button>
      </section>
    </div>
  );
};

export default ViewerPage;
